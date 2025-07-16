pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    tools {
        nodejs "NodeJS" // Make sure you configured a NodeJS tool in Jenkins with this name
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // Or change to your test script
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // If you have a build step
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
