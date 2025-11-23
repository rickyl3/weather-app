variable "aws_region" {
    description = "AWS region for all resources"
    type        = string
    default     = "us-east-1"
}

variable "bucket_name" {
    description = "Name of S3 bucket for static website hosting"
    type        = string
    default     = "weather-app-static-site"

    validation {
        condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.bucket_name))
        error_message = "Bucket name must be lowercase alphanumeric with hyphens, starting and ending with alphanumeric characters."
    } 
}

variable "environment" {
    description = "Environment name (e.g. dev, stating production)"
    type        = string
    default     = "production"
}

variable "cloudfront_price_class" {
    description = "CloudFront price class(PriceClass_All, PriceClass_200, PriceClass_100)"
    type        = string
    default     = "PriceClass_100"

    validation {
        condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
        error_message = "CloudFront price class must be PriceClass_All, PriceClass_200, or PriceClass_100."
    }
}