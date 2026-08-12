#ALB used inn
resource "aws_lb" "app_alb" {
  name               = "app-alb"
  load_balancer_type = "application"

  subnets         = [var.public_subnet_id,var.public_subnet_id-2]
  security_groups = [var.alb_sg_id]

  internal = false
}

#Target Group for frontend
resource "aws_lb_target_group" "frontend" {
  name        = "app-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

#Target Group for backend
resource "aws_lb_target_group" "app_tg" {
  name        = "app-target-group"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    path                = "/api/health"
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
  }
}

#Load balancer listener for frontend
resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_alb.arn

  port     = 80
  protocol = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

#Load Balancer listener for backend
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.app_listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn  
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}
