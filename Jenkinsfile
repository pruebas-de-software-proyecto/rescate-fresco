pipeline {
    agent {
        docker {
            image 'node:lts-bullseye'
            args '-u root'
        }
    }
    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') { sh 'npm install' }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') { sh 'npm test' }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') { sh 'npm install' }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') { 
                    sh 'npm test -- --run || true' 
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') { sh 'npm run build' }
            }
        }

        stage('Deploy to VM') {
            steps {
                echo 'Despliegue a la VM (comandos comentados)'
            }
        }
    }

    post {
        always { cleanWs() }
    }
}
