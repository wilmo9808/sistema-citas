# 🏥 Sistema de Citas Médicas

Una plataforma moderna y eficiente para la gestión de citas médicas, pacientes y expedientes clínicos, construida con tecnologías de vanguardia para ofrecer una experiencia fluida tanto a profesionales de la salud como a pacientes.

## 🚀 Características Principales

- **🔐 Autenticación Segura**: Sistema de registro e inicio de sesión integrado con Supabase Auth.
- **📅 Gestión de Citas**: Visualización, creación y seguimiento de citas médicas en tiempo real.
- **👥 Registro de Pacientes**: Directorio completo con perfiles detallados, historial de salud y datos de contacto.
- **📂 Gestión Documental**: Carga y almacenamiento de archivos adjuntos (exámenes, recetas, etc.) integrados con Supabase Storage.
- **📊 Dashboard Informativo**: Resumen visual de la actividad diaria y métricas clave del sistema.
- **📱 Interfaz Responsiva**: Diseño adaptativo que funciona perfectamente en dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Gestión de Estado**: React Context API
- **Estilos**: CSS Modules & Variables CSS
- **Backend/Base de Datos**: [Supabase](https://supabase.com/)
- **Formularios**: React Hook Form + Yup (Validación)
- **Notificaciones**: React Hot Toast
- **Pruebas**: Vitest + React Testing Library

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Una cuenta de Supabase (para configurar la base de datos y servicios)

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/sistema-citas.git
   cd sistema-citas
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:
   ```bash
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```text
src/
├── assets/         # Recursos estáticos (imágenes, iconos)
├── components/     # Componentes reutilizables organized por funcionalidad
│   ├── auth/       # Login, Registro, Rutas protegidas
│   ├── appointments/ # Componentes de citas
│   ├── layout/     # Navbar, Contenedores globales
│   ├── patients/   # Listados y detalles de pacientes
│   └── ui/         # Elementos base de UI (Botones, inputs, modales)
├── context/        # Proveedores de contexto (Auth, Appointments)
├── hooks/          # Hooks personalizados
├── pages/          # Pantallas principales (Dashboard, Login, etc.)
├── services/       # Lógica de comunicación con APIs (Supabase, API interna)
├── styles/         # Estilos globales y variables de diseño
├── types/          # Definiciones de TypeScript e interfaces
└── utils/          # Funciones de utilidad y formateadores
```

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el modo desarrollo con Vite.
- `npm run build`: Compila el proyecto para producción.
- `npm run preview`: Previsualiza la versión compilada localmente.
- `npm run test`: Ejecuta las pruebas unitarias con Vitest.
- `npm run test:ui`: Abre la interfaz visual de Vitest para las pruebas.
- `npm run server`: Inicia `json-server` (opcional, para datos de prueba locales).
- `npm run dev:full`: Inicia simultáneamente el servidor de prueba y el frontend.

## 🤝 Contribuciones

Si deseas contribuir a este proyecto:
1. Haz un Fork del proyecto.
2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`).
3. Realiza tus cambios y haz Commit (`git commit -m 'Añade nueva característica'`).
4. Sube los cambios a tu rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un Pull Request.

---
Desarrollado con ❤️ para mejorar la gestión clínica.
