import { json, type ClaveInscripcion } from '../http/peticion.js';
import { buscarEventoService } from '../../eventos/buscar-evento/service.js';
import { consultarInscripcionRepository } from './repository.js';

export async function consultarInscripcionService({ eventId, userId }: ClaveInscripcion) {
  const evento = await buscarEventoService(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const registration = await consultarInscripcionRepository(eventId, userId);
  return json(200, {
    eventId: evento.eventId,
    title: evento.title,
    registration
  });
}
