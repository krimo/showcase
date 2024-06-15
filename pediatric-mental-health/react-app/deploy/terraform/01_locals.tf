locals {
  base_domain_name_overrides = {
    production = "bendhealth.com"
    demo       = "bh-demo.com"
  }
  base_domain_name_default = "bh-staging.com"
  base_domain_name         = lookup(local.base_domain_name_overrides, var.environment_name, local.base_domain_name_default)

  cf_aliases_overrides = {
    production = [
      "learn.${local.base_domain_name}",
      "bendcares.${local.base_domain_name}"
    ]
    staging = [
      "learn.${local.base_domain_name}",
      "bendcares.${local.base_domain_name}"
    ]
  }
  cf_aliases_default = [
    "learn-${var.environment_name}.${local.base_domain_name}",
  ]
  cf_aliases = lookup(local.cf_aliases_overrides, var.environment_name, local.cf_aliases_default)

  cloudfront_default_origin_id = "primary_s3"
}
