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

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

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

1. **Fork** el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Buenas Prácticas
- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de nombres del proyecto
- Ejecuta `npm run lint` antes de commitear
- Agrega tipos para nuevas props y funciones

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
