import { handleRequest, type PeticionHttp } from '../http/peticion.js';
import { inscribirUsuarioService } from './service.js';

export function handler(event: PeticionHttp) {
  return handleRequest(event, inscribirUsuarioService);
}
