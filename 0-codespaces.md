# 0 · Festival Check-in en GitHub Codespaces

Si estás realizando la ficha **Ayuntamiento → Obra (CH-22)**, sigue la [preparación visual dentro de tu cuaderno](https://albertohdezakkari.github.io/typeorm-portal-2si-2sid/#preparar), en «1 · Preparar proyecto base». Utiliza las bases de `bases/` y trabaja dentro de `mi-practica`. Esta guía conserva la preparación de la aplicación Festival de la raíz.

Clona el proyecto del profesor, sube la copia a tu cuenta de GitHub y abre Codespaces desde tu propio repositorio. Desde allí desplegarás las seis Lambdas, la API y las tres tablas DynamoDB en **AWS Academy** con **Serverless Framework 3.40.0**. [Configuración del proyecto](0-conf.md)

## 1. Sube el proyecto a tu GitHub y abre tu Codespace

### A. Crea tu carpeta de trabajo

Abre **Git Bash** en Windows o **Terminal** en macOS. En las dos terminales, `$HOME` contiene la ruta de tu carpeta personal. Comprueba qué valor tiene en tu equipo:

```bash
printf '%s\n' "$HOME"
```

- **Windows con Git Bash.** Una salida habitual es `/c/Users/tu_usuario`.
- **macOS con Terminal.** Una salida habitual es `/Users/tu_usuario`.

Si estás en **CMD**, allí se escribe `%USERPROFILE%`. Para seguir los comandos de la práctica en Windows, abre **Git Bash**.

Ahora crea `proyectos-serverless` dentro de tu carpeta personal y entra en ella.

```bash
mkdir -p "$HOME/proyectos-serverless"
cd "$HOME/proyectos-serverless"
pwd
```

`mkdir -p` permite volver a usar la carpeta si ya existe. `pwd` muestra dónde estás.

**Antes de clonar**, comprueba que la ruta que muestra `pwd` termina en `/proyectos-serverless`.

### B. Clona el proyecto base en tu ordenador

Desde `proyectos-serverless`, ejecuta estos comandos. `git clone` creará la subcarpeta `festival-checkin-aula` con el proyecto.

```bash
git clone --branch main --single-branch https://github.com/albertohdezakkari/festival-checkin-01.git festival-checkin-aula
cd festival-checkin-aula
git remote -v
```

Después de clonar, `origin` apunta al repositorio del profesor. Si ya existe una carpeta llamada `festival-checkin-aula`, elige otro nombre de carpeta en `git clone` y usa ese mismo nombre en `cd`.

### C. Crea un repositorio vacío en tu cuenta

1. Inicia sesión en GitHub con **tu propia cuenta** y abre [New repository](https://github.com/new).
2. En **Owner**, selecciona tu usuario. En **Repository name**, escribe `festival-checkin-aula` o el nombre que vayas a usar en clase.
3. Pulsa **Create repository** con las opciones de README, `.gitignore` y licencia desactivadas. El clon ya tiene historial y archivos.
4. En **Quick setup**, selecciona **HTTPS** y copia la URL de tu nuevo repositorio. Debe tener el formato `https://github.com/TU_USUARIO/TU_REPOSITORIO.git`. [Subir un proyecto existente a GitHub](https://docs.github.com/es/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

### D. Cambia `origin` y sube `main`

En la misma terminal del ordenador, desde la carpeta del clon, ejecuta estas dos líneas. Pega la URL del repositorio que acabas de crear y pulsa **Intro**.

```bash
printf 'Pega la URL HTTPS de tu repositorio y pulsa Intro: '
IFS= read -r repo_aula
```

Ahora cambia el destino de `origin`. El comando conserva los archivos y commits del clon.

```bash
git remote set-url origin "$repo_aula"
git remote -v
```

**Antes de subir**, comprueba que las dos líneas de `origin` muestran **tu usuario de GitHub y tu repositorio nuevo**. Después ejecuta:

```bash
git push -u origin main
```

Si Git abre una ventana de autenticación, entra con la misma cuenta que usaste para crear el repositorio. Si aparece un `403`, comprueba la cuenta autenticada y la URL que muestra `git remote -v`. [Autenticación de Git por HTTPS](https://docs.github.com/es/get-started/git-basics/caching-your-github-credentials-in-git)

**Antes de avanzar**, recarga tu repositorio en GitHub. Deben aparecer la rama `main` y los archivos `package.json` y `serverless.yml`.

### E. Abre Codespaces desde tu repositorio

1. En la página de **tu repositorio**, elige la rama `main`.
2. Pulsa **Code → Codespaces → Create codespace on main**. Si ya tienes un Codespace de este repositorio, puedes abrirlo desde esa misma pestaña. Si la opción no aparece, abre [New codespace](https://github.com/codespaces/new), selecciona tu repositorio y elige `main`. [Crear un Codespace desde una rama](https://docs.github.com/es/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository)
3. En el VS Code del navegador, abre **Terminal → New Terminal**. A partir de aquí, ejecuta los comandos en Bash desde la raíz del proyecto en Codespaces.

```bash
pwd
git remote get-url origin
git branch --show-current
ls package.json serverless.yml
```

**Antes de avanzar**, comprueba que `origin` muestra tu usuario de GitHub, que la rama es `main` y que aparecen los dos archivos.

## 2. Instala las herramientas

### Comprueba Node.js y AWS CLI

```bash
node --version
npm --version
aws --version
```

El proyecto admite Node.js **20 o superior**. Si tienes una versión anterior, activa Node 22 en esta terminal:

```bash
nvm install 22
nvm use 22
node --version
```

Si `aws --version` devuelve `aws: command not found` o muestra `aws-cli/1.`, instala AWS CLI v2 en el Linux del Codespace. [Instalación oficial de AWS CLI en Linux](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

```bash
curl -fsSL https://awscli.amazonaws.com/v2/install.sh | sudo bash -s -- --system
hash -r
aws --version
```

**Antes de avanzar**, comprueba que `aws --version` empieza por **`aws-cli/2.`**.

### Instala Serverless Framework desde el proyecto

```bash
npm ci --include=dev
npm run deploy -- --version
```

`npm ci` instala las versiones de `package-lock.json`. `--include=dev` incluye Serverless, que está declarado como herramienta de desarrollo. El segundo comando comprueba la versión que usará el despliegue.

**Antes de avanzar**, comprueba que aparece **`Framework Core: 3.40.0 (local)`**. Esta versión solo requiere las credenciales de AWS Academy para desplegar este proyecto. Si aparece el menú de inicio de sesión de la v4, [actualiza el Codespace](#si-ya-tenías-un-codespace-con-serverless-4).

## 3. Conecta AWS Academy con el perfil default

1. En el navegador, entra en **AWS Academy → Learner Lab → Start Lab**. Espera a que el laboratorio esté activo.
2. Abre **AWS Details → AWS CLI → Show** y copia el bloque de credenciales temporales. Incluye la clave de acceso, la clave secreta y el token de sesión.
3. Abre el archivo personal de credenciales en el Codespace:

```bash
mkdir -p ~/.aws
touch ~/.aws/credentials
chmod 600 ~/.aws/credentials
vi ~/.aws/credentials
```

Si el archivo está vacío, escribe `:set paste` en `vi`, pulsa **Intro**, después **i** y pega el bloque bajo la cabecera `[default]`. Si ya hay un bloque `[default]`, sustituye sus tres valores. Guarda con **Esc**, `:wq` e **Intro**. El archivo queda fuera del repositorio.

En la misma terminal, indica qué perfil, región y equipo vas a usar. Sustituye `equipo01` por tu código asignado. Si ya guardaste las credenciales con la cabecera `[academy]`, usa `academy` como valor de `AWS_PROFILE`.

```bash
export AWS_PROFILE=default
export AWS_REGION=us-east-1
export FCI_EQUIPO=equipo01

aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION"
```

**Antes de avanzar**, comprueba que aparecen `Account` y `Arn`. Si el perfil no existe, comprueba que la cabecera en el archivo coincide con `AWS_PROFILE`. Si aparece `ExpiredToken`, vuelve a **AWS Details**, sustituye los tres valores y repite la comprobación.

## 4. Configura el rol y despliega

Recupera el ARN de `LabRole`. AWS utilizará ese rol para conceder a las Lambdas acceso a los recursos del laboratorio.

```bash
LAMBDA_ROLE_ARN="$(aws iam get-role --role-name LabRole --profile "$AWS_PROFILE" --region "$AWS_REGION" --query 'Role.Arn' --output text)"
printf 'Rol de Lambda: %s\n' "$LAMBDA_ROLE_ARN"
```

Si el laboratorio deniega `iam:GetRole`, usa el ARN completo de `LabRole` de tu cuenta que te facilite el profesor. Sustituye el texto de ejemplo por ese ARN antes de ejecutar la línea.

```bash
LAMBDA_ROLE_ARN='PEGA_AQUI_EL_ARN_DE_LABROLE'
```

**Antes de desplegar**, comprueba que el ARN empieza por `arn:aws:iam::` y termina en `:role/LabRole`. En esa misma terminal, exporta el rol y ejecuta el despliegue.

```bash
export LAMBDA_ROLE_ARN
npm run deploy -- --aws-profile "$AWS_PROFILE"
```

- **`Warning` en `provider.runtime`**. Serverless 3.40.0 tiene un validador anterior a Node.js 22. Si después ves `Deploying festival-check-in`, el despliegue ha comenzado. [Aviso registrado en Serverless](https://github.com/serverless/serverless/issues/12963)
- **`Ensuring that deployment bucket exists`**. Serverless está preparando el bucket de S3 donde subirá los archivos de las Lambdas. Deja la terminal abierta hasta que termine.

**Antes de avanzar**, espera la confirmación del despliegue y busca la URL de la API en la salida. También puedes abrir **AWS → Lambda → Funciones**, elegir **N. Virginia (`us-east-1`)** y buscar `festival-check-in` junto a tu código de equipo.

## 5. Carga los datos y comprueba el resultado

En la misma terminal, ejecuta:

```bash
npm run aula
```

El comando invoca las Lambdas que crean el evento y el usuario de ejemplo. Después prueba la API desplegada.

| Petición | Resultado esperado al estrenar las tablas |
| --- | --- |
| `GET` → `200` | Puedes consultar el evento y el pase todavía está sin inscribir. |
| `POST` → `201` | Se guarda la inscripción. |
| `POST` → `409` | La inscripción ya existe. |
| `GET` → `200` | La consulta devuelve la inscripción guardada. |

Si ya ejecutaste la prueba con ese equipo, el comando indica que el pase ya estaba inscrito y pasa a comprobar el `409`. En ambos recorridos, espera el mensaje **`Pase persistido en AWS`** y la URL de la API.

Comprueba el evento directamente en DynamoDB con PartiQL:

```bash
aws dynamodb execute-statement \
  --statement "SELECT * FROM \"FCI_EVENTOS_${FCI_EQUIPO}\" WHERE EVENT_ID = 1" \
  --output json
```

**Antes de terminar**, busca **Festival de otoño** en `Items`. [Comparar GetItem y PartiQL](0-conf.md#compara-la-consulta-de-aws-con-sql) · [Abrir las invocaciones del cuaderno](https://albertohdezakkari.github.io/04-PILARES-SERVERLESS/practica/festival-checkin/traza-evento/#invocaciones)

## Si ya tenías un Codespace con Serverless 4

Si ves el menú de inicio de sesión de Serverless, pulsa **Ctrl+C**. Si el menú sigue abierto, usa el botón **+** del panel Terminal para abrir otro Bash en el mismo Codespace. Desde la raíz del proyecto en `main`, comprueba el remoto y trae los cambios de **tu repositorio**:

```bash
git status --short --branch
git remote -v
git pull --ff-only origin main
```

Si Git dice que se sobrescribiría **`package-lock.json`** porque lo modificaste al instalar dependencias, guarda ese cambio en el stash y vuelve a actualizar. El stash conserva una copia recuperable del cambio local.

```bash
git stash push -m 'Copia del package-lock antes de actualizar Serverless' -- package-lock.json
git pull --ff-only origin main
```

Después de un `pull` correcto, vuelve al paso **2** para instalar las dependencias del repositorio y comprobar la versión. Si tu repositorio personal todavía contiene la configuración antigua, incorpora los cambios del proyecto base desde su URL:

```bash
git pull --ff-only https://github.com/albertohdezakkari/festival-checkin-01.git main
```

Después de un `pull` correcto, ejecuta `git push origin main` para guardar la actualización en **tu repositorio**. Si Git indica que las ramas han divergido, detente y revisa con el profesor cómo incorporar los cambios. Repite el paso **2** y continúa desde el **3** para configurar tu sesión de AWS Academy.
