import type { ObjectId, WithId } from "mongodb";

// Cómo se guarda una tarea en MongoDB
export interface TaskDoc {
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Cómo se envía una tarea al navegador (el _id como texto)
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const COLLECTION = "tasks";

export function toTask(doc: WithId<TaskDoc>): Task {
  return {
    _id: (doc._id as ObjectId).toString(),
    title: doc.title,
    completed: doc.completed,
    createdAt: doc.createdAt.toISOString(),
  };
}
