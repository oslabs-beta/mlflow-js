import * as tf from '@tensorflow/tfjs-node';
import MLflow from 'mlflow-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const mlflow = new MLflow('http://localhost:5001');

const HYPERPARAMETER_SPACE = {
  networkArchitectures: [
    [16, 8],
    [32, 16],
    [64, 32],
  ],
  learningRates: [0.001, 0.01],
  batchSizes: [32, 64],
  dropoutRates: [0, 0.2],
};

const TRAINING_CONFIG = {
  epochs: 20,
  validationSplit: 0.2,
  earlyStoppingPatience: 3,
  datasetSize: 2000,
  inputFeatures: 5,
  outputClasses: 3,
  minibatchSize: 128,
};

// Data generation
function generateData() {
  return tf.tidy(() => {
    const x = tf.randomNormal([
      TRAINING_CONFIG.datasetSize,
      TRAINING_CONFIG.inputFeatures,
    ]);

    const weights = tf.randomNormal([
      TRAINING_CONFIG.inputFeatures,
      TRAINING_CONFIG.outputClasses,
    ]);
    const logits = x.matMul(weights);
    const y = tf.softmax(logits);

    // Split into train and validation sets
    const splitIdx = Math.floor(TRAINING_CONFIG.datasetSize * 0.8);

    return {
      trainX: x.slice([0, 0], [splitIdx, -1]),
      trainY: y.slice([0, 0], [splitIdx, -1]),
      testX: x.slice([splitIdx, 0], [-1, -1]),
      testY: y.slice([splitIdx, 0], [-1, -1]),
    };
  });
}

// Model creation
function createModel(architecture, learningRate, dropoutRate) {
  const model = tf.sequential();

  // Input layer
  model.add(
    tf.layers.dense({
      units: architecture[0],
      inputShape: [TRAINING_CONFIG.inputFeatures],
      activation: 'relu',
    })
  );

  if (dropoutRate > 0) {
    model.add(tf.layers.dropout({ rate: dropoutRate }));
  }

  // Hidden layers
  for (let i = 1; i < architecture.length; i++) {
    model.add(
      tf.layers.dense({
        units: architecture[i],
        activation: 'relu',
      })
    );
  }

  // Output layer
  model.add(
    tf.layers.dense({
      units: TRAINING_CONFIG.outputClasses,
      activation: 'softmax',
    })
  );

  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

class MLflowCallback extends tf.Callback {
  constructor(runId) {
    super();
    this.runId = runId;
    this.batchesLogged = 0;
    this.logInterval = 2; // Log every 2 epochs to reduce overhead
  }

  async onEpochEnd(epoch, logs) {
    if (
      epoch % this.logInterval === 0 ||
      epoch === TRAINING_CONFIG.epochs - 1
    ) {
      const metrics = [
        {
          key: 'train_loss',
          value: logs.loss,
          timestamp: Date.now(),
          step: epoch,
        },
        {
          key: 'train_accuracy',
          value: logs.acc,
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
          key: 'val_accuracy',
          value: logs.val_acc,
          timestamp: Date.now(),
          step: epoch,
        },
      ];
      await mlflow.logBatch(this.runId, metrics);
    }
  }
}

async function trainModel(model, trainX, trainY, valX, valY, runId, batchSize) {
  return await model.fit(trainX, trainY, {
    epochs: TRAINING_CONFIG.epochs,
    batchSize: batchSize,
    validationData: [valX, valY],
    callbacks: [
      tf.callbacks.earlyStopping({
        monitor: 'val_loss',
        patience: TRAINING_CONFIG.earlyStoppingPatience,
      }),
      new MLflowCallback(runId),
    ],
    shuffle: true,
  });
}

function evaluateModel(model, testX, testY) {
  return tf.tidy(() => {
    const evaluation = model.evaluate(testX, testY);
    const predictions = model.predict(testX);

    const confusionMatrix = tf.math.confusionMatrix(
      tf.argMax(testY, 1),
      tf.argMax(predictions, 1),
      TRAINING_CONFIG.outputClasses
    );

    return {
      testLoss: evaluation[0].dataSync()[0],
      testAccuracy: evaluation[1].dataSync()[0],
      confusionMatrix: confusionMatrix.arraySync(),
    };
  });
}

async function runExperiment(experimentId, hyperparams, data) {
  const runName = `NN-${hyperparams.architecture.join('-')}-lr${
    hyperparams.learningRate
  }`;
  const run = await mlflow.createRun(experimentId, runName);
  const runId = run.info.run_id;

  try {
    // Log hyperparameters
    const params = [
      { key: 'architecture', value: hyperparams.architecture.join(',') },
      { key: 'learning_rate', value: hyperparams.learningRate.toString() },
      { key: 'batch_size', value: hyperparams.batchSize.toString() },
      { key: 'dropout_rate', value: hyperparams.dropoutRate.toString() },
    ];
    await mlflow.logBatch(runId, undefined, params);

    const model = createModel(
      hyperparams.architecture,
      hyperparams.learningRate,
      hyperparams.dropoutRate
    );

    await trainModel(
      model,
      data.trainX,
      data.trainY,
      data.testX,
      data.testY,
      runId,
      hyperparams.batchSize
    );

    const evaluation = evaluateModel(model, data.testX, data.testY);

    const finalMetrics = [
      { key: 'test_loss', value: evaluation.testLoss, timestamp: Date.now() },
      {
        key: 'test_accuracy',
        value: evaluation.testAccuracy,
        timestamp: Date.now(),
      },
    ];
    await mlflow.logBatch(runId, finalMetrics);

    const tags = [
      {
        key: 'confusion_matrix',
        value: JSON.stringify(evaluation.confusionMatrix),
      },
    ];
    await mlflow.logBatch(runId, undefined, undefined, tags);

    // Save model artifacts
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const artifactsPath = `${__dirname}/../mlruns/${experimentId}/${runId}/artifacts`;
    await model.save(`file://${artifactsPath}/model`);

    await mlflow.updateRun(runId, 'FINISHED');

    return {
      runId,
      metrics: evaluation,
    };
  } catch (error) {
    console.error(`Error in run ${runId}:`, error);
    await mlflow.updateRun(runId, 'FAILED');
    throw error;
  }
}

async function main() {
  try {
    console.time('Total Execution Time');

    const experimentName = 'Neural_Network_Hyperparameter_Tuning';
    let experimentId;
    try {
      const experiment = await mlflow.getExperimentByName(experimentName);
      experimentId = experiment.experiment_id;
    } catch {
      experimentId = await mlflow.createExperiment(experimentName);
    }
    console.log(`MLflow Experiment ID: ${experimentId}`);

    console.time('Data Generation');
    const data = generateData();
    console.timeEnd('Data Generation');

    const results = [];
    let totalRuns = 0;
    const maxRuns =
      HYPERPARAMETER_SPACE.networkArchitectures.length *
      HYPERPARAMETER_SPACE.learningRates.length *
      HYPERPARAMETER_SPACE.batchSizes.length *
      HYPERPARAMETER_SPACE.dropoutRates.length;

    console.log(`\nStarting ${maxRuns} training runs...`);

    for (const architecture of HYPERPARAMETER_SPACE.networkArchitectures) {
      for (const learningRate of HYPERPARAMETER_SPACE.learningRates) {
        for (const batchSize of HYPERPARAMETER_SPACE.batchSizes) {
          for (const dropoutRate of HYPERPARAMETER_SPACE.dropoutRates) {
            totalRuns++;
            console.time(`Run ${totalRuns}`);

            const hyperparams = {
              architecture,
              learningRate,
              batchSize,
              dropoutRate,
            };

            console.log(`\nRun ${totalRuns}/${maxRuns}:`, hyperparams);

            const result = await runExperiment(experimentId, hyperparams, data);
            results.push(result);

            console.log(`Accuracy: ${result.metrics.testAccuracy.toFixed(4)}`);
            console.timeEnd(`Run ${totalRuns}`);
          }
        }
      }
    }

    const bestRun = results.reduce((best, current) => {
      return current.metrics.testAccuracy > best.metrics.testAccuracy
        ? current
        : best;
    });

    console.log('\nBest performing run:', bestRun.runId);
    console.log('Test accuracy:', bestRun.metrics.testAccuracy);

    // Register best model if accuracy is good enough
    if (bestRun.metrics.testAccuracy > 0.8) {
      const modelName = 'NeuralNetworkClassifier_Fast';
      try {
        await mlflow.createRegisteredModel(
          modelName,
          [{ key: 'task', value: 'classification' }],
          'Optimized neural network classifier'
        );

        const modelVersion = await mlflow.createModelVersion(
          modelName,
          `runs:/${bestRun.runId}/model`,
          bestRun.runId,
          [{ key: 'accuracy', value: bestRun.metrics.testAccuracy.toString() }]
        );
      } catch (e) {
        console.error('Model registration error:', e.message);
      }
    }

    tf.dispose([data.trainX, data.trainY, data.testX, data.testY]);

    console.timeEnd('Total Execution Time');
    console.log(
      `\nView results at http://localhost:5001/#/experiments/${experimentId}`
    );
  } catch (error) {
    console.error('Experiment failed:', error);
  }
}

main();
