import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTION, toTask, type TaskDoc } from "@/lib/tasks";

type Context = { params: Promise<{ id: string }> };

// El id llega como texto en la URL; MongoDB necesita un ObjectId.
function parseId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// PUT /api/tasks/:id -> actualiza título y/o estado completado
// Body: { "title"?: "...", "completed"?: true | false }
export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const _id = parseId(id);
  if (!_id) {
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const changes: Partial<TaskDoc> = {};

  if (typeof body?.title === "string") {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json(
        { error: "El título no puede estar vacío" },
        { status: 400 }
      );
    }
    changes.title = title;
  }
  if (typeof body?.completed === "boolean") {
    changes.completed = body.completed;
  }
  if (Object.keys(changes).length === 0) {
    return NextResponse.json(
      { error: "No hay nada que actualizar" },
      { status: 400 }
    );
  }

  const db = await getDb();
  const updated = await db
    .collection<TaskDoc>(COLLECTION)
    .findOneAndUpdate({ _id }, { $set: changes }, { returnDocument: "after" });

  if (!updated) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }
  return NextResponse.json(toTask(updated));
}

// DELETE /api/tasks/:id -> elimina la tarea
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const _id = parseId(id);
  if (!_id) {
    return NextResponse.json({ error: "Id no válido" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection<TaskDoc>(COLLECTION).deleteOne({ _id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
