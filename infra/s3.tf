resource "aws_s3_bucket" "resume_assets" {
  bucket = "the-cloud-resume-challenge-862264091652-us-east-2-an"

  tags = {
    Project = "Cloud Resume Challenge"
  }
}
