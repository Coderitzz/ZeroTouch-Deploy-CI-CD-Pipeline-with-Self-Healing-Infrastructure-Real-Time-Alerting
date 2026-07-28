#data block for trust policy
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

#IAM role for APP to use
resource "aws_iam_role" "app_instance_role" {
  name = "app-instance-role"

  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

#ECR Read-only permission
resource "aws_iam_role_policy_attachment" "app_ecr_readonly" {
  role       = aws_iam_role.app_instance_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

#App instance profile for EC2 to use it
resource "aws_iam_instance_profile" "app_instance_profile" {
  name = "app-instance-profile"

  role = aws_iam_role.app_instance_role.name
}


#----------------------------Jenikins Start-----------------------------------
#IAM for Jenkins to use
resource "aws_iam_role" "jenkins_role" {
  name = "jenkins-role"

  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}

#All permissions needed by Jenkins to perform tasks
resource "aws_iam_role_policy" "jenkins_policy" {
  name = "jenkins-policy"
  role = aws_iam_role.jenkins_role.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          # ECR — push/pull Docker images
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",

          # Auto Scaling Group
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:UpdateAutoScalingGroup",
          "autoscaling:StartInstanceRefresh",

          # ALB — check target health
          "elasticloadbalancing:DescribeTargetHealth",

          # Launch Template
          "ec2:CreateLaunchTemplateVersion",
          "ec2:DescribeLaunchTemplateVersions"
        ]

        Resource = "*"
      }
    ]
  })
}

#Jenkins Instance Profile
resource "aws_iam_instance_profile" "jenkins_instance_profile" {
  name = "jenkins-instance-profile"

  role = aws_iam_role.jenkins_role.name
}


