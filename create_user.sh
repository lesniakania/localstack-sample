#!/bin/bash

set -e

export AWS_REGION=eu-central-1

export POOL_ID=$(
  awslocal cognito-idp list-user-pools --max-results 20 |
  jq -r '.UserPools | [.[] | select(.Name | contains("DefaultUserPool"))][0] | .Id'
)

export CLIENT_ID=$(
  awslocal cognito-idp list-user-pool-clients --user-pool-id $POOL_ID |
  jq -r '.UserPoolClients | [.[] | select(.ClientName | contains("DefaultUserPoolClient"))][0] | .ClientId'
)

export EMAIL=anna.slimak@panion.org
export PASSWORD=TestTest1@

awslocal cognito-idp admin-create-user -- \
 --user-pool-id $POOL_ID \
 --username $EMAIL \
 --temporary-password=$PASSWORD \
 --message-action SUPPRESS

awslocal cognito-idp admin-set-user-password -- \
 --user-pool-id $POOL_ID \
 --username $EMAIL \
 --password $PASSWORD
