import os
import boto3
import pytest
from moto import mock_aws

os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_SECURITY_TOKEN"] = "testing"
os.environ["AWS_SESSION_TOKEN"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"

from lambda_function import lambda_handler

@mock_aws
def test_lambda_handler_updates_count():
    # 1. Settingup the Mock DynamoDB Table
    dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
    table_name = "cloud-resume-stats" # Must match my Terraform/AWS name
    
    dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
        ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
    )
    
    table = dynamodb.Table(table_name)
    table.put_item(Item={"id": "visitors", "count": 0})

    # 2. Execute the Function
    event = {}
    context = {}
    response = lambda_handler(event, context)

    # 3. Verify the Results
    updated_item = table.get_item(Key={"id": "visitors"})
    new_count = updated_item["Item"]["count"]

    assert response["statusCode"] == 200
    assert int(new_count) == 1
