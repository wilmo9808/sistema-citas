#Gestión de Citas Médicas

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2-green)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5-yellow)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-orange)](LICENSE)

> Sistema completo de gestión de citas médicas con historial de pacientes y gestión documental.

---

## Tabla de Contenidos

- [Características Principales]
- [Tecnologías Utilizadas]
- [Requisitos Previos]
- [Instalación]
- [Configuración de Supabase]
- [Variables de Entorno]
- [Uso]
- [Estructura del Proyecto]
- [Contacto]

---

## Características Principales

### Autenticación Segura
- Registro e inicio de sesión con email/contraseña
- Protección de rutas (solo usuarios autenticados)
- Persistencia de sesión con localStorage

### Gestión de Citas
- Creación, edición y eliminación de citas
- Selección de paciente existente o creación automática
- Asignación de servicios médicos
- Filtros por estado (pendiente, confirmada, completada, cancelada)
- Visualización en dashboard con estadísticas

### Registro de Pacientes
- Registro completo de pacientes con datos personales y clínicos:
  - Nombre, email, teléfono
  - Documento de identidad
  - Sexo, edad
  - Peso, estatura
- Búsqueda por nombre, email o documento
- Edición y eliminación de pacientes
- Historial de citas por paciente

### Gestión Documental
- Subida de documentos asociados a pacientes
- Soporte para PDF, imágenes, documentos Word
- Categorización (recetas, radiografías, informes, otros)
- Vista previa de imágenes y PDFs
- Eliminación de documentos

### Dashboard Informativo
- Estadísticas en tiempo real (total citas, pendientes, confirmadas, próximas)
- Lista de citas recientes
- Acciones rápidas

### Diseño Responsivo
- Interfaz moderna y responsive
- Tema claro (blanco y azul)
- Animaciones suaves
- Diseño mobile-first

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **React 18** | Biblioteca principal |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool |
| **Supabase** | Backend (Auth, Database, Storage) |
| **React Router v6** | Navegación |
| **React Hook Form** | Manejo de formularios |
| **Yup** | Validaciones |
| **CSS Modules** | Estilos encapsulados |
| **Vitest** | Pruebas unitarias |
| **React Hot Toast** | Notificaciones |

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Cuenta en [Supabase](https://supabase.com/) (gratis)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/wilmo9808/sistema-citas.git
cd sistema-citas

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173

Configuración de Supabase
1. Crear proyecto en Supabase
Ve a supabase.com

Crea un nuevo proyecto

Guarda la URL y la anon key

2. Ejecutar SQL para crear tablas
sql
-- Tabla de perfiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    sexo TEXT CHECK (sexo IN ('M', 'F', 'Otro')),
    edad INTEGER,
    documento TEXT,
    peso DECIMAL(5,2),
    estatura DECIMAL(5,2),
    user_id UUID REFERENCES auth.users NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de citas
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    service_id UUID REFERENCES services(id),
    service_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    user_id UUID REFERENCES auth.users NOT NULL,
    patient_id UUID REFERENCES patients(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos
CREATE TABLE documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    category TEXT DEFAULT 'otros',
    patient_id UUID REFERENCES patients(id),
    user_id UUID REFERENCES auth.users NOT NULL,
    appointment_id UUID REFERENCES appointments(id),
    created_at TIMESTAMP DEFAULT NOW()
);

3. Crear bucket de Storage
En Supabase Dashboard → Storage → Create a new bucket

Nombre: documents
Marcar como público
Crear bucket

## Variables de Entorno **
Crea un archivo .env en la raíz:

VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui

## Uso **
Registro e inicio de sesión
Ve a /register y crea una cuenta

Inicia sesión en /login

Gestión de pacientes
Ve a /patients

Crea un nuevo paciente con todos sus datos

Edita o elimina pacientes según necesites

Gestión de citas
Ve a /appointments

Selecciona un paciente existente o crea uno nuevo

Completa los datos de la cita

La cita quedará vinculada al paciente

Subida de documentos
Ve a /documents

Selecciona un paciente

Sube documentos (PDF, imágenes, Word)

Los documentos quedarán asociados al paciente

## Estructura del Proyecto **

sistema-citas/
├── src/
│   ├── components/
│   │   ├── appointments/      # Componentes de citas
│   │   ├── auth/              # Autenticación
│   │   ├── documents/         # Gestión documental
│   │   ├── layout/            # Navbar, Footer
│   │   └── patients/          # Gestión de pacientes
│   ├── context/               # Contextos globales
│   ├── pages/                 # Páginas de la aplicación
│   ├── services/              # Servicios de Supabase
│   ├── types/                 # Tipos TypeScript
│   ├── styles/                # Estilos globales
│   └── tests/                 # Pruebas
├── public/                    # Archivos estáticos
└── package.json

Ejecutar Pruebas

# Ejecutar pruebas
npm run test

# Ver cobertura
npm run test:coverage

# Modo watch
npm run test:watch

## Scripts Disponibles **

Comando	Descripción
npm run dev	Inicia servidor de desarrollo
npm run build	Construye para producción
npm run preview	Vista previa de producción
npm run test	Ejecuta pruebas
npm run test:coverage	Cobertura de pruebas

## Contacto **
Autor: Wilson Javier Molina Lozano

GitHub	@wilmo9808
LinkedIn	Wilson Molina Lozano
Email	molina9808@gmail.com



