data "aws_acm_certificate" "main" {
  domain = "*.${local.base_domain_name}"
}
