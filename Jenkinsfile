pipeline {
    agent {
        docker { image 'node:19-alpine' }
    }

    stages {
        stage('Install Dependencies') {
            steps {
                dir('mlflow') {
                    sh 'npm install'
                }
            }
        }
        stage('Lint') {
            steps {
                dir('mlflow') {
                    sh 'npm run lint'
                }
            }
        }
        stage('Bundle') {
            steps {
                dir('mlflow') {
                    sh 'npm run build'
                }
            }
        }
    }
}