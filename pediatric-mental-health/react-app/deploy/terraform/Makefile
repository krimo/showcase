# Convenience script, probably will be used to set up TF_WORKSPACE and others

TF_WORKSPACE := staging-staging-learn

export

.PHONY: apply console destroy graph plan output providers show init fmt

apply console destroy graph plan outputs providers show: init
	terraform $@

init:
	terraform init

fmt:
	terraform fmt -recursive
