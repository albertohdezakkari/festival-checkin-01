# 0 · Configura Festival Check-in desde cero

**Explicación en el cuaderno JavaScript** · [Preparar AWS Academy](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab) · [Leer el YAML](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#infraestructura) · [Entender el despliegue](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#desplegar-stack)

Usa **Git Bash** en Windows o **Terminal** en macOS. Ejecuta los bloques en orden y conserva la misma terminal para que las variables sigan disponibles.

## 1. Instala y comprueba las herramientas

| Herramienta | Windows | macOS |
| --- | --- | --- |
| Git | Instala Git for Windows y abre **Git Bash** desde Inicio. [Descargar Git](https://git-scm.com/install/windows) | En Terminal puedes instalar las herramientas de Apple con `xcode-select --install`. [Alternativas de instalación](https://git-scm.com/install/mac) |
| Node.js | Si necesitas instalarlo, elige la **última versión LTS** y el instalador `.msi` para tu equipo. [Descargar Node.js](https://nodejs.org/en/download) | Si necesitas instalarlo, elige la **última versión LTS** y el instalador `.pkg` para tu equipo. [Descargar Node.js](https://nodejs.org/en/download) |
| AWS CLI v2 | Descarga y ejecuta el instalador `.msi`. [Instalador oficial](https://awscli.amazonaws.com/AWSCLIV2.msi) | Descarga y abre el instalador `.pkg`. [Instalador oficial](https://awscli.amazonaws.com/AWSCLIV2.pkg) |

Si acabas de instalar algo, cierra y vuelve a abrir Git Bash o Terminal. Comprueba las versiones:

```bash
git --version
node --version
npm --version
aws --version
```

Puedes conservar tu versión local de **Node.js 20 o superior**. Si vas a instalar Node desde cero, el selector de la web oficial muestra la última LTS disponible. El instalador incluye npm. `aws --version` debe empezar por `aws-cli/2.`. Lambda ejecuta Node 22 en AWS.

Serverless Framework se instala con las dependencias del proyecto en el paso 2. El acceso a AWS Academy se hace en el navegador en el paso 3.

## 2. Clona e instala el proyecto

Desde la carpeta donde guardas tus prácticas, ejecuta:

```bash
git clone --branch typescript https://github.com/albertohdezakkari/festival-checkin-01.git festival-checkin-typescript
cd festival-checkin-typescript
```

Si ya lo clonaste, entra en la carpeta existente y actualízala:

```bash
cd festival-checkin-typescript
git pull --ff-only
```

Si la terminal ya está en `festival-checkin-typescript`, ejecuta solo `git pull --ff-only`. Confirma dónde estás antes de instalar:

```bash
pwd
npm pkg get name
```

La ruta debe terminar en `festival-checkin-typescript` y el nombre del paquete debe ser `"festival-checkin-typescript"`. Si estás en `festival-checkin`, abre el clon correcto y repite el bloque.

```bash
npm ci
```

Cuando termine la instalación, comprueba la versión instalada:

```bash
npm ls serverless --depth=0
```

Aquí clonas un proyecto que ya trae `package-lock.json`. Usa **`npm ci`** para reconstruir `node_modules` con las versiones fijadas en ese archivo. npm detiene la instalación si el archivo de bloqueo y `package.json` están desincronizados.

**`npm ls serverless --depth=0`** muestra la versión de Serverless instalada en esta carpeta. `ls` significa «listar» y `--depth=0` limita la salida a las dependencias directas del proyecto. Debes ver **`serverless@4.45.0`**.

Cuando estás creando un proyecto y quieres **añadir o cambiar** una dependencia, usas `npm install`. Por ejemplo, `npm install --save-dev --save-exact serverless@4.45.0` añade Serverless como herramienta de desarrollo y actualiza `package.json` y `package-lock.json`. En este clon esos cambios ya están guardados.

En el paso 5 usarás `npx --no-install serverless --version` para **arrancar la CLI** con las variables del laboratorio ya cargadas. Aquí solo compruebas qué versión quedó instalada.

## 3. Activa AWS Academy y guarda las credenciales

Entra en **AWS Academy** desde la invitación del centro o el enlace del curso. Acepta la invitación si es tu primer acceso y comprueba que puedes abrir el **Learner Lab** asignado. Si el curso o el laboratorio no aparece, pide al profesor que compruebe tu acceso. [AWS Academy](https://aws.amazon.com/training/awsacademy/)

Dentro de **Learner Lab**, pulsa **Start Lab**. Cuando el laboratorio esté activo, abre **AWS Details → AWS CLI → Show** y copia el bloque de la sesión.

```bash
mkdir -p ~/.aws
touch ~/.aws/credentials
chmod 600 ~/.aws/credentials
vi ~/.aws/credentials
```

En `vi`, escribe `:set paste` y pulsa Intro. Si el perfil es nuevo, sitúate en una línea libre, pulsa `i` y pega el bloque. Usa la cabecera `[academy]` en minúsculas. Si el bloque copiado trae `[default]`, cambia esa cabecera en el bloque que vas a pegar. Si el perfil ya existe, sustituye sus tres valores en esa misma sección. Guarda con **Esc**, `:wq` e Intro.

La sección debe contener `aws_access_key_id`, `aws_secret_access_key` y `aws_session_token`. Usa los tres valores de la misma sesión y guárdalos solo en el archivo personal `~/.aws/credentials`.

```bash
aws configure list-profiles
```

La lista debe incluir `academy`. Si AWS muestra `The config profile (academy) could not be found`, abre `~/.aws/credentials` de nuevo y comprueba la cabecera `[academy]`. Si ya tenías la sesión del laboratorio guardada en `[default]`, puedes usar `default` en el paso siguiente. [Preparación visual en el cuaderno](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab)

## 4. Configura y comprueba tu despliegue

Desde la raíz del proyecto, usa `academy` tal como aparece en la cabecera `[academy]`. Si usas `[default]`, cambia la primera línea a `export AWS_PROFILE=default`. Ajusta la región a la del laboratorio y usa el código de equipo asignado. Si varios equipos comparten cuenta y región, cada uno utiliza un código distinto. El código empieza por una letra minúscula y admite hasta veinte caracteres entre minúsculas, números y guiones.

```bash
export AWS_PROFILE=academy
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01

aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

Avanza cuando la salida muestre `Account` y `Arn`. Si aparece `ExpiredToken`, recupera los tres valores vigentes de AWS Details, sustituye los anteriores y repite la comprobación.

### Averigua qué rol usará Lambda

Tu perfil `academy` identifica la sesión con la que haces la consulta. **`LabRole`** es el rol que usará Lambda al ejecutar tu código, por ejemplo para acceder a DynamoDB. Serverless necesita su **ARN**, el identificador completo del rol en AWS.

```bash
LAMBDA_ROLE_ARN="$(aws iam get-role --role-name LabRole \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --query 'Role.Arn' --output text)"
printf 'Rol de Lambda: %s\n' "$LAMBDA_ROLE_ARN"
```

| Parte del comando | Qué hace |
| --- | --- |
| `aws iam get-role --role-name LabRole` | Le pide a AWS los datos del rol existente llamado `LabRole`. |
| `--profile "$AWS_PROFILE" --region "$AWS_REGION"` | Ejecuta la consulta con el perfil y la configuración de región que preparaste. |
| `--query 'Role.Arn' --output text` | De la respuesta de IAM extrae solo `Arn`, que está dentro de `Role`, y lo devuelve como texto. |
| `LAMBDA_ROLE_ARN="$(...)"` | Bash ejecuta lo que va entre `$(...)` y guarda su salida en la variable. |
| `printf 'Rol de Lambda: %s\n' "$LAMBDA_ROLE_ARN"` | Muestra el valor guardado. `%s` se sustituye por el ARN y `\n` añade un salto de línea. |

Después de exportar la variable, Serverless sustituye `${env:LAMBDA_ROLE_ARN}` por ese ARN en `provider.iam.role` al desplegar. [Consulta del rol en AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/iam/get-role.html) · [Rol de ejecución de Lambda](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

Si aparece un ARN que termina en `:role/LabRole`, expórtalo:

```bash
export LAMBDA_ROLE_ARN
```

Si tu cuenta deniega `iam:GetRole`, pide el ARN completo del rol al profesor y sustitúyelo en este comando:

```bash
export LAMBDA_ROLE_ARN="ARN_COMPLETO_DEL_ROL"
```

En `serverless.yml`, el código de equipo se convierte en el entorno de Serverless y se añade al nombre de las tablas. Con `equipo01`, el stack será `festival-check-in-ts-equipo01` y la tabla de eventos será `FCI_TS_EVENTOS_equipo01`.

## 5. Despliega y carga los datos de ejemplo

### Accede a Serverless Framework

En el primer uso en un equipo nuevo, abre el inicio de sesión del Framework desde la raíz del clon:

```bash
npx --no-install serverless login
```

En el navegador, inicia sesión o registra tu cuenta de Serverless Framework y vuelve a la terminal cuando se complete. Si ya tienes la sesión iniciada, continúa con el despliegue. El acceso de Serverless habilita su CLI. La sesión del Learner Lab proporciona las credenciales para desplegar en AWS. [Inicio de sesión de Serverless Framework](https://www.serverless.com/framework/docs/getting-started#signing-in)

En la misma terminal, verifica que inicia la CLI con la configuración del proyecto:

```bash
npx --no-install serverless --version
```

Debe mostrar la versión del Framework. Si aparece un error al resolver una variable del YAML, vuelve al paso 4 y recupera los valores en esa terminal.

### Despliega tu entorno y carga los datos

Desde la raíz de `festival-checkin-typescript`, en la misma terminal del paso 4, comprueba los valores:

```bash
printf 'Perfil: %s\nRegión: %s\nEquipo: %s\nRol: %s\n' \
  "$AWS_PROFILE" "$AWS_REGION" "$FCI_EQUIPO" "$LAMBDA_ROLE_ARN"
```

`printf` es **una comprobación opcional**. Muestra los valores de esta terminal antes de desplegar. Cada `%s` se sustituye, en orden, por una de las cuatro variables y cada `\n` pasa a una nueva línea.

| Línea de salida | Qué debes ver |
| --- | --- |
| Perfil | El nombre del perfil que guardaste, por ejemplo `academy`. |
| Región | La región en la que vas a desplegar, por ejemplo `us-east-1`. |
| Equipo | Tu código de equipo. Serverless lo usa para nombrar el entorno y sus tablas. |
| Rol | El ARN completo de `LabRole` que asignarás a Lambda. |

Si alguna línea está vacía, vuelve al paso 4. Esto ayuda a detectar errores como `--aws-profile` vacío o `FCI_EQUIPO` sin valor. **Puedes omitir `printf` si ya tienes los cuatro valores configurados.** La comprobación de la sesión se hace con el comando siguiente, que sí consulta AWS.

```bash
aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

Cuando aparezcan `Account` y `Arn`, despliega:

```bash
npm run deploy -- --aws-profile "$AWS_PROFILE"
```

Comprueba que primero se ejecuta `npm run build`. Después, el comando muestra `serverless deploy --aws-profile academy` o el perfil que hayas elegido. Serverless debe confirmar el despliegue del stack con tu código de equipo. Si AWS responde `ExpiredToken`, renueva las credenciales como indica el paso 4 y comprueba de nuevo la sesión.

Cuando Serverless confirme el despliegue, carga los datos de ejemplo y prueba el pase:

```bash
npm run aula
```

Si falla solo la carga o la prueba, corrige el error y vuelve a ejecutar este último comando.

`npm run aula` carga el evento **1** y el perfil ficticio **`usuario-02`**. En un entorno nuevo debe mostrar **GET 200 → POST 201 → POST 409 → GET 200**. El 409 confirma que se bloqueó la segunda inscripción. Al repetir una prueba ya completada, el pase existente se conserva. Guarda la URL de la API que aparece al final.

## 6. Comprueba el resultado

### Lee el evento por su clave

`npm run aula` acaba de cargar el evento **1**. Ahora compruebas qué quedó guardado. DynamoDB puede localizar un ítem cuando le das **la tabla y su clave primaria completa**. En `FCI_TS_EVENTOS` la clave tiene un solo campo, `EVENT_ID`.


```bash
aws dynamodb get-item \
  --table-name "FCI_TS_EVENTOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key '{"EVENT_ID":{"N":"1"}}' \
  --consistent-read --query 'Item' --output json
```

#### Sigue el evento 1 de la petición a la pantalla

**1 · Identifica la ficha con `--key`**

Para pedir la ficha del evento **1**, escribe la clave en el formato que AWS CLI espera en `--key`.

| Qué ves | Cómo lo lees |
| --- | --- |
| `{"EVENT_ID": ...}` | Las llaves exteriores agrupan los atributos de la clave. Aquí solo hay uno, `EVENT_ID`. |
| `{"N":"1"}` | Las llaves interiores agrupan **el tipo y el valor** de ese atributo. AWS abrevia **Number** como `N` y **String** como `S`. |
| `"1"` | Son las cifras que se envían. AWS transmite los números como cadenas en este formato para que distintos lenguajes y bibliotecas puedan intercambiarlos. DynamoDB lee `N` y trata el valor como el número **1**. |
| `'{"EVENT_ID":{"N":"1"}}'` | Las comillas simples exteriores son de Bash. Hacen que el JSON completo llegue como un argumento de `--key`. |

**Prueba a leerlo en voz alta.** `{"N":"1"}` significa «el número uno». `{"S":"1"}` significa «el texto uno». En esta tabla, `EVENT_ID` es numérico, así que usas `N`. [Tipos de atributos en AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/get-item.html)

**2 · Lee la ficha recién guardada con `--consistent-read`**

Acabas de cargar «Festival de otoño» con `npm run aula`. Esta opción pide a DynamoDB que tenga en cuenta las escrituras ya confirmadas cuando haga la lectura. Son dos decisiones distintas. `--key` indica **qué ficha** buscas y `--consistent-read` indica **cómo** quieres leerla.

**3 · Muestra solo la ficha con `--query 'Item'`**

DynamoDB entrega la ficha dentro de un campo llamado `Item`. Imagina que `Item` es el sobre y que dentro vienen el ID y el título. `--query 'Item'` abre el sobre en AWS CLI y se queda con su contenido. `--output json` decide cómo se imprime ese contenido.

**Respuesta antes de aplicar `--query 'Item'`**

```json
{
  "Item": {
    "EVENT_ID": { "N": "1" },
    "TITLE": { "S": "Festival de otoño" }
  }
}
```

#### Qué valor usa cada parte del comando

| Parte del comando | Qué le estás pidiendo | Valor de ejemplo y dónde se define |
| --- | --- | --- |
| `aws dynamodb get-item` | «Dame el ítem que corresponde a esta clave primaria». | `get-item` · Lo escribes directamente en el comando de AWS CLI. |
| `--table-name "FCI_TS_EVENTOS_${FCI_EQUIPO}"` | Abre la tabla de eventos de tu equipo. Si tu código es `equipo01`, el nombre será `FCI_TS_EVENTOS_equipo01`. | `FCI_TS_EVENTOS_equipo01` · Exportas `FCI_EQUIPO=equipo01` en el [paso 4](#4-configura-y-comprueba-tu-despliegue). Ese código se usa como etapa en [serverless.yml](serverless.yml), donde `TableName: FCI_TS_EVENTOS_${self:provider.stage}` lee `provider.stage` del mismo archivo para completar el nombre de la tabla. |
| `--profile "$AWS_PROFILE" --region "$AWS_REGION"` | Usa la sesión del laboratorio y busca la tabla en la región del despliegue. | **Perfil `academy`** · Lo eliges con `AWS_PROFILE` en el [paso 4](#4-configura-y-comprueba-tu-despliegue). Sus credenciales están bajo `[academy]` en `~/.aws/credentials` ([paso 3](#3-activa-aws-academy-y-guarda-las-credenciales)).<br>**Región `us-east-1`** · La asignas a `AWS_REGION` en el paso 4. `provider.region` usa esa misma variable en [serverless.yml](serverless.yml). |
| `--key '{"EVENT_ID":{"N":"1"}}'` | Busca la ficha del evento **1** por su clave. | `EVENT_ID = 1` · [serverless.yml](serverless.yml) define `EVENT_ID` como clave de tipo `N`. El `1` lo escribes en la consulta y coincide con `eventId: 1` de [scripts/aula.mjs](scripts/aula.mjs), que carga el evento «Festival de otoño» al ejecutar `npm run aula`. |
| `--consistent-read` | Pide que la lectura refleje las escrituras ya confirmadas. | `ConsistentRead = true` · Se activa al escribir `--consistent-read` en el comando. |
| `--query 'Item' --output json` | Toma el contenido de `Item` y lo imprime en JSON. | **`Item`** · Es el campo que devuelve DynamoDB con el evento encontrado. **`json`** · Lo eliges en el comando para ver ese campo en formato JSON. |

La barra `\` al final de una línea le indica a Bash que el comando continúa en la siguiente. [Referencia de GetItem](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/get-item.html) · [Consistencia de lectura en DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)

**Salida con `--query 'Item' --output json`**

```json
{
  "EVENT_ID": { "N": "1" },
  "TITLE": { "S": "Festival de otoño" }
}
```

Aquí `S` significa texto. **Antes de avanzar**, compara las dos salidas. Desde la raíz del proyecto, ejecuta este segundo comando, que solo omite `--query 'Item'`.

```bash
aws dynamodb get-item \
  --table-name "FCI_TS_EVENTOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key '{"EVENT_ID":{"N":"1"}}' \
  --consistent-read --output json
```

Comprueba que reaparece el campo `Item` y que dentro siguen el mismo ID y el mismo título. Si ves `null`, comprueba el equipo, la región y que `npm run aula` haya cargado el evento 1.

### Compara la consulta de AWS con SQL

La columna SQL usa el nombre de tabla del equipo de ejemplo, `equipo01`. Cada fila muestra la misma lectura a ambos lados.

| Consulta en AWS CLI | SQL equivalente |
| --- | --- |
| **Leer el evento 1 con GetItem**<br>`aws dynamodb get-item \`<br>`--table-name "FCI_TS_EVENTOS_${FCI_EQUIPO}" \`<br>`--profile "$AWS_PROFILE" --region "$AWS_REGION" \`<br>`--key '{"EVENT_ID":{"N":"1"}}' \`<br>`--consistent-read --output json` | `SELECT *`<br>`FROM FCI_TS_EVENTOS_equipo01`<br>`WHERE EVENT_ID = 1` |
| **Leer el evento 1 con PartiQL**<br>`aws dynamodb execute-statement \`<br>`--statement "SELECT * FROM \"FCI_TS_EVENTOS_${FCI_EQUIPO}\" WHERE EVENT_ID = 1" \`<br>`--consistent-read --output json` | `SELECT *`<br>`FROM FCI_TS_EVENTOS_equipo01`<br>`WHERE EVENT_ID = 1` |
| **Listar todos los eventos con PartiQL**<br>`aws dynamodb execute-statement \`<br>`--statement "SELECT * FROM \"FCI_TS_EVENTOS_${FCI_EQUIPO}\"" \`<br>`--consistent-read --output json` | `SELECT *`<br>`FROM FCI_TS_EVENTOS_equipo01` |

### Consulta el mismo evento con PartiQL

Lee el SQL de la tabla anterior. `SELECT *` pide todos los atributos, `FROM` indica la tabla y `WHERE EVENT_ID = 1` busca el evento por su clave de partición. El `1` sin comillas es un número.

**Ahora ejecuta el SELECT en DynamoDB.** DynamoDB entiende esta consulta mediante **PartiQL**, su lenguaje con sintaxis parecida a SQL. Con `get-item --key` escribiste `{"N":"1"}` para indicar el tipo. En PartiQL basta con escribir `EVENT_ID = 1`.

Desde la raíz del proyecto, usa la misma terminal del paso 4. AWS CLI toma el perfil y la región de `AWS_PROFILE` y `AWS_REGION`, que ya exportaste.

```bash
aws dynamodb execute-statement \
  --statement "SELECT * FROM \"FCI_TS_EVENTOS_${FCI_EQUIPO}\" WHERE EVENT_ID = 1" \
  --consistent-read --output json
```

- **`execute-statement`** ejecuta una instrucción PartiQL. **`--statement`** recibe el `SELECT` entero como un solo argumento.
- **`${FCI_EQUIPO}`** se sustituye en la terminal por tu código, por ejemplo `equipo01`. Cada `\"` conserva una comilla alrededor del nombre de la tabla al enviarlo a PartiQL.

```json
{
  "Items": [
    {
      "EVENT_ID": { "N": "1" },
      "TITLE": { "S": "Festival de otoño" }
    }
  ]
}
```

Comprueba que `Items` contiene el evento **1**, «Festival de otoño». En la respuesta JSON, DynamoDB usa `N` y `S` para indicar el tipo de cada atributo.

### Lista todos los eventos con PartiQL

Quita la línea `WHERE` para pedir todos los eventos de la tabla. Ejecuta el comando desde la misma terminal.

```bash
aws dynamodb execute-statement \
  --statement "SELECT * FROM \"FCI_TS_EVENTOS_${FCI_EQUIPO}\"" \
  --consistent-read --output json
```

**Antes de avanzar**, compara las dos listas `Items`. La primera contiene solo el evento **1**. La segunda incluye también cualquier otro evento que hayas creado. Si solo cargaste «Festival de otoño», ambas listas tienen un elemento. Al omitir `WHERE`, DynamoDB recorre la tabla y puede devolver varias páginas si hay muchos registros. [SELECT en PartiQL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ql-reference.select.html) · [execute-statement en AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/execute-statement.html) · [Ejemplos de sintaxis en el cuaderno JavaScript](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#comprobar-datos)

### Comprueba el mismo evento en la pantalla

En la pantalla del festival, elige **AWS**, pega la URL del paso anterior y consulta el evento **1** para **`usuario-02`**. Debe aparecer **Inscrito**. [Abrir la pantalla del festival](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#pantalla)
