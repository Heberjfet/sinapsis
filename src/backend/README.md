# Backend - Sinapsis API

## Estructura

```
src/backend/
├── src/
│   ├── index.ts          # Entry point
│   └── routes/
│       └── notes.ts      # Routes de notas
├── package.json
└── tsconfig.json
```

## Iniciar desarrollo

```bash
cd src/backend
npm install
npm run dev
```

El servidor estará en: `http://localhost:3001`

## Endpoints

### Health Check
```
GET /api/health
```

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
| GET | /api/pages/:id/blocks | Listar bloques de página |
| POST | /api/pages/:id/blocks | Crear bloque |
| PUT | /api/pages/:pageId/blocks/:blockId | Actualizar bloque |
| DELETE | /api/pages/:pageId/blocks/:blockId | Eliminar bloque |

## Próximos pasos

- [ ] Autenticación (JWT)
- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Flashcards API
- [ ] Pomodoro API
- [ ] Búsqueda semántica
