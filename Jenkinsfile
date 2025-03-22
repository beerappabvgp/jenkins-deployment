pipeline {
    agent any

    environment {
        VM_IP = "3.110.131.250"
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

        stage('Cleanup Docker on Jenkins Server') {
            steps {
                script {
                    sh """
                        echo "Cleaning up old Docker containers and images on Jenkins..."
                        docker container prune -f
                        docker image prune -a -f
                    """
                }
            }
        }

        stage('Cleanup Docker on Backend Server VM') {
            steps {
                script {
                    sshagent(['vm-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} "
                            echo 'Cleaning up old Docker containers and images on Backend Server VM...'
                            docker container prune -f &&
                            docker image prune -a -f
                            "
                        """
                    }
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
                        def localImageName = "${IMAGE_NAME}:${env.COMMIT_SHA}"
                        def remoteImageName = "bharathbeerappa/${IMAGE_NAME}:${env.COMMIT_SHA}"
                        
                        sh "docker tag ${localImageName} ${remoteImageName}"
                        def app = docker.image(remoteImageName)
                        app.push()
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    sshagent(['vm-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} "
                            docker stop ${IMAGE_NAME} || true &&
                            docker rm ${IMAGE_NAME} || true &&
                            docker pull bharathbeerappa/${IMAGE_NAME}:${env.COMMIT_SHA} &&
                            docker run -d --name ${IMAGE_NAME} -p 5000:5000 bharathbeerappa/${IMAGE_NAME}:${env.COMMIT_SHA}
                            "
                        """
                    }
                }
            }
        }
    }
}