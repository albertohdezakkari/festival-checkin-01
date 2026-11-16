# 3 · Consultar una inscripción

**Explicación en el cuaderno JavaScript** · [Consultar inscripción por capas](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#leer-pase) · [Consultar inscripción con ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#consultar-orm)

**Objetivo.** Sigue una petición GET por las capas y comprueba que la respuesta contiene `registration: null` si el evento existe y el usuario todavía no está inscrito.

**Punto de partida.** Sigue en `festival-checkin-typescript` con el evento y el usuario de los casos [1](1-crear-evento.md) y [2](2-crear-usuario.md). Si cambiaste de terminal, recupera las variables del [paso 4 de configuración](0-conf.md#4-configura-y-comprueba-tu-despliegue) y asigna los valores de `evento_id` y `usuario_id` que anotaste.

## Sigue el GET

En [serverless.yml](serverless.yml), `functions → consultarInscripcion → events → httpApi` conecta **GET `/events/{eventId}/registrations/{userId}`** con el handler de consulta.

| Abre en este orden | Qué ocurre |
| --- | --- |
| [Handler](src/inscripciones/consultar-inscripcion/handler.ts) y [peticion.mjs](src/inscripciones/http/peticion.ts) | El handler delega en `handleRequest`. Este extrae los dos parámetros de la ruta, comprueba su formato y llama a `consultarInscripcionService`. |
| [Service](src/inscripciones/consultar-inscripcion/service.ts) | Busca primero el evento. Si falta, devuelve 404. Si existe, busca la inscripción y devuelve 200 con el título y el resultado de esa búsqueda. |
| [Service de búsqueda](src/eventos/buscar-evento/service.ts) y [Repository de búsqueda](src/eventos/buscar-evento/repository.ts) | `buscarEventoService` delega en `buscarEventoRepository`, que lee el evento con `GetItemCommand` usando solo `EVENT_ID`. |
| [Repositorio de la inscripción](src/inscripciones/consultar-inscripcion/repository.ts) y [modelo Inscripcion](src/inscripciones/models/inscripcion.model.ts) | `consultarInscripcionRepository` usa Toolbox para leer la inscripción por la pareja `EVENT_ID` y `USER_ID`. Si el ítem aún no existe, el repositorio devuelve `null`. |

Predice qué verá un visitante si existe el evento pero aún no está inscrito. [Consulta por capas y ORM](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#consultar-orm)

## Recupera la URL de la API y consulta

```bash
api_url="$(aws cloudformation describe-stacks \
  --stack-name "festival-check-in-ts-${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='HttpApiUrl'].OutputValue | [0]" \
  --output text)" &&
printf 'API: %s\n' "$api_url"
```

Debe aparecer la URL HTTPS de API Gateway. Si ves `None`, revisa que estás consultando el stack del equipo que desplegaste.

```bash
pase_url="${api_url%/}/events/${evento_id:?Recupera el ID del caso 1}/registrations/${usuario_id:?Recupera el ID del caso 2}"
curl -sS -i "$pase_url"
```

**Antes de avanzar.** Espera **HTTP 200**, el título **Concierto de aula** y `"registration": null`. Si obtienes 404 con «Evento no encontrado», comprueba el ID y el equipo. Si ya aparece una inscripción, estás repitiendo la prueba con una pareja que ya usaste.

**Para aplicarlo a tu proyecto.** Decide qué valores llegarán en la URL, qué clave usará cada lectura y qué respuesta mostrarás cuando todavía no exista la relación.

[Siguiente · Inscribir a un usuario](4-inscribir-usuario.md)
