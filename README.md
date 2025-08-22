# Clínica Dental - Dra. Lesly Vázquez

¡Bienvenido al repositorio de la página web oficial de la Dra. Lesly Vázquez!

Este proyecto es el sitio web de una clínica dental, diseñado para ser un punto de contacto profesional y una herramienta de agendamiento de citas para los pacientes.

## Características

-   **Página Principal (`index.html`):** Muestra los servicios principales, una breve introducción y un formulario para agendar citas directamente.
-   **Página de Servicios (`servicios.html`):** Proporciona información detallada sobre los tratamientos ofrecidos, incluyendo beneficios y preguntas frecuentes.
-   **Página de Signos y Síntomas (`signos-sintomas.html`):** Ayuda a los pacientes a identificar problemas dentales comunes.
-   **Formulario de Citas:** Se integra con una API de Google Apps Script para gestionar citas y disponibilidad en tiempo real.
-   **Portal Administrativo:** Permite a la clínica gestionar las citas y los expedientes clínicos de los pacientes, con un sistema de autenticación seguro.
-   **Diseño Responsivo:** Adaptado para una experiencia de usuario óptima en dispositivos móviles, tablets y computadoras de escritorio.

## Despliegue

Este proyecto está diseñado para ser desplegado fácilmente en plataformas como **Vercel**. Al conectar el repositorio de GitHub con tu cuenta de Vercel, la aplicación se desplegará de forma automática.

## Configuración de Apps Script (Importante)

Para que el formulario de citas funcione, necesitas desplegar el código de Google Apps Script y obtener tu URL de la API.

1.  Crea un nuevo proyecto en Google Apps Script.
2.  Pega el código proporcionado en `code.gs`.
3.  Ve a `Servicios` y agrega el servicio **Google Calendar API**.
4.  Despliega el proyecto como una aplicación web (`Desplegar` > `Nuevo despliegue` > `Aplicación web`).
5.  Asegúrate de que "Acceder como" sea "Yo" y "Quién tiene acceso" sea "Cualquier persona".
6.  Copia la URL de la API y pégala en los archivos `js/main.js`, `admin/js/auth.js` y `admin/js/dashboard.js` en la variable `SHEETS_API_URL` o `APPS_SCRIPT_URL` según corresponda.
