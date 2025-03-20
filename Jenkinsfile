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

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${IMAGE_NAME}:${env.COMMIT_SHA} \
                        -f docker/Dockerfile.backend docker/
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker-hub-credentials', url: '']) {
                        sh """
                            docker tag ${IMAGE_NAME}:${env.COMMIT_SHA} \
                            your-dockerhub-username/${IMAGE_NAME}:${env.COMMIT_SHA}
                            
                            docker push your-dockerhub-username/${IMAGE_NAME}:${env.COMMIT_SHA}
                        """
                    }
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_IP} << 'EOF'
                            docker stop ${IMAGE_NAME} || true
                            docker rm ${IMAGE_NAME} || true
                            
                            docker pull your-dockerhub-username/${IMAGE_NAME}:${env.COMMIT_SHA}
                            
                            docker run -d --name ${IMAGE_NAME} \
                            -p 5000:5000 your-dockerhub-username/${IMAGE_NAME}:${env.COMMIT_SHA}
                        EOF
                    """
                }
            }
        }
    }
}
