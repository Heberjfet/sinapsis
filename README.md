# Sinapsis - Plataforma Inteligente de Estudio

<p align="center">
  <img src="https://via.placeholder.com/150" alt="Sinapsis Logo" />
</p>

**Sinapsis** es una plataforma digital tipo Notion enfocada en el aprendizaje activo. Integra edición avanzada de notas, inteligencia artificial aplicada al estudio, búsqueda semántica y herramientas de concentración.

---

## 🚀 Características Principales

- **Editor de Notas Modular** - Notas organizadas por bloques (texto, código, tablas, kanban, checklists)
- **IA Integrada** - Generación de resúmenes, preguntas de examen, flashcards y explicaciones
- **Búsqueda Semántica** - Busca en tu contenido como Google pero sobre tus propias notas
- **Sistema Pomodoro** - Temporizador inteligente con estadísticas de estudio
- **Integraciones** - Spotify, YouTube Music, Google Calendar

---

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS
- Zustand (state management)
- Radix UI (componentes)
- React Router DOM

### Herramientas de Desarrollo
- ESLint + TypeScript
- PostCSS
- Playwright (testing)

---

## 📋 Requisitos Previos

```bash
- Node.js 18+
- npm 9+
```

---

## 🏃‍♂️ Inicio Rápido

### Solo Frontend (modo local)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Frontend + Backend (completo)

```bash
# 1. Base de datos PostgreSQL
# Instalar PostgreSQL y crear base de datos:
createdb sinapsis

# 2. Backend
cd src/backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run db:generate
npm run db:push
npm run dev

# 3. Frontend (en otra terminal)
cd ../..
npm install
npm run dev
```

---

### Comandos Adicionales

```bash
# Build para producción
npm run build

# Ejecutar linter
npm run lint

# Vista previa de producción
npm run preview
```

---

## 📁 Estructura del Proyecto

```
sinapsis/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/         # Vistas/Rutas de la app
│   ├── stores/        # Zustand stores (estado global)
│   ├── lib/           # Utilidades y helpers
│   ├── types/         # Definiciones de TypeScript
│   └── App.tsx        # Componente principal
├── public/            # Recursos estáticos
├── sinapsis.md        # Documentación completa del proyecto
└── package.json       # Dependencias
```

---

## 🎯 Roadmap

### Fase 1 (MVP)
- [x] Editor de notas por bloques
- [ ] Sistema de autenticación
- [ ] Búsqueda semántica
- [ ] Sistema Pomodoro

### Fase 2
- [ ] Integración con IA (LLM)
- [ ] Integración con Spotify/YouTube Music
- [ ] Analíticas y métricas de estudio
- [ ] Backend con NestJS

### Fase 3
- [ ] App móvil
- [ ] API pública
- [ ] Colaboración en tiempo real

---

## 🤝 Cómo Contribuir

### Workflow Git (2 Desarrolladores)

```
main          ← Producción (código functional)
develop       ← Desarrollo integrado
├── feature/frontend-*   (Desarrollador Frontend)
└── feature/backend-*    (Desarrollador Backend)
```

#### Reglas de Ramas

| Tipo | Desde | Hacia | Ejemplo |
|------|-------|-------|---------|
| Feature Frontend | develop | develop | `feature/frontend-sidebar` |
| Feature Backend | develop | develop | `feature/backend-api-auth` |
| Bugfix | develop | develop | `fix/flashcard-bug` |
| Hotfix | main | main + develop | `hotfix/security-patch` |

#### Flujo de Trabajo

```bash
# 1. Antes de trabajar: crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/frontend-nombre

# 2. Trabaja en tu rama y haz commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Push y crea PR
git push origin feature/frontend-nombre
# Crear Pull Request en GitHub → develop

# 4. Después de merge, actualiza tu develop local
git checkout develop
git pull origin develop
```

#### Convenciones de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
refactor: Refactorización
docs:     Documentación
style:    Estilos (CSS/Tailwind)
chore:    Tareas menores
```

---

### Buenas Prácticas
- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de nombres del proyecto
- Ejecuta `npm run lint` antes de commitear
- Agrega tipos para nuevas props y funciones
- Crea PRs hacia `develop`, NO directamente a `main`

---

## 📚 Documentación Adicional

- [Documentación completa del proyecto](./sinapsis.md)
- [Wiki](https://github.com/tu-repo/sinapsis/wiki)
- [Issues](https://github.com/tu-repo/sinapsis/issues)

---

## 📄 Licencia

MIT License - feel free to use this project for learning and development.

---

## 🔗 Enlaces Útiles

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Radix UI](https://www.radix-ui.com/)
