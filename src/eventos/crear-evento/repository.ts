import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put';
import { MODELO_EVENTO } from '../models/evento.model.js';

export async function crearEventoRepository(eventId: number, title: string) {
  const evento = {
    eventId,
    title
  };

  const comando = MODELO_EVENTO.build(PutItemCommand)
    .item(evento)
    .options({
      condition: { attr: 'eventId', exists: false }
    });

  await comando.send();
}
