import { buscarEventoRepository } from './repository.js';

export function buscarEventoService(eventId: number | bigint) {
  return buscarEventoRepository(eventId);
}
