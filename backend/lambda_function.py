import json
import boto3

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cloud-resume-stats')

def lambda_handler(event, context):
    # Atomic update: Increments the 'count' attribute for the 'visitors' ID
    response = table.update_item(
        Key={'id': 'visitors'},
        UpdateExpression='SET #c = if_not_exists(#c, :zero) + :val',
        ExpressionAttributeNames={'#c': 'count'},
        ExpressionAttributeValues={':val': 1, ':zero': 0},
        ReturnValues='UPDATED_NEW'
    )
    
    # Get the updated count from the response
    visitor_count = str(response['Attributes']['count'])

    # Return the count with CORS headers enabled
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*', # Adjust this to your domain for better security
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps({'count': visitor_count})
    }
