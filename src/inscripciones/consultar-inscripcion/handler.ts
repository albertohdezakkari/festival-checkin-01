import { handleRequest, type PeticionHttp } from '../http/peticion.js';
import { consultarInscripcionService } from './service.js';

export function handler(event: PeticionHttp) {
  return handleRequest(event, consultarInscripcionService);
}
