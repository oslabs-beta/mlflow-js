/**
 * @fileoverview Example of using MLflow.js for machine learning experiment tracking
 * This example demonstrates a simple linear regression model using TensorFlow.js
 * with MLflow tracking. It showcases:
 * - Experiment and run management
 * - Hyperparameter logging
 * - Metric tracking
 * - Model versioning
 * - Artifact storage
 *
 * The example creates a synthetic dataset and trains a linear regression model,
 * tracking various metrics and parameters throughout the training process.
 *
 * @requires @tensorflow/tfjs-node
 * @requires mlflow-js
 *
 * @note Ensure MLflow server is running at http://localhost:5001 before executing
 */

import * as tf from '@tensorflow/tfjs-node';
import MLflow from 'mlflow-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const mlflow = new MLflow('http://localhost:5001');

const HYPERPARAMETERS = {
  learningRate: 0.1,
  epochs: 10,
  batchSize: 32,
  validationSplit: 0.2,
};

const DATA_CONFIG = {
  numSamples: 1000,
  trainTestSplit: 0.7,
  trueSlope: 2,
  noiseStd: 0.1,
};

function generateData() {
  // Generate synthetic data: y = 2x + noise
  const x = tf.randomUniform([DATA_CONFIG.numSamples, 1]);
  const y = tf.tidy(() => {
    const trueValues = x.mul(DATA_CONFIG.trueSlope);
    const noise = tf.randomNormal(
      [DATA_CONFIG.numSamples, 1],
      0,
      DATA_CONFIG.noiseStd
    );
    return trueValues.add(noise);
  });

  // Split into train and test sets
  const splitIdx = Math.floor(
    DATA_CONFIG.numSamples * DATA_CONFIG.trainTestSplit
  );
  const xTrain = x.slice([0, 0], [splitIdx, 1]);
  const xTest = x.slice([splitIdx, 0], [-1, 1]);
  const yTrain = y.slice([0, 0], [splitIdx, 1]);
  const yTest = y.slice([splitIdx, 0], [-1, 1]);

  return { xTrain, yTrain, xTest, yTest };
}

function createModel() {
  const model = tf.sequential({
    layers: [tf.layers.dense({ units: 1, inputShape: [1] })],
  });

  model.compile({
    optimizer: tf.train.sgd(HYPERPARAMETERS.learningRate),
    loss: 'meanSquaredError',
    metrics: ['mse', 'mae'],
  });

  return model;
}

async function trainModel(model, xTrain, yTrain, runId) {
  const history = await model.fit(xTrain, yTrain, {
    epochs: HYPERPARAMETERS.epochs,
    batchSize: HYPERPARAMETERS.batchSize,
    validationSplit: HYPERPARAMETERS.validationSplit,
    verbose: 1,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // Log metrics for both training and validation
        const metrics = [
          {
            key: 'train_loss',
            value: logs.loss,
            timestamp: Date.now(),
            step: epoch,
          },
          {
            key: 'train_mse',
            value: logs.mse,
            timestamp: Date.now(),
            step: epoch,
          },
          {
            key: 'train_mae',
            value: logs.mae,
            timestamp: Date.now(),
            step: epoch,
          },
          {
            key: 'val_loss',
            value: logs.val_loss,
            timestamp: Date.now(),
            step: epoch,
          },
          {
            key: 'val_mse',
            value: logs.val_mse,
            timestamp: Date.now(),
            step: epoch,
          },
          {
            key: 'val_mae',
            value: logs.val_mae,
            timestamp: Date.now(),
            step: epoch,
          },
        ];

        await mlflow.logBatch(runId, metrics);
      },
    },
  });

  return history;
}

function evaluateModel(model, xTest, yTest) {
  return tf.tidy(() => {
    const yPred = model.predict(xTest);

    // Evaluation Metrics
    const mse = tf.metrics.meanSquaredError(yTest, yPred).dataSync()[0];
    const rmse = Math.sqrt(mse);
    const mae = tf.metrics.meanAbsoluteError(yTest, yPred).dataSync()[0];

    // R-squared
    const yMean = tf.mean(yTest);
    const totalSS = yTest.sub(yMean).square().sum().dataSync()[0];
    const residualSS = yTest.sub(yPred).square().sum().dataSync()[0];
    const r2 = 1 - residualSS / totalSS;

    // Model Parameters
    const weight = model.layers[0].getWeights()[0].dataSync()[0];
    const bias = model.layers[0].getWeights()[1].dataSync()[0];

    return {
      metrics: {
        mse,
        rmse,
        mae,
        r2,
      },
      parameters: {
        weight,
        bias,
      },
    };
  });
}

async function main() {
  try {
    // Initialize experiment
    const experimentName = 'Linear_Regression_Example';
    let experimentId;
    try {
      const experiment = await mlflow.getExperimentByName(experimentName);
      experimentId = experiment.experiment_id;
    } catch {
      experimentId = await mlflow.createExperiment(experimentName);
    }
    console.log(`MLflow Experiment ID: ${experimentId}`);

    // Create run
    const run = await mlflow.createRun(
      experimentId,
      'Simple Linear Regression'
    );
    const runId = run.info.run_id;
    console.log(`MLflow Run ID: ${runId}`);

    // Log hyperparameters
    const params = [
      { key: 'learning_rate', value: HYPERPARAMETERS.learningRate.toString() },
      { key: 'epochs', value: HYPERPARAMETERS.epochs.toString() },
      { key: 'batch_size', value: HYPERPARAMETERS.batchSize.toString() },
      {
        key: 'validation_split',
        value: HYPERPARAMETERS.validationSplit.toString(),
      },
      { key: 'train_test_split', value: DATA_CONFIG.trainTestSplit.toString() },
      { key: 'num_samples', value: DATA_CONFIG.numSamples.toString() },
    ];
    await mlflow.logBatch(runId, undefined, params);

    // Log dataset info
    const datasetInfo = {
      dataset: {
        name: 'synthetic_linear_regression_data',
      },
    };
    await mlflow.logInputs(runId, [datasetInfo]);

    // Generate and prepare data
    console.log('Generating data...');
    const { xTrain, yTrain, xTest, yTest } = generateData();

    // Train model
    console.log('Creating and training model...');
    const model = createModel();
    const history = await trainModel(model, xTrain, yTrain, runId);

    // Evaluate model
    const evaluation = evaluateModel(model, xTest, yTest);

    // Save model artifects
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const artifactsPath = `${__dirname}/../mlruns/${experimentId}/${runId}/artifacts`;
    await model.save(`file://${artifactsPath}`);

    // Log evaluation metrics
    const finalMetrics = [
      { key: 'test_mse', value: evaluation.metrics.mse, timestamp: Date.now() },
      {
        key: 'test_rmse',
        value: evaluation.metrics.rmse,
        timestamp: Date.now(),
      },
      { key: 'test_mae', value: evaluation.metrics.mae, timestamp: Date.now() },
      { key: 'test_r2', value: evaluation.metrics.r2, timestamp: Date.now() },
    ];
    await mlflow.logBatch(runId, finalMetrics);

    // Log model parameters
    const paramTags = [
      { key: 'model_weight', value: evaluation.parameters.weight.toString() },
      { key: 'model_bias', value: evaluation.parameters.bias.toString() },
    ];
    await mlflow.logBatch(runId, undefined, undefined, paramTags);

    // Register model if performance meets threshold
    if (evaluation.metrics.r2 > 0.9) {
      const modelName = 'LinearRegression';
      try {
        let modelExists = true;
        try {
          await mlflow.getRegisteredModel(modelName);
        } catch (err) {
          modelExists = false;
        }

        if (!modelExists) {
          await mlflow.createRegisteredModel(
            modelName,
            [{ key: 'task', value: 'regression' }],
            'Simple linear regression model'
          );
        }

        const modelVersion = await mlflow.createModelVersion(
          modelName,
          `runs:/${runId}/model`,
          runId,
          [
            { key: 'r2', value: evaluation.metrics.r2.toString() },
            { key: 'rmse', value: evaluation.metrics.rmse.toString() },
          ]
        );

        if (evaluation.metrics.r2 > 0.95) {
          await mlflow.transitionModelVersionStage(
            modelName,
            modelVersion.version,
            'staging',
            true
          );
        }
      } catch (e) {
        console.error('Model registration error:', e.message);
      }
    }

    // Log additional metadata
    const tags = [
      { key: 'model_type', value: 'linear_regression' },
      { key: 'data_source', value: 'synthetic' },
    ];
    await mlflow.logBatch(runId, undefined, undefined, tags);

    // Finish run
    await mlflow.updateRun(runId, 'FINISHED');

    // Cleanup
    tf.dispose([xTrain, yTrain, xTest, yTest]);

    console.log('\nMLflow tracking completed successfully!');
    console.log(
      `View run details at http://localhost:5001/#/experiments/${experimentId}/runs/${runId}`
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
