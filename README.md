# 🐾 AdopMe API - Backend Final Project

API RESTful para la gestión de adopciones de mascotas, construida con Node.js, Express y MongoDB. Este proyecto incluye pruebas funcionales, documentación interactiva con Swagger y está optimizado y subido a DockerHub.

## 🚀 Enlaces Importantes

- **🐳 DockerHub Image:** [https://hub.docker.com/repository/docker/killuaor/adoption-api/tags](https://hub.docker.com/repository/docker/killuaor/adoption-api/tags)
- **📖 Documentación Swagger:** Ejecuta el proyecto y entra a `http://localhost:3000/api-docs`

---

## 🛠️ Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB, Mongoose
- **Testing:** Jest, Supertest
- **Documentación:** Swagger (OpenAPI 3.0)
- **Despliegue:** Docker, DockerHub

---

## 💻 Instrucciones para ejecutar el proyecto

### Opción 1: Usando Docker (Recomendado)
Asegúrate de tener un contenedor de MongoDB corriendo, o pasa una URI de MongoDB Atlas.
```bash
# 1. Descargar la imagen desde DockerHub
docker pull killuaor/adoption-api:latest

# 2. Ejecutar el contenedor
docker run -d -p 3000:3000 -e DATABASE="mongodb://host.docker.internal:27017/adoptions_db" --name adopme-api killuaor/adoption-api:latest

Opción 2: Ejecución Local
bash
# 1. Instalar dependencias
npm install
# 2. Configurar variables de entorno (Crear un archivo .env si es necesario)
# DATABASE="tu_string_de_conexion_mongo"
# PORT=3000
# 3. Iniciar el servidor
npm start
🧪 Pruebas Funcionales (Testing)
El proyecto incluye tests funcionales completos para el flujo de adopciones (adoption.router.js). Para ejecutarlos localmente:

bash
pnpm test
Para ver el reporte de cobertura (Coverage):

bash
pnpm test:coverage