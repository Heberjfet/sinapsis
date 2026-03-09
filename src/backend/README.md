# Backend - Sinapsis API

## Estructura

```
src/backend/
├── prisma/
│   └── schema.prisma      # Schema de base de datos
├── src/
│   ├── index.ts           # Entry point
│   ├── mcp/
│   │   └── server.ts      # Servidor MCP para agentes
│   ├── routes/
│   │   ├── notes.ts       # API de notas
│   │   └── ai.ts          # API de IA
│   └── services/
│       └── ai.ts          # Servicio de IA
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Iniciar desarrollo

```bash
cd src/backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npm run db:generate

# Crear tablas en la base de datos
npm run db:push

# Iniciar servidor
npm run dev
```

El servidor estará en: `http://localhost:3001`

---

## Base de Datos

### PostgreSQL con Prisma ORM

Modelos definidos:
- **User** - Usuarios
- **Page** - Notas/páginas
- **Block** - Bloques de contenido
- **Subject** - Materias/temas
- **Flashcard** - Tarjetas de memoria
- **PomodoroSession** - Sesiones de estudio
- **Image** - Imágenes almacenadas

### Imágenes (Local)

Las imágenes se guardan localmente en `./uploads`. Para producción, usar Cloudflare R2 o S3.

---

## API Endpoints

### Notas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/pages | Listar todas las páginas |
| GET | /api/pages/:id | Obtener página por ID |
| POST | /api/pages | Crear página |
| PUT | /api/pages/:id | Actualizar página |
| DELETE | /api/pages/:id | Eliminar página |

### Bloques

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/pages/:id/blocks | Listar bloques |
| POST | /api/pages/:id/blocks | Crear bloque |
| PUT | /api/pages/:pageId/blocks/:blockId | Actualizar bloque |
| DELETE | /api/pages/:pageId/blocks/:blockId | Eliminar bloque |

### IA

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/ai/flashcards | Generar flashcards |
| POST | /api/ai/summary | Generar resumen |
| POST | /api/ai/quiz | Generar quiz |
| POST | /api/ai/study-plan | Generar plan de estudio |
| POST | /api/ai/explain | Explicar concepto |

---

## MCP Server (Model Context Protocol)

El servidor MCP permite que agentes AI (como Claude) interactúen con Sinapsis.

### Herramientas disponibles

```json
{
  "tools": [
    "create_note",        // Crear nota
    "create_flashcard",  // Crear flashcard
    "generate_flashcards", // Generar flashcards con IA
    "generate_summary",  // Generar resumen
    "generate_quiz",     // Generar quiz
    "get_notes",         // Obtener notas
    "get_flashcards"     // Obtener flashcards
  ]
}
```

### Conectar con Claude Desktop

1. Instalar Claude Desktop
2. Agregar en configuración:

```json
{
  "mcpServers": {
    "sinapsis": {
      "command": "npx",
      "args": ["tsx", "path/to/src/backend/src/mcp/server.ts"]
    }
  }
}
```

---

## Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sinapsis
PORT=3001
OPENAI_API_KEY=sk-...
JWT_SECRET=secret
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## Próximos pasos

- [x] API básica de notas
- [x] Schema de PostgreSQL
- [x] Servidor MCP
- [ ] Autenticación (JWT)
- [ ] Rutas de materias
- [ ] Rutas de flashcards
- [ ] Rutas de Pomodoro
- [ ] Subida de imágenes
- [ ] Integración con Ollama (IA local)
