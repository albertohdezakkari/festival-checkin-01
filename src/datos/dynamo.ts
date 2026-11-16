import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
});
export const TABLA_EVENTOS_FCI = process.env.FCI_TABLA_EVENTOS;
export const TABLA_INSCRIPCIONES_FCI = process.env.FCI_TABLA_INSCRIPCIONES;
export const TABLA_USUARIOS_FCI = process.env.FCI_TABLA_USUARIOS;
