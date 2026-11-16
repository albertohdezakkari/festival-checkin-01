import { crearUsuarioService, type DatosUsuario } from './service.js';

export function handler({ userId, firstName, lastName, email, city }: DatosUsuario = {}) {
  return crearUsuarioService({ userId, firstName, lastName, email, city });
}
