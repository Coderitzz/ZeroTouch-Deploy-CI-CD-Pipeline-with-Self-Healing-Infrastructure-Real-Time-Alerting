variable "private_subnet_id" {}
variable "private_subnet_id-2" {}
variable "aws_launch_template_app_id" {}
variable "target_group_arns" {
  type = list(string)
}
