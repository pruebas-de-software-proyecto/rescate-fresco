pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '1. Clonando el repositorio...'
                checkout scm
            }
        }

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
                    // Si tu comando de test es diferente (ej. 'npm run test:ci'), cámbialo aquí
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                // Entra al directorio 'frontend' y corre 'npm install'
                echo '4. Instalando dependencias del Frontend...'
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                // Corre los tests de Vitest
                echo '5. Ejecutando tests del Frontend (Vitest)...'
                dir('frontend') {
                    // Usamos 'npm test -- --run' para que Vitest ejecute los tests una vez y termine
                    // (el '--' pasa el argumento '--run' al script 'vitest')
                    sh 'npm test -- --run'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                // "Construye" la aplicación de React/Vite
                // Esto crea la carpeta 'dist' con los archivos estáticos (HTML, JS, CSS)
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
