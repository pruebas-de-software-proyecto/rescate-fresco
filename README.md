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
- MongoDB (base de datos en local)
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
- selenium 4.16.0
- webdriver-manager 4.0.1
- unittest-xml-reporting==3.2.0

> Nota: Se recomienda usar Node.js v24.x debido a las dependencias del backend (@types/node ^24.8.1)
> 

### Paso 1: Clonar el Repositorio

```bash
git clone <https://github.com/pruebas-de-software-proyecto/rescate-fresco.git>
cd rescate-fresco

```

### Paso 2: Base de Datos

1. Abrir una terminal
2. Iniciar el servidor MongoDB:

```bash
mongod --dbpath <ruta-de-tu-base-de-datos>

```

1. Mantener esta terminal abierta

### Paso 3: Backend

1. Abrir una nueva terminal
2. Navegar al directorio backend:

```bash
cd backend

```

1. Instalar dependencias:

```bash
npm install

```

1. Crear archivo .env con el siguiente contenido:

```
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/rescatefresco

```

1. Iniciar el servidor:

```bash
npm run dev

```

1. (Opcional) Poblar la base de datos con datos de prueba:

```bash
npm run seed

```

### Paso 4: Frontend

1. Abrir una nueva terminal
2. Navegar al directorio frontend:

```bash
cd frontend

```

1. Instalar dependencias:

```bash
npm install

```

1. Iniciar el servidor de desarrollo:

```bash
npm run dev

```

## Comandos Disponibles 📜

### Consola Backend

- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm run build`: Compila el proyecto TypeScript
- `npm start`: Inicia el servidor en modo producción
- `npm run seed`: Pobla la base de datos con datos de prueba

### Consola Frontend

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila el proyecto para producción
- `npm test`: Ejecuta las pruebas con Vitest
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
