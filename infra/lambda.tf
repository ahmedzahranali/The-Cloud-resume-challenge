resource "aws_lambda_function" "visitor_counter_lambda" {
  provider      = aws.us_east_1
  function_name = "cloud-resume-challenge"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.12"

  filename = "function.zip"

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
      last_modified,
    ]
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "cloud-resume-challenge-role-msesyv9x"
  path = "/service-role/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy" "dynamodb_access" {
  name = "DynamoDBVisitorCounterPolicy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = ["dynamodb:UpdateItem", "dynamodb:GetItem"]
      Effect   = "Allow"
      Resource = "arn:aws:dynamodb:us-east-1:862264091652:table/cloud-resume-stats"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::862264091652:policy/service-role/AWSLambdaBasicExecutionRole-e3eb38e7-ad4f-4766-a6a4-f6401bfef1ed"
}



