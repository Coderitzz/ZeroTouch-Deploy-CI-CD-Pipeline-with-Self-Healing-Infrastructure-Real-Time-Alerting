#AWS instance profile name
output "aws_iam_instance_profile_app_instance_profile_name" {
 value = aws_iam_instance_profile.app_instance_profile.name
}

output "jenkins_instance_profile" {
 value = aws_iam_instance_profile.jenkins_instance_profile.name
}
