import { Entity } from 'dynamodb-toolbox/entity';
import { Table } from 'dynamodb-toolbox/table';
import { item } from 'dynamodb-toolbox/schema/item';
import { number } from 'dynamodb-toolbox/schema/number';
import { string } from 'dynamodb-toolbox/schema/string';
import { db, TABLA_INSCRIPCIONES_FCI } from '../../datos/dynamo.js';

const tablaInscripciones = new Table({
  name: TABLA_INSCRIPCIONES_FCI,
  documentClient: db,
  partitionKey: { name: 'EVENT_ID', type: 'number' },
  sortKey: { name: 'USER_ID', type: 'string' }
});

export const MODELO_INSCRIPCION = new Entity({
  name: 'Inscripcion',
  table: tablaInscripciones,
  entityAttribute: false,
  timestamps: false,
  schema: item({
    eventId: number({ big: true }).key().savedAs('EVENT_ID'),
    userId: string().key().savedAs('USER_ID'),
    registeredAt: string().savedAs('REGISTERED_AT'),
    checkedInAt: string().optional().savedAs('CHECKED_IN_AT')
  })
});
