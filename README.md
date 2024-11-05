<img src="../mlflow-js/mlflow-site/public/assets/MLflow-js-logo.png" width="500px;"/>

<br>

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/-JavaScript-000435?style=flat-square&logo=javascript&logoColor=00fff)](https://www.javascript.com/)
[![Next.js](https://img.shields.io/badge/-Next.js-000435?style=flat-square&logo=next.js&logoColor=00fff)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-000435?style=flat-square&logo=tailwindcss&logoColor=00fff)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/-Jest-800020?style=flat-square&logo=jest&logoColor=00fff)](https://jestjs.io/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=ffffff)](https://nodejs.org/en/)
[![NPM](https://img.shields.io/badge/-NPM-CC3534?style=flat-square&logo=npm&logoColor=00fff)](https://www.npmjs.com/)
[![Vercel](https://img.shields.io/badge/-Vercel-966FD6?style=flat-square&logo=vercel&logoColor=black)](https://www.npmjs.com/)

<i>mlflow.js</i> is an open-source npm library designed for JavaScript developers who want to integrate with MLflow, providing tools and functionalities for managing machine learning lifecycle.

<br>

## About

Code coverage percentage: ![Static Badge](https://img.shields.io/badge/coverage-80%25-%237e9e0f)

Release version:
![Static Badge](https://img.shields.io/badge/mlflow.js-v1.0.0-426B20?style=flat-square&label=mlflow.js&labelColor=426B20&color=282828)

<br>

## Prerequisites

### Set Up MLflow UI

Ensure MLflow is installed on your system:

```bash
pip install mlflow
```

Note: MLflow is compatible with MacOS. If you encoutner issues with the default system Python, consider installing Python 3 via the Homebrew package manger using `brew install python`. In this case, installing MLflow is now `pip3 install mlflow`.

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
npm instatll mlflow-js
```

### Usage Example

Here is an example of how to use the MLflow.js library to create an experiment:

```JavaScript
import Mlflow from 'mlflow-js';

// Initialize the MLflow client
const mlflow = new Mlflow('http://127.0.0.1:5000');

// Get the experiment client
const experimentClient = mlflow.getExperimentClient();

// Create a new experiment
async function createExperiment(){
	try {
  	await experimentClient.createExperiment('My Experiment');
  	console.log('Experiment created successfully');
	} catch (error) {
  	console.error('Error creating experiment:', error);
	}
}

createExperiment();
```

<br>

## Documentation

Official documentation for MLflow.js can be found at ...

<br>

## Meet The Team

| [<img src="../mlflow-js/mlflow-site/public/assets/kylerpfp.png" width="100px;"/></a>](https://github.com/Kyler-Chiago) | [<img src="https://github.com/austinbfraser.png" width="100px;"/></a>](https://github.com/austinbfraser)                | [<img src="https://github.com/seneyu.png" width="100px;"/></a>](https://github.com/seneyu)                    | [<img src="https://github.com/winjolu.png" width="100px;"/></a>](https://github.com/winjolu)                     | [<img src="https://github.com/yiqunzheng.png" width="100px;"/></a>](https://github.com/yiqunzheng)                |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Kyler Chiago <br> [GitHub](https://github.com/Kyler-Chiago) <br> [LinkedIn](https://www.linkedin.com/in/kyler-chiago/) | Austin Fraser <br> [GitHub](https://github.com/austinbfraser) <br> [LinkedIn](http://www.linkedin.com/in/austin-fraser) | Stephany Ho <br> [GitHub](https://github.com/seneyu) <br> [LinkedIn](https://www.linkedin.com/in/stephanyho/) | Winston Ludlam <br> [GitHub](https://github.com/winjolu/) <br> [LinkedIn](https://www.linkedin.com/in/wjludlam/) | Yiqun Zheng <br> [GitHub](https://github.com/yiqunzheng) <br> [LinkedIn](https://www.linkedin.com/in/yiqunzheng/) |

OR

- Kyler Chiago [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/Kyler-Chiago)
  [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kyler-chiago/)

- Austin Fraser [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/austinbfraser)
  [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](http://www.linkedin.com/in/austin-fraser)

- Stephany Ho [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/seneyu)
  [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/stephanyho/)

- Winston Ludlam [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/winjolu/)
  [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wjludlam/)

- Yiqun Zheng [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/yiqunzheng)
  [![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yiqunzheng/)
