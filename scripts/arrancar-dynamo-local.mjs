import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';

const jar = '.local/dynamodb/DynamoDBLocal.jar';
if (!existsSync(jar)) {
  console.error('Descarga DynamoDB Local en .local/dynamodb. Consulta 0-conf.md.');
  process.exitCode = 1;
} else {
  mkdirSync('.local/data', { recursive: true });
  const dynamo = spawn(process.env.FCI_JAVA || 'java', [
    '-Djava.library.path=.local/dynamodb/DynamoDBLocal_lib',
    '-jar', jar,
    '-sharedDb', '-dbPath', '.local/data', '-disableTelemetry'
  ], { stdio: 'inherit' });
  dynamo.on('error', error => {
    console.error('Comprueba que Java 17 o superior esté disponible:', error.message);
    process.exitCode = 1;
  });
  dynamo.on('close', code => { process.exitCode = code ?? 0; });
}
