import { Entity } from 'dynamodb-toolbox/entity';
import { Table } from 'dynamodb-toolbox/table';
import { item } from 'dynamodb-toolbox/schema/item';
import { string } from 'dynamodb-toolbox/schema/string';
import { number } from 'dynamodb-toolbox/schema/number';
import { db, TABLA_EVENTOS_FCI } from '../../datos/dynamo.js';

const TABLA_MODELO_EVENTO = new Table({
  name: TABLA_EVENTOS_FCI,
  documentClient: db,
  partitionKey: { name: 'EVENT_ID', type: 'number' }
});

export const MODELO_EVENTO = new Entity({
  name: 'Evento',
  table: TABLA_MODELO_EVENTO,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    eventId: number({ big: true }).key().savedAs('EVENT_ID'),
    title: string().savedAs('TITLE')
  })
});
