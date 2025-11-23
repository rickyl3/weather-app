terraform {
    required_version = ">= 1.0"

    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 5.0"
        }
    }
}

provider "aws" {
    region = var.aws_region
}

resource "aws_s3_bucket" "website_bucket" {
    bucket = var.bucket_name

    tags = {
        Name        = "Weather App Static Website"
        Environment = var.environment
    }
}

resource "aws_s3_bucket_ownership_controls" "website_bucket" {
    bucket = aws_s3_bucket.website_bucket.id

    rule {
        object_ownership = "BucketOwnerPreferred"
    }
}

resource "aws_s3_bucket_public_access_block" "website_bucket" {
    bucket = aws_s3_bucket.website_bucket.id

    block_public_acls       = false
    block_public_policy     = false
    ignore_public_acls      = false
    restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "website_bucket" {
    depends_on = [
        aws_s3_bucket_ownership_controls.website_bucket,
        aws_s3_bucket_public_access_block.website_bucket,
    ]

    bucket = aws_s3_bucket.website_bucket.id
    acl    = "public-read"
}

resource "aws_s3_bucket_website_configuration" "website_bucket" {
    bucket = aws_s3_bucket.website_bucket.id

    index_document {
        suffix = "index.html"
    }

    error_document {
        key = "index.html"
    }
}

# S3 Bucket Policy for public read access
resource "aws_s3_bucket_policy" "website_bucket" {
    bucket = aws_s3_bucket.website_bucket.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid       = "PublicReadGetObject"
                Effect    = "Allow"
                Principal = "*"
                Action    = "s3:GetObject"
                Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
            }
        ]
    })

    depends_on = [aws_s3_bucket_public_access_block.website_bucket]
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "website_oac" {
    name                              = "${var.bucket_name}-oac"
    description                       = "OAC for Weather App S3 bucket"
    origin_access_control_origin_type = "s3"
    signing_behavior                  = "always"
    signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "website_distribution" {
    enabled             = true
    is_ipv6_enabled     = true
    default_root_object = "index.html"
    price_class         = var.cloudfront_price_class
    comment             = "Weather App CloudFront Distribution"

    origin {
        domain_name              = aws_s3_bucket.website_bucket.bucket_regional_domain_name
        origin_id                = "S3-${var.bucket_name}"
        origin_access_control_id = aws_cloudfront_origin_access_control.website_oac.id
    }

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = "S3-${var.bucket_name}"

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl                = 0
        default_ttl            = 3600
        max_ttl                = 86400
        compress               = true
    }

    # Custom error response for SPA routing
    custom_error_response {
        error_code         = 404
        response_code      = 200
        response_page_path = "/index.html"
    }

    custom_error_response {
        error_code         = 403
        response_code      = 200
        response_page_path = "/index.html"
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

    viewer_certificate {
        cloudfront_default_certificate = true
    }

    tags = {
        Name        = "Weather App Distribution"
        Environment = var.environment
    }
}

# Update S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "cloudfront_access" {
    bucket = aws_s3_bucket.website_bucket.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid    = "AllowCloudFrontServicePrincipal"
                Effect = "Allow"
                Principal = {
                    Service = "cloudfront.amazonaws.com"
                }
                Action   = "s3:GetObject"
                Resource = "${aws_s3_bucket.website_bucket.arn}/*"
                Condition = {
                    StringEquals = {
                        "AWS:SourceArn" = aws_cloudfront_distribution.website_distribution.arn
                    }
                }
            }
        ]
    })

    depends_on = [
        aws_cloudfront_distribution.website_distribution,
        aws_s3_bucket_public_access_block.website_bucket
    ]
}