pipeline {
    agent any
    tools {
        nodejs 'node18'
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install Backend Dependencies') {
            steps {
                echo '2. Instalando dependencias del Backend...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                echo '3. Ejecutando tests del Backend...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo '4. Instalando dependencias del Frontend...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                echo '5. Ejecutando tests del Frontend (Vitest)...'
                dir('frontend') {
                    sh 'npm test -- --run'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo '6. Construyendo el Frontend (npm run build)...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                echo '7. Desplegando a la VM...'
                /*
                // Quita el comentario (uncomment) de esta sección y configura las credenciales
                // cuando tengas tu clave SSH configurada en Jenkins (ID: 'vm-ssh-key')
                sshagent(credentials: ['vm-ssh-key']) {
                    // Asegúrate de usar la IP y ruta correctas
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