# 0 · Festival Check-in en el ordenador de clase

Trabaja en **Git Bash** con la rama `local`. Durante la práctica, Serverless Offline ejecuta las Lambdas y DynamoDB Local guarda los datos en tu equipo. [Guía visual en HTML](docs/local.html)

## 1. Comprueba las herramientas

```bash
git --version
node --version
npm --version
java -version
aws --version
```

La combinación probada en macOS usa **Node 22**, **Java 17** y **AWS CLI v2**. Para DynamoDB Local puedes usar Java 17 o superior. Si acabas de instalar una herramienta, vuelve a abrir Git Bash y repite la comprobación. [Git para Windows](https://git-scm.com/install/windows) · [Node.js](https://nodejs.org/en/download) · [Java 17 en Adoptium](https://adoptium.net/temurin/releases/?version=17) · [AWS CLI para Windows](https://awscli.amazonaws.com/AWSCLIV2.msi)

## 2. Descarga el proyecto y DynamoDB Local

Desde la carpeta donde guardas tus prácticas, clona el proyecto y entra en él.

```bash
git clone --branch local https://github.com/albertohdezakkari/festival-checkin-01.git festival-checkin-local
cd festival-checkin-local
```

Si ya estás en un clon de la rama `local`, actualízalo con `git pull`. Desde la raíz de `festival-checkin-local`, instala las dependencias y descarga DynamoDB Local.

```bash
npm ci

mkdir -p .local/dynamodb
curl -fsSL https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.tar.gz \
  | tar -xz -C .local/dynamodb

ls .local/dynamodb/DynamoDBLocal.jar
```

**Antes de avanzar**, comprueba que el último comando muestra `.local/dynamodb/DynamoDBLocal.jar`.

## 3. Terminal 1 · Arranca DynamoDB

Desde `festival-checkin-local`, ejecuta:

```bash
npm run db:local
```

Deja abierta esta terminal. **Antes de avanzar**, busca `Port: 8000` en la salida.

## 4. Terminal 2 · Carga los datos y arranca la API

Abre otra terminal Git Bash en la raíz de `festival-checkin-local`. Ejecuta:

```bash
npm run datos:local && npm start
```

Deja abierta esta terminal. **Antes de avanzar**, busca `Datos disponibles: evento 1 y usuario-02` y `Server ready: http://127.0.0.1:3004`.

## 5. Terminal 3 · Comprueba el primer GET

```bash
curl -i http://127.0.0.1:3004/events/1/registrations/usuario-02
```

En una base recién preparada, debes ver **HTTP 200** y el siguiente cuerpo. Si ya inscribiste a ese usuario, `registration` contiene la inscripción guardada.

```json
{"eventId":1,"title":"Festival de otoño","registration":null}
```

## Compara la consulta de AWS con SQL

En la tercera terminal, define esta función una vez. Las credenciales ficticias se usan dentro de `aws_local`. `--endpoint-url` dirige cada consulta a tu DynamoDB Local.

```bash
aws_local() (
  unset AWS_PROFILE AWS_DEFAULT_PROFILE AWS_SESSION_TOKEN AWS_SECURITY_TOKEN
  export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local
  aws --region us-east-1 --no-cli-pager "$@"
)
```

Este es el `SELECT` que vas a expresar de dos maneras:

```sql
SELECT *
FROM "FCI_EVENTOS_local"
WHERE EVENT_ID = 1
```

### Lee por clave con GetItem

```bash
aws_local dynamodb get-item \
  --endpoint-url http://127.0.0.1:8000 \
  --table-name FCI_EVENTOS_local \
  --key '{"EVENT_ID":{"N":"1"}}' \
  --query Item --output json
```

### Ejecuta el SELECT con PartiQL

```bash
aws_local dynamodb execute-statement \
  --endpoint-url http://127.0.0.1:8000 \
  --statement 'SELECT * FROM "FCI_EVENTOS_local" WHERE EVENT_ID = 1' \
  --query 'Items[0]' --output json
```

**Antes de terminar**, compara las salidas. En ambas debe aparecer `EVENT_ID = 1` y el título **Festival de otoño**.
