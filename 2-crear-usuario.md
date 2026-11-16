# 2 · Crear un usuario

**Explicación en el cuaderno JavaScript** · [Programar Lambda](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/#archivo-lambda) (elige **Usuarios · handler.mjs**)

**Objetivo.** Guarda el perfil ficticio que se inscribirá al evento del paso anterior.

**Punto de partida.** Sigue en `festival-checkin-typescript`, en la misma terminal del [caso 1](1-crear-evento.md). Si abriste otra, recupera las variables del [paso 4 de configuración](0-conf.md#4-configura-y-comprueba-tu-despliegue) y asigna a `evento_id` el ID que anotaste.

## Sigue el código

En [serverless.yml](serverless.yml), `functions → crearUsuario` apunta a `src/usuarios/crear-usuario/handler.handler`. La invocas directamente con AWS CLI.

| Abre en este orden | Qué ocurre |
| --- | --- |
| [Handler](src/usuarios/crear-usuario/handler.ts) | Recibe el perfil de Lambda y llama a `crearUsuarioService`. |
| [Service](src/usuarios/crear-usuario/service.ts) | Comprueba el código, el nombre, los apellidos y el correo. Limpia los espacios y llama a `crearUsuarioRepository`. |
| [Repository](src/usuarios/crear-usuario/repository.ts) | Traduce los campos a `USER_ID`, `FIRST_NAME`, `LAST_NAME`, `EMAIL` y `CITY`. Usa `PutCommand` del SDK y protege `USER_ID` con una condición de escritura. |

## Crea el perfil

El código de ejemplo reutiliza el ID del evento para identificar el perfil de esta demostración. Conserva `usuario_id` para consultar e inscribir.

```bash
usuario_id="usuario-aula-${evento_id:?Completa el caso 1 y recupera evento_id}"
printf 'ID del usuario de clase: %s\n' "$usuario_id"

aws lambda invoke \
  --function-name "festival-check-in-ts-${FCI_EQUIPO}-crearUsuario" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --cli-binary-format raw-in-base64-out \
  --payload "{\"userId\":\"$usuario_id\",\"firstName\":\"Leo\",\"lastName\":\"Martin\",\"email\":\"leo.martin@example.com\",\"city\":\"Huesca\"}" \
  respuesta-usuario.json &&
cat respuesta-usuario.json
```

Comprueba que la invocación no contiene `FunctionError` y que el JSON devuelve el `userId` que has enviado.

## Lee el perfil por su clave

```bash
aws dynamodb get-item \
  --table-name "FCI_TS_USUARIOS_${FCI_EQUIPO}" \
  --profile "$AWS_PROFILE" --region "$AWS_REGION" \
  --key "{\"USER_ID\":{\"S\":\"$usuario_id\"}}" \
  --consistent-read --query 'Item' --output json
```

**Antes de avanzar.** Comprueba que el perfil tiene tu `USER_ID` y que nombre, apellidos y correo están en campos distintos. Anota `usuario_id` si vas a cerrar la terminal.

**Para aplicarlo a tu proyecto.** Identifica qué segundo registro necesita tu caso de uso y qué clave emplearás para recuperarlo al crear la relación.

[Siguiente · Consultar una inscripción](3-consultar-inscripcion.md)
