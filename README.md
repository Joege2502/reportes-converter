# Smart Report Fixer 🚀

### Legacy Data Normalizer • v1.0

Este proyecto es una herramienta Full-Stack diseñada para la limpieza, normalización y transformación de reportes financieros complejos generados en formatos HTML estructurados (disfrazados de XLS), convirtiéndolos en documentos XLSX limpios y listos para el análisis.

## 🛠️ Stack Tecnológico

- **Backend:** NestJS (Node.js) - Arquitectura modular y escalable.
- **Frontend:** Next.js 14 - Interfaz moderna con Tailwind CSS (Emerald/Dark Aesthetic).
- **Seguridad:** - Autenticación mediante **JWT (JSON Web Tokens)**.
  - Cifrado de contraseñas con **Bcrypt** (Costo de hash optimizado).
  - Protección de rutas mediante **Auth Guards** y **Passport Strategy**.
- **Procesamiento de Datos:**
  - `ExcelJS` para generación y manipulación de archivos Excel.
  - `Cheerio` para el parseo y extracción de datos desde estructuras HTML.

## 🛡️ Características de Seguridad y DevOps

- **Variables de Entorno:** Gestión segura de secretos (`JWT_SECRET`, `ADMIN_PASSWORD_HASH`) mediante archivos `.env` y variables de configuración en la nube.
- **Validación de Sesión:** Sistema de login con persistencia de token y cierre de sesión seguro (limpieza de LocalStorage).
- **UI/UX:** Interfaz optimizada con estados de carga (Loading bars) y diseño responsivo adaptado a entornos profesionales.

## 🚀 Instalación y Despliegue Local

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/Joege2502/reportes-converter.git](https://github.com/Joege2502/reportes-converter.git)

   ```

2. **Configurar variables de entorno:**
   Crear un archivo `.env` en la carpeta `/api` con las siguientes llaves:
   - `ADMIN_PASSWORD_HASH`: $12F3$D12E4JNLK5NL5LK656KLNN6L5L.
   - `JWT_SECRET`: Tu clave secreta para la firma de tokens.

3. **Ejecutar el Backend:**

   ```bash
   cd api
   npm install
   npm run start:dev

   ```

4. **Ejecutar el Frontend:**
   ```bash
   cd web
   npm install
   npm run dev
   ```

**Desarrollado por Jorge Luis Osores Muñante - Ingeniería de Software con Inteligencia Artificial (SENATI).**
