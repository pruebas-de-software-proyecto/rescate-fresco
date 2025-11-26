pipeline {
    agent any
    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '1. Código clonado automáticamente desde el SCM.'
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            agent {
                docker { 
                    image 'node:lts-bullseye' // Imagen Debian + Node.js LTS
                    args '-u root'            // Permite instalar paquetes del sistema si es necesario
                }
            }
            steps {
                echo '2. Instalando dependencias del Backend...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            agent {
                docker { 
                    image 'node:lts-bullseye'
                    args '-u root'
                }
            }
            steps {
                echo '3. Ejecutando tests del Backend...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            agent {
                docker { 
                    image 'node:lts-bullseye'
                    args '-u root'
                }
            }
            steps {
                echo '4. Instalando dependencias del Frontend...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            agent {
                docker { 
                    image 'node:lts-bullseye'
                    args '-u root'
                }
            }
            steps {
                echo '5. Ejecutando tests del Frontend (Vitest)...'
                dir('frontend') {
                    sh 'npm test -- --run'
                }
            }
        }

        stage('Build Frontend') {
            agent {
                docker { 
                    image 'node:lts-bullseye'
                    args '-u root'
                }
            }
            steps {
                echo '6. Construyendo el Frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                echo '7. Desplegando a la VM...'
                /*
                sshagent(credentials: ['vm-ssh-key']) {
                    sh 'scp -o StrictHostKeyChecking=no -r backend/* usuario@tu-vm-ip:/ruta/en/vm/rescate-fresco/backend/'
                    sh 'scp -o StrictHostKeyChecking=no -r frontend/dist/* usuario@tu-vm-ip:/ruta/en/vm/rescate-fresco/frontend/dist/'
                    sh 'ssh usuario@tu-vm-ip "cd /ruta/en/vm/rescate-fresco/backend && npm install --production && pm2 restart tu-app"'
                }
                */
                echo '¡Despliegue de ejemplo completado!'
            }
        }
    }

    post {
        always {
            echo 'Limpiando el workspace...'
            cleanWs()
        }
    }
}
