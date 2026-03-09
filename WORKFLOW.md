# Guía de Workflow - Proyecto Sinapsis

## Estructura de Ramas

```
main          ← Producción (código funcional, no tocar)
develop       ← Rama de integración (no trabajar directamente)
├── feature/frontend-*   ← Tú: Frontend
└── feature/backend-*    ← Tu amigo: Backend
```

---

## Flujo de Trabajo

### 1. Antes de empezar (diariamente)

```bash
# Ir a develop y actualizar
git checkout develop
git pull origin develop
```

### 2. Crear tu rama feature

**Si eres Frontend:**
```bash
git checkout -b feature/frontend-nombre-descriptivo develop
```

**Si eres Backend:**
```bash
git checkout -b feature/backend-nombre-descriptivo develop
```

### 3. Trabajar en tu feature

```bash
# Hacer cambios...
git add .
git commit -m "feat: descripción del cambio"

# Subir cambios
git push origin feature/frontend-tu-feature
```

### 4. Crear Pull Request

1. Ir a GitHub
2. Crear PR desde tu rama → `develop`
3. Solicitar review al otro desarrollador
4. Mergear después de aprobado

### 5. Después de merge

```bash
# Volver a develop y actualizar
git checkout develop
git pull origin develop
```

---

## Reglas Importantes

| HACER | NO HACER |
|-------|----------|
| Crear rama desde develop | Trabajar directamente en develop |
| PR hacia develop | PR directamente a main |
| Commits claros | Commits sin mensaje |
| Probar antes de pushear | Subir código roto |

---

## Convenciones de Commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
refactor: Refactorización
docs:     Documentación
style:    Estilos (CSS/Tailwind)
chore:    Tareas menores
```

Ejemplo: `git commit -m "feat: agregar modal de创建 tema para flashcards"`

---

## Ejemplo Completo (Backend)

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear rama para tu feature
git checkout -b feature/backend-api-auth develop

# 3. Trabajar y hacer commits
git add .
git commit -m "feat: agregar endpoint de login"

# 4. Subir a GitHub
git push origin feature/backend-api-auth

# 5. Crear Pull Request en GitHub hacia develop

# 6. Después de merge
git checkout develop
git pull origin develop
```

---

## Comandos Útiles

```bash
# Ver ramas
git branch -a

# Ver estado
git status

# Ver cambios
git diff

# Cambiar de rama
git checkout nombre-rama

# Eliminar rama local
git branch -d nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama
```

---

## Dudas?

Consultar con el equipo o revisar README.md del proyecto.
