# Rescate Fresco 🥬

Aplicación que permite a las tiendas publicar lotes de alimentos próximos a vencer o con algún desperfecto, para que la gente pueda rescatarlos a un precio más conveniente.

## Tabla de Contenidos 📑

1. Tecnologías
2. Instalación
3. Equipo
4. Enlaces

## Tecnologías 🛠️

### Backend

- Node.js
- Express ^5.1.0
- TypeScript ^5.9.3
- MongoDB (base de datos en la nube)
- Mongoose ^8.19.1

### Frontend

- React ^18.2.0
- TypeScript ^5.2.2
- Vite ^7.1.10
- Material-UI ^7.3.4

## Instalación 💻

### Requisitos Previos

- Node.js (v24.0.0 o superior) - Requerido por las dependencias del backend
- npm (v10 o superior)
- MongoDB (v7.0 o superior)

> Nota: Se recomienda usar Node.js v24.x debido a las dependencias del backend (@types/node ^24.8.1)
> 

### Paso 1: Clonar el Repositorio

```bash
git clone <https://github.com/pruebas-de-software-proyecto/rescate-fresco.git>
cd rescate-fresco

```

### Paso 2: Backend

1. Abrir una terminal
2. Navegar al directorio backend:

```bash
cd backend

```

3. Instalar dependencias:

```bash
npm install

```

4. Crear archivo .env con el siguiente contenido:

```
# Configuración del Servidor
PORT=5001
NODE_ENV=development

# Base de Datos (Reemplaza con tu string de conexión real)
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<TU_CLUSTER>.mongodb.net/?appName=<TU_APP>

# Seguridad (Inventa una frase larga y segura)
JWT_SECRET=cambia_esto_por_una_frase_larga_y_secreta

# Pasarela de Pagos (Stripe) - Usa tus claves de prueba o producción
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_secreto_webhook_aqui

```

5. Iniciar el servidor:

```bash
npm run dev

```

### Paso 3: Frontend

1. Abrir una nueva terminal
2. Navegar al directorio frontend:

```bash
cd frontend

```

3. Instalar dependencias:

```bash
npm install

```
5. Crear archivo .env con el siguiente contenido:
```
VITE_API_URL=http://localhost:5001/api
```

6. Iniciar el servidor de desarrollo:

```bash
npm run dev

```

## Comandos Disponibles 📜

### Consola Backend

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm run build`: Compila el proyecto TypeScript
- `npm start`: Inicia el servidor en modo producción

### Consola Frontend

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm test`: Ejecuta las pruebas con Vitest
- `npm test <TuTest>`: Ejecuta las pruebas de archivo <TuTest>.
- `npm run test:ui`: Ejecuta las pruebas con interfaz visual

## Equipo 👥

| Nombre | Rol | Matrícula |
| --- | --- | --- |
| Sofía Ríos Núñez | Desarrollador | 202104650-k |
| Francisca Figueroa | Desarrollador | 202104599-6 |
| Laura Leiva | Desarrollador | 202173528-3 |

## Enlaces 🔗
### Wiki del proyecto
- [Wiki del Proyecto](https://github.com/pruebas-de-software-proyecto/rescate-fresco/wiki)

### Videos explicativos
- [Video Entrega 1](https://www.canva.com/design/DAG2RnPUEOQ/BS_yET5we7NbT49zyFzEKA/edit?utm_content=DAG2RnPUEOQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- [Video Entrega 2](https://usmcl-my.sharepoint.com/:v:/g/personal/francisca_figueroal_usm_cl/Eck_amTsowBOqB4J_qBYN4sBT5glrcokPuiOHPIF_yOIOA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=MM0G21)

## Licencia 📄

Este proyecto está bajo la Licencia MIT.
