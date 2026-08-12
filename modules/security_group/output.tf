# EC2's security_group id
output "aws_security_group_ec2_id" {
 value = aws_security_group.ec2_sg.id
}

#ALB Security group id
output "alb_sg_id" {
 value = aws_security_group.alb_sg.id
}

#Jenkins Security Group Id
output "jenkins_sg_id" {
 value = aws_security_group.jenkins_sg.id
}
