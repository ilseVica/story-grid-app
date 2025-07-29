# Story Grid Application

Una herramienta de planificación de historias inspirada en Plottr con una interfaz de cuadrícula donde los capítulos son columnas y los personajes son filas.

## Estructura del Proyecto

```
├── client/                # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/    # Componentes UI reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   └── lib/          # Utilidades y configuraciones
├── server/               # Backend Express.js + TypeScript
│   ├── db.ts            # Conexión a la base de datos
│   ├── storage.ts       # Capa de almacenamiento con PostgreSQL
│   └── routes.ts        # API endpoints
└── shared/              # Esquemas compartidos
    └── schema.ts        # Modelos de datos con Drizzle ORM
```

## Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la base de datos PostgreSQL

**Opción A: PostgreSQL local**
```bash
# Instalar PostgreSQL en tu sistema
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS con Homebrew:
brew install postgresql

# Crear base de datos
createdb story_grid_db
```

**Opción B: PostgreSQL en la nube (recomendado)**
- **Neon**: https://neon.tech (gratis hasta 500MB)
- **Supabase**: https://supabase.com (gratis hasta 500MB)
- **Railway**: https://railway.app
- **Render**: https://render.com

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/story_grid_db"
```

Para servicios en la nube, usa la URL de conexión que te proporcionen:
```env
# Ejemplo con Neon
DATABASE_URL="postgresql://usuario:contraseña@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Ejemplo con Supabase
DATABASE_URL="postgresql://postgres:contraseña@db.xxx.supabase.co:5432/postgres"
```

### 4. Crear las tablas en la base de datos
```bash
npm run db:push
```
### 4.1 Instalar dotenv (Si no lo tienes)

```bash
npm install dotenv
```

### 5. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## Uso de la Aplicación

### Interfaz Principal
- **Capítulos** aparecen como columnas en la parte superior
- **Personajes** aparecen como filas en el lado izquierdo
- **Tarjetas de contenido** se crean en la intersección de cada personaje y capítulo

### Funcionalidades
- **Agregar Capítulos**: Botón "Agregar Capítulo" en la barra de herramientas
- **Agregar Personajes**: Botón "Agregar Personaje" en la barra de herramientas
- **Editar Contenido**: Haz clic en cualquier celda para agregar o editar el propósito del personaje en ese capítulo
- **Eliminar**: Botón X al hacer hover sobre capítulos o personajes

### Etiquetas Disponibles
- Introducción, Conflicto, Desarrollo, Clímax, Resolución
- Apoyo, Revelación, Sacrificio, Legado, Sombra
- Manipulación, Confrontación, Derrota, Guía, Apoyo Técnico

## Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia la aplicación en modo desarrollo

# Base de datos
npm run db:push      # Sincroniza el esquema con la base de datos
npm run db:studio    # Abre Drizzle Studio para gestionar datos

# Construcción
npm run build        # Construye la aplicación para producción
npm start            # Inicia la aplicación en modo producción
```

## Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Wouter** para enrutamiento
- **TanStack Query** para gestión de estado del servidor
- **Shadcn/ui** componentes de interfaz
- **Tailwind CSS** para estilos
- **Vite** como herramienta de construcción

### Backend
- **Express.js** con TypeScript
- **Drizzle ORM** para base de datos
- **PostgreSQL** para persistencia de datos
- **Zod** para validación de esquemas

## Estructura de la Base de Datos

### Tabla: chapters
- `id` (UUID) - Identificador único
- `title` (TEXT) - Título del capítulo
- `description` (TEXT) - Descripción opcional
- `order` (TEXT) - Orden del capítulo

### Tabla: characters  
- `id` (UUID) - Identificador único
- `name` (TEXT) - Nombre del personaje
- `role` (TEXT) - Rol del personaje
- `order` (TEXT) - Orden del personaje

### Tabla: cards
- `id` (UUID) - Identificador único
- `character_id` (UUID) - Referencia al personaje
- `chapter_id` (UUID) - Referencia al capítulo
- `content` (TEXT) - Contenido de la tarjeta
- `tag` (TEXT) - Etiqueta de la tarjeta

## Resolución de Problemas

### Error de conexión a la base de datos
- Verifica que la variable `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté ejecutándose
- Ejecuta `npm run db:push` para crear las tablas

### Error al instalar dependencias
```bash
# Limpia la caché de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Puerto en uso
Si el puerto 5000 está ocupado, la aplicación usará automáticamente el siguiente puerto disponible.

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.