import { 
  DynamoDBClient, 
  CreateTableCommand, 
  ListTablesCommand, 
  DeleteTableCommand, 
  DescribeTableCommand,
  type CreateTableCommandInput 
} from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand 
} from "@aws-sdk/lib-dynamodb";

function buildClient() {
  return new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

}

const client = buildClient();

export const dynamoDb = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "users";

/**
 * Dynamic Database Operations
 * Allows performing operations on any table by passing the table name.
 */
export const db = {
  // Table Management (DDL)
  async createTable(params: CreateTableCommandInput) {
    return client.send(new CreateTableCommand(params));
  },
  
  async listTables() {
    return client.send(new ListTablesCommand({}));
  },
  
  async deleteTable(tableName: string) {
    return client.send(new DeleteTableCommand({ TableName: tableName }));
  },
  
  async describeTable(tableName: string) {
    return client.send(new DescribeTableCommand({ TableName: tableName }));
  },

  // Item Operations (DML)
  async get(tableName: string, key: Record<string, any>) {
    return dynamoDb.send(new GetCommand({ TableName: tableName, Key: key }));
  },
  
  async put(tableName: string, item: Record<string, any>) {
    return dynamoDb.send(new PutCommand({ TableName: tableName, Item: item }));
  },
  
  async update(tableName: string, key: Record<string, any>, updateParams: any) {
    return dynamoDb.send(new UpdateCommand({ TableName: tableName, Key: key, ...updateParams }));
  },
  
  async delete(tableName: string, key: Record<string, any>) {
    return dynamoDb.send(new DeleteCommand({ TableName: tableName, Key: key }));
  },
  
  async scan(tableName: string, params: any = {}) {
    return dynamoDb.send(new ScanCommand({ TableName: tableName, ...params }));
  },
  
  async query(tableName: string, params: any) {
    return dynamoDb.send(new QueryCommand({ TableName: tableName, ...params }));
  }
};
