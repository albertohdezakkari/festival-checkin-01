import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLA_USUARIOS_FCI } from '../../datos/dynamo.js';

export async function crearUsuarioRepository(
  { userId, firstName, lastName, email, city }: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    city?: string;
  }
) {
  const item = {
    USER_ID: userId,
    FIRST_NAME: firstName,
    LAST_NAME: lastName,
    EMAIL: email,
    CITY: city
  };

  await db.send(new PutCommand({
    TableName: TABLA_USUARIOS_FCI,
    Item: item,
    ConditionExpression: 'attribute_not_exists(USER_ID)'
  }));
}
