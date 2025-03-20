pipeline {
    agent any

    environment {
        VM_IP = "54.221.175.88"
        VM_USER = "ubuntu"
        IMAGE_NAME = "backend-server"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/beerappabvgp/jenkins-deployment.git'
            }
        }

        stage('Get Git Commit SHA') {
            steps {
                script {
                    env.COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Commit SHA: ${env.COMMIT_SHA}"
                }
            }
        }

        stage('Check Docker Installation') {
            steps {
                script {
                    sh "docker --version || echo 'Docker is NOT installed!'"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${IMAGE_NAME}:${env.COMMIT_SHA} \
                        -f docker/Dockerfile.backend .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        def app = docker.image("bharathbeerappa/backend-server:${env.COMMIT_SHA}")
                        app.push()
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    sshagent(['your-ssh-credential-id']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} << 'EOF'
                                docker stop ${IMAGE_NAME} || true
                                docker rm ${IMAGE_NAME} || true
                                docker pull bharathbeerappa/${IMAGE_NAME}:${env.COMMIT_SHA}
                                docker run -d --name ${IMAGE_NAME} -p 5000:5000 bharathbeerappa/${IMAGE_NAME}:${env.COMMIT_SHA}
                            EOF
                        """
                    }
                }
            }
        }

    }
}