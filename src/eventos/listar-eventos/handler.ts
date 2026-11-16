import { listarEventosService } from './service.js';

export function listarEventosHandler({ cursor }: { cursor?: string } = {}) {
  return listarEventosService(cursor);
}
