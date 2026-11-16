import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { AWS_PROFILE, AWS_REGION, FCI_EQUIPO } = process.env;
if (!AWS_PROFILE || !AWS_REGION || !/^[a-z][a-z0-9-]{0,19}$/.test(FCI_EQUIPO ?? '')) {
  process.exitCode = 1;
  console.error('Exporta AWS_PROFILE, AWS_REGION y FCI_EQUIPO (por ejemplo, equipo01).');
} else {
  const directory = mkdtempSync(join(tmpdir(), 'festival-checkin-'));
  try {
    await ejecutarPrueba(join(directory, 'respuesta.json'));
  } catch (error) {
    process.exitCode = 1;
    console.error(error.message);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function aws(...args) {
  const output = execFileSync('aws', [
    ...args, '--profile', AWS_PROFILE, '--region', AWS_REGION,
    '--output', 'json', '--no-cli-pager'
  ], { encoding: 'utf8', timeout: 60_000 });
  return JSON.parse(output);
}

function sembrar(stack, funcion, datos, archivo) {
  const metadata = aws('lambda', 'invoke', '--function-name', stack + '-' + funcion,
    '--cli-binary-format', 'raw-in-base64-out', '--payload', JSON.stringify(datos), archivo);
  const resultado = JSON.parse(readFileSync(archivo, 'utf8'));
  if (metadata.FunctionError && resultado.errorType !== 'ConditionalCheckFailedException') {
    throw new Error(funcion + ' → ' + (resultado.errorMessage ?? metadata.FunctionError));
  }
  return Boolean(metadata.FunctionError);
}

async function ejecutarPrueba(archivo) {
  const stack = 'festival-check-in-ts-' + FCI_EQUIPO;
  const { Stacks: [despliegue] } = aws('cloudformation', 'describe-stacks', '--stack-name', stack);
  const url = despliegue.Outputs.find(item => item.OutputKey === 'HttpApiUrl')?.OutputValue;
  assert.ok(url, 'El stack debe tener una salida HttpApiUrl.');

  const evento = { eventId: 1, title: 'Festival de otoño' };
  const usuario = {
    userId: 'usuario-02', firstName: 'Leo', lastName: 'Martín',
    email: 'leo.martin@example.com', city: 'Huesca'
  };
  sembrar(stack, 'crearEvento', evento, archivo);
  const usuarioExistia = sembrar(stack, 'crearUsuario', usuario, archivo);
  const ruta = url.replace(/\/$/, '') + '/events/1/registrations/usuario-02';

  async function enviar(method) {
    const response = await fetch(ruta, { method, signal: AbortSignal.timeout(15_000) });
    console.log(method + ' → ' + response.status);
    return { status: response.status, datos: await response.json() };
  }

  const inicial = await enviar('GET');
  assert.equal(inicial.status, 200);
  assert.equal(inicial.datos.title, evento.title, 'El evento 1 debe ser Festival de otoño.');
  if (inicial.datos.registration === null) {
    assert.equal((await enviar('POST')).status, 201);
  } else {
    assert.ok(usuarioExistia, 'Ya existe un pase para un usuario recién creado.');
    console.log('El pase de ejemplo ya estaba inscrito.');
  }

  assert.equal((await enviar('POST')).status, 409);
  const final = await enviar('GET');
  assert.equal(final.status, 200);
  assert.equal(final.datos.registration?.userId, usuario.userId);
  assert.equal(String(final.datos.registration?.eventId), String(evento.eventId));
  assert.ok(final.datos.registration.registeredAt);
  console.log('Pase persistido en AWS. URL de la API: ' + url);
}
