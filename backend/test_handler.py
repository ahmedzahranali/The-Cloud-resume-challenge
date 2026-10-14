import importlib
import json
import os

import boto3
import pytest
from moto import mock_aws

os.environ.update(
    AWS_ACCESS_KEY_ID="testing",
    AWS_SECRET_ACCESS_KEY="testing",
    AWS_SESSION_TOKEN="testing",
    AWS_DEFAULT_REGION="us-east-1",
)


@pytest.mark.parametrize("initial_count, expected", [(None, 1), (0, 1), (41, 42)])
@mock_aws
def test_lambda_handler_updates_count(initial_count, expected):
    dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
    table = dynamodb.create_table(
        TableName="cloud-resume-stats",
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )
    if initial_count is not None:
        table.put_item(Item={"id": "visitors", "count": initial_count})

    # Initialize the Lambda's AWS resource inside the mock context.
    handler = importlib.reload(importlib.import_module("lambda_function"))
    response = handler.lambda_handler({}, None)

    assert response["statusCode"] == 200
    assert int(json.loads(response["body"])["count"]) == expected
    assert int(table.get_item(Key={"id": "visitors"})["Item"]["count"]) == expected

    handler.lambda_handler({}, None)
    assert int(table.get_item(Key={"id": "visitors"})["Item"]["count"]) == expected + 1
