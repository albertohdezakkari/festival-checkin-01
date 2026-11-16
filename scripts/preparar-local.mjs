import { readFileSync } from 'node:fs';
import { CreateTableCommand, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { parse } from 'yaml';

const cloud = parse(readFileSync(new URL('../serverless.yml', import.meta.url), 'utf8'));
const local = parse(readFileSync(new URL('../serverless.local.yml', import.meta.url), 'utf8'));
Object.assign(process.env, local.provider.environment);

const { clienteDynamo } = await import('../src/datos/dynamo.mjs');
const { handler: crearEvento } = await import('../src/eventos/crear-evento/handler.mjs');
const { handler: crearUsuario } = await import('../src/usuarios/crear-usuario/handler.mjs');

for (const [variable, { Ref }] of Object.entries(cloud.provider.environment)) {
  const table = cloud.resources.Resources[Ref];
  const TableName = local.provider.environment[variable];
  const { AttributeDefinitions, KeySchema, GlobalSecondaryIndexes, BillingMode } = table.Properties;

  try {
    await clienteDynamo.send(new CreateTableCommand({
      TableName,
      AttributeDefinitions,
      KeySchema,
      GlobalSecondaryIndexes,
      BillingMode
    }));
    console.log('Tabla creada:', TableName);
  } catch (error) {
    if (!(error instanceof ResourceInUseException)) throw error;
    console.log('Tabla disponible:', TableName);
  }
}

for (const [crear, datos] of [
  [crearEvento, { eventId: 1, title: 'Festival de otoño' }],
  [crearUsuario, {
    userId: 'usuario-02', firstName: 'Leo', lastName: 'Martín',
    email: 'leo.martin@example.com', city: 'Huesca'
  }]
]) {
  try {
    await crear(datos);
  } catch (error) {
    if (error.name !== 'ConditionalCheckFailedException') throw error;
  }
}

console.log('Datos disponibles: evento 1 y usuario-02.');
