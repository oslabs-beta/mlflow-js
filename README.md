<div style="text-align: center">
<img src="mlflow-site/public/assets/mlflow-js-logo-whitebg.png" width=600px;"/></div>

<br>

## About

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE)
![Release](https://img.shields.io/badge/Release-v1.0.0-426B20)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/Coverage-80%25-c7ea46.svg)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](/CONTRIBUTING.md)

<i>mlflow.js</i> is an open-source npm library designed for JavaScript developers who want to integrate with MLflow, providing tools and functionalities for managing machine learning lifecycle.

<a href="">Visit the official mlflow.js site for more info!</a>

Visit our LinkedIn page below:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/mlflowjs/)

<br>

## Features

<i>mlflow.js</i> covers all REST API endpoints under MLflow's Tracking Server and Model Registry. Official documentation for MLflow.js can be found <a href="">here</a>. Moreover, high-level abstraction workflows have been developed to facilitate developers' work processes.

### High-Level Abstraction Workflows

**Experiment Manager**

- runExistingExperiment - Full workflow of creating, naming, and starting a run under an existing experiment, logging metrics, params, tags, and the model, and finishing the run
- runNewExperiment - Full workflow of creating, naming, and starting a run under a new experiment, logging metrics, params,tags, and the model, and finishing the run
- experimentSummary - Returns an array of all the passed-in experiment's runs, sorted according to the passed-in metric

**Run Manager**

- cleanupRuns - Deletes runs that do not meet certain criteria and return an object of deleted runs and details
- copyRun - Copies a run from one experiment to another (without artifacts and models)

**Model Manager**

- createRegisteredModelWithVersion - Creates a new registered model and the first version of that model
- updateRegisteredModelDescriptionAndTag - Updates a registered model's description and tags
- updateAllLatestModelVersion - Updates the latest version of the specified registered model's description, adds a new alias, and tag key/value for the latest version

<br>

## Built with

[![TypeScript](https://img.shields.io/badge/TypeScript-0077B5?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-000435?style=for-the-badge&logo=javascript&logoColor=00fff)](https://www.javascript.com/)
[![React](https://img.shields.io/badge/React-36454F?style=for-the-badge&logo=React&logoColor=00fff)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-24292e?style=for-the-badge&logo=next.js&logoColor=00fff)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-008080?style=for-the-badge&logo=tailwindcss&logoColor=bfffff)](https://tailwindcss.com/)
[![ESLINT](https://img.shields.io/badge/ESLINT-4B32C3?style=for-the-badge&logo=eslint&logoColor=bfffff)](https://eslint.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)](https://nodejs.org/en/)
[![Jest](https://img.shields.io/badge/Jest-800020?style=for-the-badge&logo=jest&logoColor=00fff)](https://jestjs.io/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-30363d?style=for-the-badge&logo=github&logoColor=00fff)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-lightblue?style=for-the-badge&logo=Docker&logoColor=00fff)](https://www.docker.com/)
[![NPM](https://img.shields.io/badge/NPM-CC3534?style=for-the-badge&logo=npm&logoColor=00fff)](https://www.npmjs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-966FD6?style=for-the-badge&logo=Vercel&logoColor=00fff)](https://vercel.com/)

<br>

## Prerequisites

### Set Up MLflow UI

Ensure MLflow is installed on your system:

```bash
pip install mlflow
```

Note: MLflow is compatible with MacOS. If you encountner issues with the default system Python, consider installing Python 3 via the Homebrew package manger using `brew install python`. In this case, installing MLflow is now `pip3 install mlflow`.

### Start the MLflow Tracking Server

To start the MLflow tracking server locally, use the following command:

```bash
mlflow ui --port 5000
```

This will launch the MLflow UI on your local machine at `http://localhost:5000`.

<br>

## Quickstart

### Install MLflow.js Library

To use the MLflow.js library, navigate to your project directory and install it via npm:

```bash
npm install mlflow-js
```

### Usage Example

Here is an example of how to use the MLflow.js library to create an experiment:

```JavaScript
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

<br>

## Documentation

Official documentation for MLflow.js can be found <a href="">here</a>.

<br>

## Contributing

We welcome contributions to mlflow.js! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

<br>

## License

[MIT](/LICENSE)

<br>

## Meet The Team

| Name           | GitHub                                                                                                                   | LinkedIn                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kyler Chiago   | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/Kyler-Chiago)  | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kyler-chiago/) |
| Austin Fraser  | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/austinbfraser) | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](http://www.linkedin.com/in/austin-fraser)  |
| Stephany Ho    | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/seneyu)        | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/stephanyho/)   |
| Winston Ludlam | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/winjolu/)      | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wjludlam/)     |
| Yiqun Zheng    | [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/yiqunzheng)    | [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yiqunzheng/)   |
