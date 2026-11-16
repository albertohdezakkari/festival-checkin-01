import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get';
import { MODELO_INSCRIPCION } from '../models/inscripcion.model.js';

export async function consultarInscripcionRepository(eventId: bigint, userId: string) {
  const { Item } = await MODELO_INSCRIPCION.build(GetItemCommand)
    .key({ eventId, userId })
    .options({ consistent: true })
    .send();

  return Item ?? null;
}
