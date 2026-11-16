import { crearEventoService } from './service.js';

export function handler({ eventId, title }: { eventId?: unknown; title?: unknown } = {}) {
  return crearEventoService(eventId, title);
}
