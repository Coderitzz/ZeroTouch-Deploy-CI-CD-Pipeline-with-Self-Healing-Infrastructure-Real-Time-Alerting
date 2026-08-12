# Launch Template Outputs

output "aws_launch_template_app_id" {
  value = module.Launch_Template.aws_launch_template_app_id
}


# ALB Outputs

output "target_group_arn" {
  value = module.alb.target_group_arn
}

output "frontend_target_group_arn" {
  value = module.alb.frontend_target_group_arn
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

# IAM Outputs

output "aws_iam_instance_profile_app_instance_profile_name" {
  value = module.iam.aws_iam_instance_profile_app_instance_profile_name
}

output "jenkins_instance_profile" {
 value = module.iam.jenkins_instance_profile
}


# Security Group Outputs

output "aws_security_group_ec2_id" {
  value = module.security_group.aws_security_group_ec2_id
}

output "alb_sg_id" {
  value = module.security_group.alb_sg_id
}


# VPC Outputs

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_id" {
  value = module.vpc.public_subnet_id
}

output "public_subnet_id-2" {
  value = module.vpc.public_subnet_id-2
}

output "private_subnet_id" {
  value = module.vpc.private_subnet_id
}

output "private_subnet_id-2" {
  value = module.vpc.private_subnet_id-2
}

#Jenkins Security Group Id
output "jenkins_sg_id" {
 value = module.security_group.jenkins_sg_id
}
