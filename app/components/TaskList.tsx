"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Task } from "@/lib/tasks";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Al montar el componente, pedimos la lista a la API
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Task[]) => setTasks(data))
      .catch(() => setError("No se pudieron cargar las tareas. ¿Está MongoDB encendido?"))
      .finally(() => setLoading(false));
  }, []);

  // Llama a la API y devuelve el JSON, o lanza un error con el mensaje del servidor
  async function request<T>(url: string, init: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Error inesperado");
    return data;
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setNewTitle(""); // vaciamos el campo enseguida para poder escribir la siguiente
    try {
      const created = await request<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTasks((prev) => [created, ...prev]);
      setError(null);
    } catch (err) {
      setNewTitle(title); // si falla, devolvemos el texto para no perderlo
      setError((err as Error).message);
    }
  }

  async function updateTask(id: string, changes: Partial<Pick<Task, "title" | "completed">>) {
    try {
      const updated = await request<Task>(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function deleteTask(id: string) {
    try {
      await request(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function startEdit(task: Task) {
    setEditingId(task._id);
    setEditTitle(task.title);
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    await updateTask(editingId, { title: editTitle });
    setEditingId(null);
  }

  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <div className="w-full">
      <form onSubmit={addTask} className="flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="¿Qué tienes que hacer?"
          aria-label="Nueva tarea"
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Añadir
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-zinc-500">Cargando…</p>
      ) : tasks.length === 0 ? (
        <p className="mt-6 text-zinc-500">No hay tareas todavía. ¡Añade la primera!</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-zinc-500">
            {pending} pendiente{pending === 1 ? "" : "s"} de {tasks.length}
          </p>
          <ul className="mt-2 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {tasks.map((task) => (
              <li key={task._id} className="flex items-center gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task._id, { completed: !task.completed })}
                  aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
                  className="h-5 w-5 accent-blue-600"
                />

                {editingId === task._id ? (
                  <form onSubmit={saveEdit} className="flex flex-1 gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      aria-label="Editar título"
                      autoFocus
                      className="flex-1 rounded border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                    <button type="submit" className="text-sm font-medium text-blue-600">
                      Guardar
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-sm text-zinc-500">
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <span className={`flex-1 ${task.completed ? "text-zinc-400 line-through" : ""}`}>
                      {task.title}
                    </span>
                    <button onClick={() => startEdit(task)} className="text-sm text-zinc-500 hover:text-blue-600">
                      Editar
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="text-sm text-zinc-500 hover:text-red-600">
                      Eliminar
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
