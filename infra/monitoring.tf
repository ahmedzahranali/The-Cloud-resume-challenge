resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  provider            = aws.us_east_1
  alarm_name          = "visitor-counter-lambda-errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60 # Evaluates every 60 seconds
  statistic           = "Sum"
  threshold           = 1 # Triggers if there is 1 or more errors
  alarm_description   = "This alarm monitors the Cloud Resume visitor counter Lambda for errors."
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.visitor_counter_lambda.function_name
  }

  alarm_actions = [aws_sns_topic.alarm_notifications.arn]
}

resource "aws_sns_topic" "alarm_notifications" {
  provider = aws.us_east_1
  name     = "lambda-error-alerts"
}

resource "aws_sns_topic_subscription" "email_target" {
  provider  = aws.us_east_1
  topic_arn = aws_sns_topic.alarm_notifications.arn
  protocol  = "email"
  endpoint  = "ahmedzahran851@gmail.com"
}
