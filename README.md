# Festival Check-in · TypeScript

Variante TypeScript del proyecto de aula. Con `equipo01`, el despliegue crea el stack `festival-check-in-ts-equipo01` y las tablas `FCI_TS_*_equipo01`. Puedes probar ambas versiones en el mismo laboratorio.

**Para empezar en clase, sigue [0-conf.md](0-conf.md) de principio a fin.**

## Recorrido por casos de uso

Usa el mismo evento y usuario de principio a fin. En cada caso, abre primero `serverless.yml`, sigue las llamadas y ejecuta la comprobación. El cuaderno web muestra las capas de la versión JavaScript. Para ejecutar esta variante, copia los comandos de esta rama, que usan los nombres de AWS con el sufijo `-ts` en el servicio.

| Caso de uso | Guía del repositorio | Explicación en el cuaderno web |
| --- | --- | --- |
| Preparar AWS y desplegar | [Configurar desde cero](0-conf.md) | [Preparar AWS Academy](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab) |
| Guardar un evento por capas con DynamoDB Toolbox | [Crear un evento](1-crear-evento.md) | [Crear con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm) · [Infografía de Crear un evento](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#infografia) |
| Preparar el perfil que se inscribirá | [Crear un usuario](2-crear-usuario.md) | [Programar la Lambda de usuarios](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#archivo-lambda) |
| Leer el evento y observar el pase antes de inscribir | [Consultar una inscripción](3-consultar-inscripcion.md) | [Consultar inscripción con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#consultar-orm) |
| Crear la relación, comprobar el 409 y leer la fecha | [Inscribir a un usuario](4-inscribir-usuario.md) | [Inscribir con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#inscribir-orm) |

## 1. Clona y comprueba el proyecto

Usa Git Bash en Windows o Terminal en macOS. Necesitas Git, Node.js 20 o superior y AWS CLI v2. Usa la versión compatible que ya tengas instalada. Lambda ejecuta Node 22 en AWS.

```bash
git clone --branch typescript https://github.com/albertohdezakkari/festival-checkin-01.git festival-checkin-typescript
cd festival-checkin-typescript
node --version
aws --version
npm ci
npm run build
```

`npm ci` instala las dependencias fijadas en `package-lock.json`. `npm run build` comprueba los tipos y genera el JavaScript en `dist/`. En `src/` editas, por ejemplo, `handler.ts`. Al desplegar, Serverless ejecutará el `handler.js` compilado.

## 2. Configura tu sesión

En AWS Academy, inicia **Learner Lab → Start Lab → AWS Details → AWS CLI**. Guarda las tres credenciales temporales en un perfil de tu archivo personal `~/.aws/credentials`. Usa la cabecera `[academy]` en minúsculas para el perfil del aula. Sigue estos pasos del [cuaderno de preparación](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#iniciar-lab).

Desde la raíz del proyecto, cambia los valores de ejemplo por los de tu laboratorio. Cada equipo que comparta cuenta y región debe usar un código diferente de hasta 20 caracteres, en minúsculas, con números o guiones y empezando por una letra.

```bash
export AWS_PROFILE=academy
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01
aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

Si guardaste las credenciales en `[default]`, exporta `AWS_PROFILE=default`. Si STS muestra `ExpiredToken`, renueva en AWS Details los tres valores del mismo perfil.

```bash
LAMBDA_ROLE_ARN=$(aws iam get-role --role-name LabRole \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" --query 'Role.Arn' --output text)
printf '%s\n' "$LAMBDA_ROLE_ARN"
```

Si aparece el ARN de `LabRole`, expórtalo:

```bash
export LAMBDA_ROLE_ARN
```

Si el laboratorio deniega `iam:GetRole`, exporta `LAMBDA_ROLE_ARN` con el ARN completo de LabRole que te facilite el profesor. Si Serverless te pide iniciar sesión, ejecuta `npx serverless login` y completa el acceso en el navegador. Son dos accesos distintos. Serverless autentica su herramienta y AWS CLI utiliza la sesión de Academy.

## 3. Despliega y prueba

En la misma terminal, desde la raíz del repositorio. Si abriste otra, recupera las cuatro variables del [paso 4 de 0-conf.md](0-conf.md#4-configura-y-comprueba-tu-despliegue).

```bash
npm run deploy -- --aws-profile "$AWS_PROFILE"
```

El paso `predeploy` compila los archivos antes de que Serverless lea `dist/`. Cuando Serverless confirme el despliegue, ejecuta:

```bash
npm run aula
```

Para una instalación nueva, verás **GET 200 → POST 201 → POST 409 → GET 200**. El comando carga el evento 1 y a `usuario-02` y muestra la URL de la API al final. Si repites la prueba, ya existe el mismo pase y el POST devuelve 409.

Abre la [pantalla del festival](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#pantalla), elige **AWS**, pega la URL y consulta el evento **1** para **usuario-02**. El pase del usuario figura como **Inscrito**.

### Invoca el listado de eventos

Desde la raíz del clon TypeScript, con las variables de AWS ya exportadas, ejecuta:

```bash
aws lambda invoke \
  --function-name "festival-check-in-ts-${FCI_EQUIPO}-listarEventos" \
  --cli-binary-format raw-in-base64-out \
  --payload '{}' \
  respuesta-listar.json &&
cat respuesta-listar.json
```

Después de `npm run aula`, busca «Festival de otoño» en `eventos`. Si hay más resultados, usa `siguienteCursor` como valor de `cursor` al repetir la invocación.

## 4. Sigue el código desde la petición hasta DynamoDB

En `src/eventos/crear-evento/` están los archivos del alta. En `src/eventos/buscar-evento/` están el service y el repository de lectura que reutilizan **Consultar inscripción** e **Inscribir usuario**. El modelo que comparten el alta y la lectura vive en `src/eventos/models/`. En `src/inscripciones/` están los casos **Consultar inscripción** e **Inscribir usuario**, que trabajan con `FCI_TS_INSCRIPCIONES`. Sus handlers comparten `http/peticion.ts` para preparar la llamada al service y responder a API Gateway. Su modelo de DynamoDB Toolbox está en `models/`.

| Abre | Qué buscar |
| --- | --- |
| `serverless.yml` | Las cinco funciones, las rutas GET y POST, las tres tablas y el índice `PorUsuario`. Los nombres de tabla llevan el código del equipo. |
| `src/inscripciones/consultar-inscripcion/handler.ts` | La entrada de API Gateway llama al caso de uso de consulta. |
| `src/inscripciones/consultar-inscripcion/service.ts` | Lee el evento y después el pase. Antes de inscribirse, `registration` vale `null`. |
| `src/inscripciones/inscribir-usuario/service.ts` y `repository.ts` | Comprueban las referencias y guardan la inscripción con una condición que protege frente a duplicados. |
| `src/eventos/models/evento.model.ts` y `src/inscripciones/models/inscripcion.model.ts` | DynamoDB Toolbox traduce `eventId` a `EVENT_ID` y `userId` a `USER_ID` sin cambiar las claves de las tablas. |
| `src/datos/dynamo.ts` | El cliente del SDK comparte la conexión y lee los nombres de tablas que inyecta Serverless. |

Sigue en el cuaderno los pasos [Crear con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm), [Consultar inscripción con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#consultar-orm) e [Inscribir con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#inscribir-orm). El alta del perfil y la lectura de usuario conservan el SDK directo, tal como se muestran en el cuaderno.

Con `NodeNext`, una importación como `from './service.js'` apunta al nombre que tendrá el archivo compilado. Durante la compilación, TypeScript encuentra el código fuente en `service.ts`. [Resolución de módulos en TypeScript](https://www.typescriptlang.org/docs/handbook/modules/reference.html#file-extension-substitution)
