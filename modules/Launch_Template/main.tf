#Data Block for ami fetching
data "aws_ami" "app_ami" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

#Launch Template For ASG
resource "aws_launch_template" "app" {
  name_prefix = "app-launch-template-"

  image_id      = data.aws_ami.app_ami.id
  instance_type = "t3.micro"

  vpc_security_group_ids = [
    var.aws_security_group_ec2_id
  ]

  iam_instance_profile {
    name = var.aws_iam_instance_profile_app_instance_profile_name
  }

  user_data = base64encode(file("/home/ubuntu/modules/Launch_Template/user_data.sh"))
}
