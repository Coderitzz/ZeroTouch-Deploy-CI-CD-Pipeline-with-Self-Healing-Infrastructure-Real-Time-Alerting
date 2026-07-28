resource "aws_s3_bucket" "mybucket" {
  bucket = "zero-touch-deploy-state-backend"
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.mybucket.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "enabled_versioning" {
  bucket = aws_s3_bucket.mybucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
