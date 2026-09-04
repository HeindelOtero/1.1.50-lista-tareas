# ✅ Lista de Tareas — Next.js + MongoDB

## 🎯 Objetivo del proyecto

Construir el clásico **CRUD de tareas** como primera toma de contacto con el stack Next.js + MongoDB. Es el proyecto base sobre el que se apoyan los demás: si entiendes este, entiendes el patrón que repiten todos.

Con este proyecto el alumno aprende:

- Qué es el **App Router** de Next.js y cómo se organizan las páginas.
- Cómo crear un **API REST** con API Routes (`app/api/...`).
- Cómo conectar con **MongoDB usando el driver nativo** (sin Mongoose ni ORM).
- Cómo un componente React cliente consume la API con `fetch`.

## 🏗️ Arquitectura

```
┌──────────────────┐    fetch     ┌─────────────────────┐    driver    ┌──────────┐
│  TaskList.tsx    │ ───────────► │  /api/tasks         │ ───────────► │ MongoDB  │
│  (Client Comp.)  │              │  /api/tasks/[id]    │              │  local   │
└──────────────────┘              └─────────────────────┘              └──────────┘
```

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend | API Routes de Next.js |
| Base de datos | MongoDB (driver nativo) |

### Estructura de carpetas

```
app/
  page.tsx                      # Página principal
  components/TaskList.tsx       # Lista interactiva de tareas
  api/tasks/route.ts            # GET (listar) + POST (crear)
  api/tasks/[id]/route.ts       # PUT (actualizar) + DELETE (borrar)
lib/
  mongodb.ts                    # Conexión singleton a MongoDB
```

## ⚙️ Funcionalidades

- **Crear** una tarea con su título.
- **Listar** todas las tareas.
- **Marcar como completada** / editar una tarea.
- **Eliminar** una tarea.

## 💡 Solución

1. `lib/mongodb.ts` exporta una conexión **singleton**: en desarrollo Next.js recarga los módulos constantemente y sin este patrón se abrirían decenas de conexiones.
2. Las rutas API siguen la convención REST: la colección (`/api/tasks`) acepta `GET` y `POST`; el recurso individual (`/api/tasks/[id]`) acepta `PUT` y `DELETE`.
3. El componente `TaskList` es un **Client Component** (`'use client'`): mantiene el estado local de las tareas y llama a la API en cada operación, actualizando la UI con la respuesta.
4. Los `_id` de MongoDB son `ObjectId`: en la ruta `[id]` hay que convertir el string de la URL con `new ObjectId(id)`.

## 🚀 Cómo ejecutar

1. Arranca MongoDB en local (`mongodb://localhost:27017`).
2. Instala y ejecuta:

```bash
npm install
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000).

<!-- BEGIN cc:que-se-valora -->
¡Hola! Para que tengas claro qué busco cuando corrija tu proyecto "Lista Tareas", te he preparado esta sección. Así sabes dónde poner el foco.

## 📋 Qué se valora

Cuando revise tu proyecto, lo que más pesa es que la aplicación funcione correctamente y que cumpla con todo lo que se pide en el enunciado. También es muy importante que tu código esté bien estructurado y sea de calidad, y que el vídeo demo muestre bien todo lo que has hecho. Por último, aunque con un peso menor, me fijaré en la documentación que aportes y en las decisiones que hayas tomado durante el desarrollo.

Recuerda que el enunciado del proyecto es la guía principal, y la evaluación no penalizará nada que no se haya pedido explícitamente en él.
<!-- END cc:que-se-valora -->
