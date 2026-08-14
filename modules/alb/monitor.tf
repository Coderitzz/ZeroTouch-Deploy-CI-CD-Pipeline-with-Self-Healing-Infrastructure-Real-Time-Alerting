resource "aws_sns_topic" "alerts" {
  name = "sportshub-alerts"
}

resource "aws_cloudwatch_metric_alarm" "backend_unhealthy" {
  alarm_name          = "backend-unhealthy-targets"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Triggers when backend target group has unhealthy hosts"

  dimensions = {
    TargetGroup  = aws_lb_target_group.app_tg.arn_suffix
    LoadBalancer = aws_lb.app_alb.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "frontend_unhealthy" {
  alarm_name          = "frontend-unhealthy-targets"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnHealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Triggers when frontend target group has unhealthy hosts"

  dimensions = {
    TargetGroup  = aws_lb_target_group.frontend.arn_suffix
    LoadBalancer = aws_lb.app_alb.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
}
