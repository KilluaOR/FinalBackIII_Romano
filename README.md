# 🐾 AdopMe API - Backend Final Project

API RESTful para la gestión de adopciones de mascotas, construida con Node.js, Express y MongoDB. Este proyecto incluye pruebas funcionales, documentación interactiva con Swagger y está optimizado y subido a DockerHub.

## 🚀 Enlaces Importantes

- **💻 Repositorio GitHub:** [https://github.com/KilluaOR/FinalBackIII_Romano](https://github.com/KilluaOR/FinalBackIII_Romano)
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

### Opción 1: Despliegue con Docker
Para descargar de forma pública la imagen optimizada e instanciar el contenedor de la API mapeando el puerto `3000`, ejecute los siguientes comandos en su terminal:

```bash
# 1. Descargar la imagen desde DockerHub
docker pull killuaor/adoption-api:1.0.0

# 2. Ejecutar el contenedor expuesto en el puerto 3000
docker run -d -p 3000:3000 -e DATABASE="mongodb://host.docker.internal:27017/adoptions_db" --name adopme-api killuaor/adoption-api:1.0.0

```

### Opción 2: Ejecución Local
Si desea ejecutar la aplicación en su entorno local de desarrollo sin Docker, utilice el gestor de paquetes estándar de Node (npm):
```bash
# 1. Clonar el repositorio e instalar todas las dependencias del proyecto
git clone https://github.com/KilluaOR/FinalBackIII_Romano.git
cd FinalBackIII_Romano
npm install

# 2. Configurar el entorno (Crear un archivo .env en la raíz con sus credenciales de Mongo)
# DATABASE="tu_string_de_conexion_a_mongodb"
# PORT=3000

# 3. Iniciar el servidor de producción
npm start
```
---

## 🧪 Instrucciones para Correr los Tests
La suite completa de pruebas funcionales automatizadas valida de forma aislada el comportamiento de adoption.router.js

Para iniciar la suite completa de pruebas, ejecute el comando en la terminal de su entorno local:

```bash
npm test
```

Para realizar un análisis detallado del porcentaje de cobertura sobre el código fuente, utilice el script de cobertura:

```bash
npm run test:coverage
```

## 📸 Evidencia de los Tests y logs de ejecución:
orner@Killua MINGW64 ~/study/coder/Final-Romano-BackIII (main)
$ node src/index.js
Database conection success!
Listening on 3000


orner@Killua MINGW64 ~/study/coder/Final-Romano-BackIII (main)
$ npm test

> plantilladocumentacion@1.0.0 test
> node scripts/run-jest.mjs

(node:17740) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  tests/functional/adoption.router.test.js (7.726 s)
  Adoption Router - Endpoints
    GET /api/adoptions/ - getAllAdoptions                               
      √ ✅ should return all adoptions with status 200 (207 ms)         
      √ ✅ should return empty array when no adoptions exist (16 ms)    
      √ ❌ should handle database errors gracefully (13 ms)             
      √ ⚠️ should handle unauthorized access (12 ms)                     
    GET /api/adoptions/:aid - getAdoption                               
      √ ✅ should return adoption by ID with status 200 (17 ms)         
      √ ❌ should return 404 when adoption not found (15 ms)            
      √ ⚠️ should return 400 for invalid adoption ID format (13 ms)      
      √ ❌ should handle database errors (10 ms)                        
    POST /api/adoptions/:uid/:pid - createAdoption                      
      √ ✅ should create adoption with valid data (uid and pid) (441 ms)
      √ ⚠️ should return 400 when uid is missing (12 ms)                 
      √ ⚠️ should return 400 when pid is missing (10 ms)                 
      √ ❌ should handle invalid user ID format (10 ms)                 
      √ ❌ should handle invalid pet ID format (10 ms)                  
      √ ❌ should handle user not found (10 ms)                         
      √ ❌ should handle pet not found (17 ms)                          
      √ ⚠️ should return 400 when body contains invalid data (9 ms)      
      √ ❌ should handle server errors (10 ms)                          
                                                                        
Test Suites: 1 passed, 1 total                                          
Tests:       17 passed, 17 total                                        
Snapshots:   0 total
Time:        10.475 s
Ran all test suites.