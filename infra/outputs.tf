output "s3_bucket_name" {
    description = "Name of the S3 bucket"
    value       = aws_s3_bucket.website_bucket.id
}

output "s3_bucket_arn" {
    description = "ARN of the S3 bucket"
    value       = aws_s3_bucket.website_bucket.arn
}

output "s3_website_endpoint" {
    description = "S3 website endpoint"
    value       = aws_s3_bucket_website_configuration.website_bucket.website_endpoint
}

output "cloudfront_distribution_id" {
    description = "ID of the CloudFront distribution"
    value       = aws_cloudfront_distribution.website_distribution.id
}

output "cloudfront_domain_name" {
    description = "Domain name of the CloudFront distribution"
    value       = aws_cloudfront_distribution.website_distribution.domain_name
}

output "cloudfront_url" {
    description = "Full HTTPS URL of the CloudFront distribution"
    value       = "https://${aws_cloudfront_distribution.website_distribution.domain_name}"
}

output "deployment_command" {
    description = "AWS CLI command to deploy the build folder"
    value       = "aws s3 sync ./build s3://${aws_s3_bucket.website_bucket.id} --delete"
}