resource "aws_autoscaling_group" "app" {
  name = "app-asg"

  launch_template {
    id      = var.aws_launch_template_app_id
    version = "$Latest"
  }

  vpc_zone_identifier = [var.private_subnet_id,var.private_subnet_id-2]

  min_size         = 2
  max_size         = 4
  desired_capacity = 2

  target_group_arns =  var.target_group_arns

  health_check_type         = "ELB"
  health_check_grace_period = 300
}
