<div style="text-align: center">
<img src="mlflow-site/public/assets/MLflow-js-logo.png" width="500px;"/></div>

<br>

<div style="text-align: center">

<!-- [![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/-JavaScript-000435?style=flat-square&logo=javascript&logoColor=00fff)](https://www.javascript.com/)
[![Next.js](https://img.shields.io/badge/-Next.js-24292e?style=flat-square&logo=next.js&logoColor=00fff)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-008080?style=flat-square&logo=tailwindcss&logoColor=bfffff)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=ffffff)](https://nodejs.org/en/)
[![Jest](https://img.shields.io/badge/-Jest-800020?style=flat-square&logo=jest&logoColor=00fff)](https://jestjs.io/)
[![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-30363d?style=flat-square&logo=GitHub&logoColor=00fff)](https://github.com/features/actions)
[![NPM](https://img.shields.io/badge/-NPM-CC3534?style=flat-square&logo=npm&logoColor=00fff)](https://www.npmjs.com/)
[![Vercel](https://img.shields.io/badge/-Vercel-966FD6?style=flat-square&logo=vercel&logoColor=black)](https://vercel.com/) -->

</div>

<br>

## About

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](/LICENSE)
![Release](https://img.shields.io/badge/Release-v1.0.0-426B20)
![Build](https://img.shields.io/badge/Build-Passing-3bb143.svg)
![Static Badge](https://img.shields.io/badge/Coverage-80%-c7ea46.svg)
[![Contributions](https://img.shields.io/badge/Contributions-Welcome-3bb143.svg)](/CONTRIBUTING.md)

<i>mlflow.js</i> is an open-source npm library designed for JavaScript developers who want to integrate with MLflow, providing tools and functionalities for managing machine learning lifecycle.

<a href="">Check out the mlflow.js official site here!</a>

<!-- ![Build Status](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c7c_Build-Passing-brightgreen.svg) -->

Vist our LinkedIn page here:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/mlflowjs/)

<br>

## Features

<i>mlflow.js</i> covers all REST API endpoints under MLFlow's Tracking Server and Model Registry. Moreover, high-level abstraction workflows are developed in hope to facilitate developers' work process.

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
npm install mlflow-js
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

Official documentation for MLflow.js can be found <a href="">here</a>.

<br>

## Contributing

We welcome contributions to mlflow.js! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

<br>

## License

[MIT](/LICENSE)

<br>

## Meet The Team

| [<img src="mlflow-site/public/assets/kylerpfp.png" width="100px;"/></a>](https://github.com/Kyler-Chiago)              | [<img src="https://github.com/austinbfraser.png" width="100px;"/></a>](https://github.com/austinbfraser)                | [<img src="https://github.com/seneyu.png" width="100px;"/></a>](https://github.com/seneyu)                    | [<img src="https://github.com/winjolu.png" width="100px;"/></a>](https://github.com/winjolu)                     | [<img src="https://github.com/yiqunzheng.png" width="100px;"/></a>](https://github.com/yiqunzheng)                |
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
