# Carros Compartidos PUCE - Frontend

![](./screenshot.jpg)

Este es el repositorio del frontend para la aplicación de Carros Compartidos de la comunidad de la Pontificia Universidad Católica del Ecuador (PUCE). La aplicación busca facilitar la organización de viajes compartidos entre estudiantes, docentes y personal administrativo, promoviendo un transporte más sostenible, económico y seguro.

Construido con React y Vite, este proyecto se conecta con un backend para gestionar usuarios, viajes, reservas e incidentes.

## ✨ Características

*   **Autenticación de Usuarios:** Sistema de registro e inicio de sesión utilizando Firebase Authentication.
*   **Dashboard Principal:** Muestra una lista de los viajes activos a los que los usuarios pueden unirse.
*   **Gestión de Viajes:**
    *   **Crear Viajes:** Los conductores pueden publicar nuevos viajes especificando origen, destino, hora de salida, asientos disponibles y más.
    *   **Ver Detalles:** Vista detallada de cada viaje con toda la información relevante.
    *   **Editar Viajes:** Los creadores de viajes pueden modificar los detalles de sus publicaciones.
    *   **Cambiar Estado:** Los conductores pueden iniciar, completar o cancelar sus viajes.
*   **Sistema de Reservas:**
    *   Los pasajeros pueden solicitar unirse a un viaje.
    *   Los conductores pueden aceptar o rechazar las solicitudes de reserva.
    *   Los pasajeros pueden cancelar sus reservas.
*   **Perfiles de Usuario:**
    *   Una sección donde los usuarios pueden ver su información personal.
    *   Historial de viajes creados y reservas realizadas.
    *   Lista de incidentes reportados.
*   **Reporte de Incidentes:** Permite a los usuarios reportar cualquier problema ocurrido durante un viaje, como accidentes, retrasos o comportamientos inadecuados.
*   **Rutas Protegidas:** Ciertas secciones de la aplicación solo son accesibles para usuarios autenticados.

## 🚀 Tecnologías Utilizadas

*   **Framework Frontend:** [React](https://reactjs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Autenticación:** [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **Estilos:** CSS plano con una arquitectura modular.
*   **Iconos:** [React Icons](https://react-icons.github.io/react-icons/)

## 🛠️ Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18 o superior)
*   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)
*   Un proyecto de Firebase configurado para la autenticación.

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd pi-tercero-fe
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las credenciales de tu proyecto de Firebase.

    ```env
    VITE_API_KEY="TU_API_KEY"
    VITE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
    VITE_PROJECT_ID="TU_PROJECT_ID"
    VITE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
    VITE_MESSAGING_SENDER_ID="TU_MESSAGING_SENDER_ID"
    VITE_APP_ID="TU_APP_ID"
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 📁 Estructura del Proyecto

```
pi-tercero-fe/
├── src/
│   ├── assets/         # Imágenes y otros recursos estáticos
│   ├── components/     # Componentes reutilizables (Navbar, ProtectedRoute, etc.)
│   ├── config/         # Configuración de servicios (Firebase)
│   ├── context/        # Contexto de React (AuthContext)
│   ├── pages/          # Componentes de página (Home, Login, Dashboard, etc.)
│   ├── App.jsx         # Componente principal y configuración de rutas
│   ├── main.jsx        # Punto de entrada de la aplicación
│   └── index.css       # Estilos globales
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias y scripts del proyecto
└── README.md           # Este archivo
```