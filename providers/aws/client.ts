import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

// AWS Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1'
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

// S3 Client
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
})

// Lambda Client
export const lambdaClient = new LambdaClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
})

// DynamoDB Client
const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
})

export const dynamoDBClient = DynamoDBDocumentClient.from(dynamoClient)

// Helper Functions

// S3 Operations
export async function uploadToS3(bucket: string, key: string, body: Buffer | string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  })
  return await s3Client.send(command)
}

export async function getFromS3(bucket: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  const response = await s3Client.send(command)
  return response.Body
}

// Lambda Operations
export async function invokeLambda(functionName: string, payload: any) {
  const command = new InvokeCommand({
    FunctionName: functionName,
    Payload: JSON.stringify(payload),
  })
  return await lambdaClient.send(command)
}

// DynamoDB Operations
export async function putItemDynamoDB(tableName: string, item: Record<string, any>) {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  })
  return await dynamoDBClient.send(command)
}

export async function getItemDynamoDB(tableName: string, key: Record<string, any>) {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  })
  return await dynamoDBClient.send(command)
}

export async function queryDynamoDB(tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>) {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  })
  return await dynamoDBClient.send(command)
}
