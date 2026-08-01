#!/bin/bash

# Update package lists
apt-get update -y

# Install Docker
apt-get install -y docker.io

# Start Docker
systemctl start docker

# Enable Docker to start automatically on boot
systemctl enable docker

# Part 2: ECR login + pull + run
# TODO: Add ECR authentication, image pull, and container run commands here
