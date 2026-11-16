import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan';
import { MODELO_EVENTO } from '../models/evento.model.js';

const EVENTOS_POR_PAGINA = 25;

export async function listarEventosRepository(cursor?: string) {
  const inicio = cursor == null ? undefined : { EVENT_ID: BigInt(cursor) };

  const { Items = [], LastEvaluatedKey } = await MODELO_EVENTO.table.build(ScanCommand)
    .entities(MODELO_EVENTO)
    .options({
      consistent: true,
      limit: EVENTOS_POR_PAGINA,
      exclusiveStartKey: inicio
    })
    .send();

  return {
    eventos: Items.map(({ eventId, title }) => ({ eventId: String(eventId), title })),
    siguienteCursor: LastEvaluatedKey ? String(LastEvaluatedKey.EVENT_ID) : null
  };
}
