# Festival Check-in · Local

Arranca las cinco Lambdas y las tres tablas de Festival Check-in en tu equipo. Usa Java 17 o superior, Node 22 y AWS CLI v2.

[Guía HTML de arranque, consultas SQL e invocaciones](docs/local.html) · [Abrir el proyecto original para AWS](https://github.com/albertohdezakkari/festival-checkin-01/tree/main)

Abre `docs/local.html` desde tu copia local para copiar los comandos. También puedes servir solo la guía desde la raíz del proyecto:

```bash
python3 -m http.server 43872 --bind 127.0.0.1 --directory docs
```

- `serverless.local.yml` usa Serverless Offline y reutiliza las funciones de `serverless.yml`.
- `npm run db:local` arranca DynamoDB Local.
- `npm run datos:local` crea las tablas a partir del esquema del proyecto y carga el evento 1 y el usuario de aula.
- `npm start` abre la API en el puerto 3004 y el endpoint de invocación en el 3005.
