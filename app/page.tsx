import TaskList from "./components/TaskList";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-12">
      <h1 className="text-3xl font-bold">✅ Lista de Tareas</h1>
      <p className="mb-8 mt-2 text-zinc-500">Next.js + MongoDB</p>
      <TaskList />
    </main>
  );
}
