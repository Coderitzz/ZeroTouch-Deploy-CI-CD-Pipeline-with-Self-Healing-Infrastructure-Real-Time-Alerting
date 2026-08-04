#!/bin/bash
set -ex

# Log everything
exec > >(tee /var/log/user-data.log | logger -t user-data) 2>&1

REGION="us-west-1"
ACCOUNT_ID="692137657571"
REPO_URL="https://github.com/Coderitzz/ZeroTouch-Deploy-Jenkins-Driven-CI-CD-Pipeline-with-Automated-Health-Validation-Rollback.git"

#Install required packages

apt-get update -y
apt-get install -y docker.io git unzip curl

systemctl enable docker
systemctl start docker

# Install AWS CLI v2

cd /tmp

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip

unzip -o awscliv2.zip

./aws/install --update


# Install Docker Compose Plugin

mkdir -p /usr/local/lib/docker/cli-plugins

curl -SL \
https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
-o /usr/local/lib/docker/cli-plugins/docker-compose

chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Clone GitHub repository

cd /home/ubuntu

if [ -d "sportshub" ]; then
    rm -rf sportshub
fi

git clone "$REPO_URL" sportshub

# Create production .env

cat > /home/ubuntu/sportshub/backend/.env <<EOF
SECRET_KEY=RGA5Ex0gALjTpCcA6Ygv7FFt00zJwe9z
JWT_SECRET_KEY=YjalUwsYkPVJRDNYkmnRSMiCl5L5CiDK
DATABASE_URL=sqlite:///sportshub.db
CORS_ORIGINS=http://app-alb-1534209510.us-west-1.elb.amazonaws.com
EOF

# Login to Amazon ECR

aws ecr get-login-password --region $REGION | \
docker login \
--username AWS \
--password-stdin \
$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Deploy application

cd /home/ubuntu/sportshub

docker compose pull

docker compose down || true

docker compose up -d

# Verify deployment

docker ps -a

echo "Deployment completed successfully."
