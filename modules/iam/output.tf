#AWS instance profile name
output "aws_iam_instance_profile_app_instance_profile_name" {
 value = aws_iam_instance_profile.app_instance_profile.name
}
