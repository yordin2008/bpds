"use client";

import { useState, useEffect } from "react";


// 1. Estructura de datos para tipar las tareas con TypeScript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");

      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        setError("No se pudieron cargar las tareas");
      }
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      setError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) {
      alert("El título es obligatorio");
      return;
    }

    try {
      const task = tasks.find((task) => task.id === id);

      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle.trim(),
          description: editDescription,
          completed: task?.completed ?? false,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        await fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || "No se pudo actualizar la tarea");
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && title.trim() !== "") {
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: "",
          }),
        });

        if (res.ok) {
          setTitle("");
          setIsCreating(false);
          await fetchTasks();
        }
      } catch (error) {
        console.error("Error al guardar la tarea:", error);
        setError("No se pudo crear la tarea");
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });

      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error al cambiar el estado de la tarea:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tarea?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchTasks();
        alert("¡Tarea eliminada con éxito!");
      } else {
        const data = await res.json();
        alert(data.error || "No se pudo eliminar la tarea");
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      alert("Ocurrió un error al intentar eliminar la tarea.");
    }
  };

  if (loading) {
    return <p className="p-8">Cargando tareas...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">
        Gestor de Tareas
      </h1>

      <div className="mb-8">
        {!isCreating ? (
          <p
            onDoubleClick={() => setIsCreating(true)}
            className="text-gray-400 dark:text-gray-500 italic cursor-pointer select-none py-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Doble clic para añadir una nueva tarea (escribe y dale Enter)...
          </p>
        ) : (
          <input
            type="text"
            autoFocus
            placeholder="Escribe tu tarea para hacer y dale Enter..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsCreating(false)}
            className="border-b-2 border-blue-500 bg-transparent py-2 w-full text-black dark:text-white outline-none text-lg"
          />
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Tareas Agregadas
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No hay tareas creadas todavía.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
            >
              {editingId === task.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border rounded p-2 w-full text-black"
                    placeholder="Título de la tarea"
                  />

                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border rounded p-2 w-full text-black"
                    placeholder="Descripción"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(task.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Guardar
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-300 text-black rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`font-medium text-black dark:text-white ${
                        task.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex gap-2 flex-wrap justify-end">
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditTitle(task.title);
                          setEditDescription(task.description);
                        }}
                        className="px-3 py-1 bg-gray-200 text-black rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleToggleComplete(task)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        {task.completed
                          ? "Marcar pendiente"
                          : "Completar"}
                      </button>

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {task.description}
                  </p>

                  <p className="text-gray-600 dark:text-gray-400">
                    Estado:{" "}
                    {task.completed ? "Completada" : "Pendiente"}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
