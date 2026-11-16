# 1 · Crear un evento

**Explicación en el cuaderno JavaScript** · [Crear por capas](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos) · [Crear con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm) · [Infografía de la traza](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#infografia)

**Objetivo.** Invoca una Lambda desde la terminal y sigue el título hasta el ítem que se guarda en DynamoDB.

**Punto de partida.** Completa [0-conf.md](0-conf.md). Trabaja desde la raíz de `festival-checkin-typescript`, con el despliegue hecho y las variables `AWS_PROFILE`, `AWS_REGION` y `FCI_EQUIPO` cargadas en esa terminal.

## Sigue el código

Abre [serverless.yml](serverless.yml) y busca `functions → crearEvento`.

```yaml
crearEvento:
  name: ${self:service}-${self:provider.stage}-crearEvento
  handler: dist/eventos/crear-evento/handler.handler
```

`${self:service}` lee `service` y `${self:provider.stage}` lee `stage` dentro de `provider`. Ambas referencias buscan el valor en este mismo YAML. Con el equipo `equipo01`, la función se llama `festival-check-in-ts-equipo01-crearEvento`. En `handler.handler`, el primer `handler` es el archivo compilado `handler.js` que sale de `handler.ts`. El segundo es la función que exporta. Tú la invocarás con AWS CLI.

| Abre en este orden | Qué ocurre |
| --- | --- |
| [Handler](src/eventos/crear-evento/handler.ts) | Recibe `eventId` y `title` y llama a `crearEventoService(eventId, title)`. |
| [Service](src/eventos/crear-evento/service.ts) | Comprueba que el ID sea un entero positivo y que el título tenga texto. Llama a `crearEventoRepository`. |
| [Repository](src/eventos/crear-evento/repository.ts) | Usa `PutItemCommand` de DynamoDB Toolbox. La condición de escritura protege el ID de un evento existente. |
| [Modelo Evento](src/eventos/models/evento.model.ts) · [Explicación visual](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/?paso=modelo#lector) | Transforma `eventId` y `title` en `EVENT_ID` y `TITLE`. DynamoDB usa `EVENT_ID` como clave de partición numérica. |

Antes de ejecutar, señala en qué archivo se comprueba el título y en cuál se decide el nombre de cada atributo guardado. [Diagrama de capas y ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#capas-eventos-orm)

## Ejecuta la Lambda

Este bloque prepara un ID de ejemplo a partir de la hora actual en milisegundos. Guárdalo en la terminal para usar el mismo evento en los casos 2, 3 y 4.

```bash
evento_id=$(node -p 'Date.now()')
printf 'ID del evento de clase: %s\n' "$evento_id"

aws lambda invoke \
  --function-name "festival-check-in-ts-${FCI_EQUIPO}-crearEvento" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"eventId\":$evento_id,\"title\":\"Concierto de aula\"}" \
  respuesta-evento.json &&
cat respuesta-evento.json
```

Comprueba que la salida de la invocación no contiene `FunctionError` y que el JSON devuelve tu `eventId` y el título. El `StatusCode: 200` de AWS CLI indica que Lambda atendió la invocación. El JSON devuelto te permite comprobar el resultado de la función.

## Comprueba el ítem

```bash
aws dynamodb get-item \
  --table-name "FCI_TS_EVENTOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key "{\"EVENT_ID\":{\"N\":\"$evento_id\"}}" \
  --consistent-read --query 'Item' --output json
```

**Antes de avanzar.** El ítem debe contener tu `EVENT_ID` como número (`N`) y `TITLE` como texto (`S`). Anota el ID si vas a cerrar la terminal.

**Para aplicarlo a tu proyecto.** Elige qué registro vas a crear, cuál será su clave y qué dato obligatorio comprobará el service. Prepara una invocación válida y una lectura por clave que demuestre que se guardó.

[Siguiente · Crear un usuario](2-crear-usuario.md)
