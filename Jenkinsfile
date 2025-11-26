pipeline {
    agent any
    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '1. Código clonado automáticamente desde el SCM.'
            }
        }

        stage('Install Backend Dependencies') {
            agent {
                docker { 
                    image 'node:lts-alpine' 
                    args '-u root'
                }
            }
            steps {
                echo '2. Instalando dependencias del Backend (dentro de Docker)...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            agent {
                docker { image 'node:lts-alpine' }
            }
            steps {
                echo '3. Ejecutando tests del Backend (dentro de Docker)...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            agent {
                docker { image 'node:lts-alpine' }
            }
            steps {
                echo '4. Instalando dependencias del Frontend (dentro de Docker)...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            agent {
                docker { image 'node:lts-alpine' }
            }
            steps {
                echo '5. Ejecutando tests del Frontend (Vitest, dentro de Docker)...'
                dir('frontend') {
                    sh 'npm test -- --run'
                }
            }
        }

        stage('Build Frontend') {
            agent {
                docker { image 'node:lts-alpine' }
            }
            steps {
                echo '6. Construyendo el Frontend (npm run build, dentro de Docker)...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Deploy to VM') {
            steps {
                echo '7. Desplegando a la VM...'
                /*
                // QUITA EL COMENTARIO Y EDITA LOS VALORES (vm-ssh-key, usuario, tu-vm-ip, /ruta/en/vm...)
                sshagent(credentials: ['vm-ssh-key']) {
                    // 1. Copia el Backend
                    sh 'scp -o StrictHostKeyChecking=no -r backend/* usuario@tu-vm-ip:/ruta/en/vm/rescate-fresco/backend/'
                    // 2. Copia los archivos estáticos del Frontend
                    sh 'scp -o StrictHostKeyChecking=no -r frontend/dist/* usuario@tu-vm-ip:/ruta/en/vm/rescate-fresco/frontend/dist/'
                    // 3. Ejecuta comandos de reinicio en la VM
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