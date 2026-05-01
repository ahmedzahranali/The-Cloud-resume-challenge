resource "aws_dynamodb_table" "visitor_counter" {
  provider     = aws.us_east_1
  name         = "cloud-resume-stats"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Project = "Cloud Resume Challenge"
  }
}
