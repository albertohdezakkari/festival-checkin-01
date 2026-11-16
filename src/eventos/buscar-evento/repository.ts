import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get';
import { MODELO_EVENTO } from '../models/evento.model.js';

export async function buscarEventoRepository(eventId: number | bigint) {
  const { Item } = await MODELO_EVENTO.build(GetItemCommand)
    .key({ eventId })
    .options({ consistent: true })
    .send();

  return Item ?? null;
}
