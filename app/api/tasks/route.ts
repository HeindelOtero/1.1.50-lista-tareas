import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTION, toTask, type TaskDoc } from "@/lib/tasks";

// GET /api/tasks -> lista todas las tareas (las más nuevas primero)
export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection<TaskDoc>(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(docs.map(toTask));
}

// POST /api/tasks -> crea una tarea nueva. Body: { "title": "..." }
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json(
      { error: "El título es obligatorio" },
      { status: 400 }
    );
  }

  const doc: TaskDoc = { title, completed: false, createdAt: new Date() };
  const db = await getDb();
  const result = await db.collection<TaskDoc>(COLLECTION).insertOne(doc);

  return NextResponse.json(toTask({ _id: result.insertedId, ...doc }), {
    status: 201,
  });
}
