import { listarEventosRepository } from './repository.js';

export function listarEventosService(cursor?: string) {
  return listarEventosRepository(cursor);
}
