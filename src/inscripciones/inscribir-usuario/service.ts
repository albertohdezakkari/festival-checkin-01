import { json, type ClaveInscripcion } from '../http/peticion.js';
import { buscarEventoService } from '../../eventos/buscar-evento/service.js';
import { buscarUsuarioRepository, inscribirUsuarioRepository } from './repository.js';

export async function inscribirUsuarioService({ eventId, userId }: ClaveInscripcion) {
  const evento = await buscarEventoService(eventId);
  if (!evento) return json(404, { message: 'Evento no encontrado' });

  const usuario = await buscarUsuarioRepository(userId);
  if (!usuario) return json(404, { message: 'Usuario no encontrado' });

  const registeredAt = new Date().toISOString();
  await inscribirUsuarioRepository(eventId, userId, registeredAt);
  return json(201, { message: 'Inscripción creada' });
}
