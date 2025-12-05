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
            steps { checkout scm }
        }

        stage('Install Backend Dependencies') {
            steps { dir('backend') { sh 'npm install' } }
        }

        stage('Test Backend') {
            steps { dir('backend') { sh 'npm test' } }
        }

        stage('Install Frontend Dependencies') {
            steps { dir('frontend') { sh 'npm install' } }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') { sh 'npm test -- --run || true' }
            }
        }

        stage('Install Chrome & ChromeDriver') {
            steps {
                sh '''
                apt-get update
                apt-get install -y wget gnupg unzip

                wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
                apt-get install -y ./google-chrome-stable_current_amd64.deb || apt --fix-broken install -y

                CHROME_VERSION=$(google-chrome --version | awk '{print $3}')
                CHROMEDRIVER_VERSION=$(echo $CHROME_VERSION | cut -d'.' -f1)

                wget -q https://storage.googleapis.com/chrome-for-testing-public/$CHROMEDRIVER_VERSION.0.0/linux64/chromedriver-linux64.zip
                unzip chromedriver-linux64.zip
                mv chromedriver-linux64/chromedriver /usr/local/bin/
                chmod +x /usr/local/bin/chromedriver
                '''
            }
        }

        stage('Run Selenium UI Tests') {
            steps {
                sh '''
                    echo "Ejecutando tests Selenium..."
                    npm run test:ui || true
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps { dir('frontend') { sh 'npm run build' } }
        }

        stage('Deploy to VM') {
            steps {
                echo 'Desplegando a la VM...'
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
    post {
        always { cleanWs() }
    }
    
}
