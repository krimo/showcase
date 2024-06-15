resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "Access Identity for ${var.project_name} ${var.environment_name} environment"
}

resource "aws_cloudfront_distribution" "main" {
  enabled = true

  comment = "${var.project_name} - ${var.environment_name}"

  price_class         = "PriceClass_100"
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  http_version        = "http2and3"

  aliases = local.cf_aliases

  default_cache_behavior {
    target_origin_id       = local.cloudfront_default_origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]

    response_headers_policy_id = aws_cloudfront_response_headers_policy.main.id # Managed-SecurityHeadersPolicy

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }


  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.main.arn
    ssl_support_method  = "sni-only"

    minimum_protocol_version = "TLSv1.2_2021"
  }

  origin {
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
    domain_name = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id   = local.cloudfront_default_origin_id
  }

  custom_error_response {
    error_code            = 404
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
    response_code         = 200
  }
  custom_error_response {
    error_code            = 403
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
    response_code         = 200
  }

  logging_config {
    bucket = aws_s3_bucket.cf_logs.bucket_regional_domain_name
  }

  depends_on = [
    aws_s3_bucket_ownership_controls.cf_logs
  ]
}

# This security policy is effectively the same as `Managed-SecurityHeadersPolicy` with the exception
# of missing out on `X-Frame-Options`. It's not possible to set an `ALLOW` directive so it needs to
# be omitted. We're doing that in this project due to our LMS (GetLearnWorlds.com) embedding our
# content in a frame.
resource "aws_cloudfront_response_headers_policy" "main" {
  name = "${var.environment_name}-${var.project_name}-policy"
  comment = "${var.environment_name} ${var.project_name} Custom Policy"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      override                   = false
    }
    content_type_options {
      override = true
    }
    xss_protection {
      override   = false
      protection = true
      mode_block = true
    }
    referrer_policy {
      override        = false
      referrer_policy = "strict-origin-when-cross-origin"
    }
  }
}
