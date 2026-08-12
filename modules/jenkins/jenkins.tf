#Key-pair created
resource "aws_key_pair" "jenkins_key" {
  key_name   = "jenkins-key"
  public_key = file("/home/ubuntu/.ssh/jenkins-key.pub")
}

#Data block for AMI of jenkins
#Data Block for ami fetching
data "aws_ami" "jenkins_ami" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

#Jenkins Instance
resource "aws_instance" "jenkins" {
  ami                          = data.aws_ami.jenkins_ami.id
  instance_type                = "m7i-flex.large"
  subnet_id                    = var.public_subnet_id
  vpc_security_group_ids       = [var.jenkins_sg_id]
  iam_instance_profile         = var.jenkins_instance_profile
  key_name                     = aws_key_pair.jenkins_key.key_name
  associate_public_ip_address  = true
  user_data                    = file("/home/ubuntu/modules/jenkins/jenkins_user_data.sh")

  tags = {
    Name = "jenkins-server"
  }
}

output "jenkins_public_ip" {
  value = aws_instance.jenkins.public_ip
}
