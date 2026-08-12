#!/bin/bash
set -ex
exec > >(tee /var/log/jenkins-user-data.log | logger -t jenkins-user-data) 2>&1

# Update packages
apt-get update -y

# Install Java (Jenkins requires Java 17 or 21 for recent versions)
apt-get install -y fontconfig openjdk-21-jre unzip

# Add Jenkins repo key and source
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key | \
  sudo gpg --dearmor -o /usr/share/keyrings/jenkins-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.gpg]" \
  "https://pkg.jenkins.io/debian-stable binary/" | \
  tee /etc/apt/sources.list.d/jenkins.list > /dev/null

apt-get update -y

# Install Jenkins
apt-get install -y jenkins

# Install Docker (Jenkins pipeline will need this to build images)
apt-get install -y docker.io
systemctl enable docker
systemctl start docker

# Allow jenkins user to run docker commands
usermod -aG docker jenkins

# Install AWS CLI v2 (needed for ECR auth, ASG commands, etc.)
cd /tmp
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip -o awscliv2.zip
./aws/install --update

# Start Jenkins
systemctl enable jenkins
systemctl start jenkins

echo "Jenkins installation complete
