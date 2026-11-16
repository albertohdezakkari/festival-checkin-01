# 4 · Inscribir a un usuario

**Explicación en el cuaderno JavaScript** · [Inscribir por capas](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#construir-post) · [Inscribir con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#inscribir-orm)

**Objetivo.** Usa el mismo evento y el mismo usuario para crear una inscripción, comprobar que se conserva y detectar una petición duplicada.

**Punto de partida.** Trabaja en `festival-checkin-typescript` con las variables de AWS y el mismo `pase_url` del [caso 3](3-consultar-inscripcion.md). Si abriste otra terminal, recupera la configuración, los identificadores anotados y la URL con los bloques del caso 3.

## Sigue el POST

En [serverless.yml](serverless.yml), `functions → inscribirUsuario → events → httpApi` conecta **POST `/events/{eventId}/registrations/{userId}`** con su handler. El camino de la URL coincide con el GET. El método HTTP determina qué Lambda se ejecuta.

| Abre en este orden | Qué ocurre |
| --- | --- |
| [Handler](src/inscripciones/inscribir-usuario/handler.ts) | Usa `handleRequest` para leer la ruta y llama a `inscribirUsuarioService`. |
| [Service](src/inscripciones/inscribir-usuario/service.ts) | Comprueba el evento con [buscarEventoService](src/eventos/buscar-evento/service.ts) y el usuario con `buscarUsuarioRepository`. Obtiene la fecha de inscripción en UTC y llama a `inscribirUsuarioRepository`. |
| [Repository](src/inscripciones/inscribir-usuario/repository.ts) | `buscarUsuarioRepository` lee el usuario con el SDK. Guarda la inscripción con Toolbox y una condición que impide sustituir un pase existente. |
| [Modelo Inscripcion](src/inscripciones/models/inscripcion.model.ts) y [peticion.mjs](src/inscripciones/http/peticion.ts) | El modelo traduce los nombres a DynamoDB. Si DynamoDB rechaza una escritura duplicada, `handleRequest` la convierte en HTTP 409. |

Predice qué pasará con la fecha de inscripción cuando envíes dos POST para la misma pareja. [Inscripción por capas y ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#inscribir-orm)

## Envía, repite y consulta

```bash
curl -sS -i -X POST "${pase_url:?Completa el caso 3 para recuperar la URL del pase}"
curl -sS -i -X POST "$pase_url"
curl -sS -i "$pase_url"
```

| Petición | Resultado esperado con un pase nuevo |
| --- | --- |
| Primer POST | **201**. La inscripción se crea. |
| Segundo POST | **409**. La condición impide duplicarla. |
| GET posterior | **200**. `registration` contiene el usuario y la fecha `registeredAt`. |

## Comprueba la fecha en DynamoDB

```bash
aws dynamodb get-item \
  --table-name "FCI_TS_INSCRIPCIONES_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key "{\"EVENT_ID\":{\"N\":\"$evento_id\"},\"USER_ID\":{\"S\":\"$usuario_id\"}}" \
  --consistent-read --query 'Item' --output json
```

**Antes de terminar.** El ítem contiene ambas claves. Comprueba que `REGISTERED_AT` coincide con `registeredAt` en el GET. También puedes abrir la pantalla, elegir **AWS** y consultar con la misma URL de API, el mismo evento y el mismo usuario. [Pantalla del festival](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#pantalla)

**Para aplicarlo a tu proyecto.** Define qué dos registros vas a vincular, cómo reconocerás una relación duplicada y qué prueba demostraría que la segunda petición conserva el primer registro.

[Volver al orden de la práctica](README.md#recorrido-por-casos-de-uso)
