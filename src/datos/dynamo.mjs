import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const endpoint = process.env.FCI_DYNAMODB_LOCAL;
const config = endpoint ? {
  endpoint,
  region: 'us-east-1',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' }
} : {};

export const clienteDynamo = new DynamoDBClient(config);
export const db = DynamoDBDocumentClient.from(clienteDynamo, {
  marshallOptions: { removeUndefinedValues: true }
});
export const TABLA_EVENTOS_FCI = process.env.FCI_TABLA_EVENTOS;
export const TABLA_INSCRIPCIONES_FCI = process.env.FCI_TABLA_INSCRIPCIONES;
export const TABLA_USUARIOS_FCI = process.env.FCI_TABLA_USUARIOS;
