<!-- README for NPM; the one for GitHub is in .github directory. -->

# mlflow.js

A JavaScript library for MLflow.

# Install

```bash
npm install mlflow-js
```

# Usage

An example of how to create an experiment:

```bash
import Mlflow from 'mlflow-js';

// Initialize the MLflow client
const mlflow = new Mlflow('http://127.0.0.1:5000');

// Create a new experiment
async function createExperiment(){
	await mlflow.createExperiment('My Experiment');
	console.log('Experiment created successfully');
}

createExperiment();
```

# Documentation

See [https://www.mlflow-js.org/](https://www.mlflow-js.org/)
