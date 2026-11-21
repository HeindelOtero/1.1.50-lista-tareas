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

1. Arranca MongoDB en local (`mongodb://localhost:27017`). Si no lo tienes instalado, lo más rápido es con Docker:

   ```bash
   docker run -d --name mongo -p 27017:27017 mongo:7
   ```

   (No es obligatorio usar Docker: vale cualquier MongoDB accesible en ese puerto.)
2. Instala y ejecuta:

```bash
npm install
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000).

## 📝 Notas de la entrega

### Configuración

Copia `.env.example` como `.env.local`. Por defecto usa `mongodb://localhost:27017` y la base de datos `lista-tareas`. Si no existe `.env.local`, la app usa esos mismos valores.

### API

| Método | Ruta | Qué hace | Respuestas |
|--------|------|----------|------------|
| `GET` | `/api/tasks` | Lista las tareas (más nuevas primero) | `200` |
| `POST` | `/api/tasks` | Crea una tarea. Body: `{ "title": "..." }` | `201`, `400` si el título está vacío |
| `PUT` | `/api/tasks/[id]` | Actualiza `title` y/o `completed` | `200`, `400` si el id o los datos no son válidos, `404` si no existe |
| `DELETE` | `/api/tasks/[id]` | Elimina la tarea | `200`, `400` id no válido, `404` si no existe |

### Decisiones

- **`lib/tasks.ts`** centraliza los tipos: `TaskDoc` (cómo se guarda en MongoDB) y `Task` (cómo viaja al navegador, con el `_id` como texto). Así el cliente y la API comparten el mismo tipo.
- **Validación en el servidor**: el título se recorta (`trim`) y no puede quedar vacío; los ids se comprueban con `ObjectId.isValid` antes de convertirlos, para devolver `400` en lugar de un error 500.
- **Next.js 16**: en las rutas dinámicas `params` es una `Promise`, por eso se hace `await params`.
- **Interfaz**: el campo de nueva tarea se vacía en cuanto se envía (si falla, se recupera el texto); la edición se hace en la misma fila; los errores de la API se muestran en un aviso.

<!-- BEGIN cc:que-se-valora -->
¡Hola! Aquí te explico qué es lo que miraremos con lupa cuando corrijamos tu proyecto "Lista Tareas".

## 📋 Qué se valora

Nos fijaremos muchísimo en que tu aplicación funcione correctamente y cumpla con todo lo que se pide en el enunciado, esto es, sin duda, lo que más pesa en la evaluación. También es muy importante que tu código esté bien escrito, sea fácil de entender y que la estructura general de tu proyecto tenga sentido. Le daremos un peso importante a la demo en vídeo que nos envíes, ya que nos ayuda a ver tu proyecto en acción. Por último, aunque con un peso menor, valoraremos cómo has documentado tu trabajo y las decisiones que has tomado durante el desarrollo.

Recuerda que el enunciado del proyecto es la guía principal, y la evaluación no penalizará por cosas que no se pidan explícitamente en él.
<!-- END cc:que-se-valora -->
