```groovy
pipeline {
    agent any

    environment {
        AWS_REGION   = 'us-west-1'
        ACCOUNT_ID   = '692137657571'

        ECR_BACKEND  = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sportshub-backend"
        ECR_FRONTEND = "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/sportshub-frontend"

        ASG_NAME     = 'app-asg'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('ECR Login') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login \
                        --username AWS \
                        --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                '''
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    sh '''
                        docker build \
                            -t $ECR_BACKEND:$BUILD_NUMBER \
                            .

                        docker tag \
                            $ECR_BACKEND:$BUILD_NUMBER \
                            $ECR_BACKEND:latest

                        docker push $ECR_BACKEND:$BUILD_NUMBER
                        docker push $ECR_BACKEND:latest
                    '''
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        docker build \
                            -t $ECR_FRONTEND:$BUILD_NUMBER \
                            .

                        docker tag \
                            $ECR_FRONTEND:$BUILD_NUMBER \
                            $ECR_FRONTEND:latest

                        docker push $ECR_FRONTEND:$BUILD_NUMBER
                        docker push $ECR_FRONTEND:latest
                    '''
                }
            }
        }

        stage('Deploy - Instance Refresh') {
            steps {
                sh '''
                    aws autoscaling start-instance-refresh \
                        --auto-scaling-group-name $ASG_NAME \
                        --preferences '{"MinHealthyPercentage": 50, "InstanceWarmup": 300}'
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful — build #${BUILD_NUMBER}"
        }

        failure {
            echo "Pipeline failed — check logs above"
        }
    }
}

