provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region
}

module "vpc" {
  source = "./modules/vpc"
}

module "iam" {
  source = "./modules/iam"
}

module "security_group" {
  source = "./modules/security_group"
  vpc_id = module.vpc.vpc_id
}

module "Launch_Template" {
  source = "./modules/Launch_Template"
  aws_security_group_ec2_id  = module.security_group.aws_security_group_ec2_id
  aws_iam_instance_profile_app_instance_profile_name = module.iam.aws_iam_instance_profile_app_instance_profile_name
}

module "asg" {
  source = "./modules/asg"
  private_subnet_id = module.vpc.private_subnet_id
  private_subnet_id-2 = module.vpc.private_subnet_id-2
  aws_launch_template_app_id = module.Launch_Template.aws_launch_template_app_id
  target_group_arns = [module.alb.target_group_arn,
                      module.alb.frontend_target_group_arn]
}

module "alb" {
  source = "./modules/alb"
  vpc_id = module.vpc.vpc_id
  public_subnet_id = module.vpc.public_subnet_id
  public_subnet_id-2 = module.vpc.public_subnet_id-2
  alb_sg_id = module.security_group.alb_sg_id
}

module "frontend_ecr" {
  source = "./modules/ecr"
  
  repository_name = "sportshub-frontend"
}

module "backend_ecr" {
  source = "./modules/ecr"

  repository_name = "sportshub-backend"
}

module "jenkins" {
  source = "./modules/jenkins"
  public_subnet_id = module.vpc.public_subnet_id
  jenkins_sg_id = module.security_group.jenkins_sg_id
  jenkins_instance_profile = module.iam.jenkins_instance_profile
}
