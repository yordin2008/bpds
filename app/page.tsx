'use client';
import { useState, useEffect } from 'react';

// 1. Estructura de datos para tipar las tareas con TypeScript
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
export default function Home() {
  // 2. Definición de estados locales de la interfaz
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [isCreating, setIsCreating] = useState(false); 
  const [title, setTitle] = useState(''); 
  const [loading, setLoading]= useState(true);
  const [error, setError] = useState("");
  // 3. Sincronización inicial al montar el componente en el navegador
  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para consultar las tareas existentes mediante GET a la API
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        setLoading(false);
      } else {
        setError('No se pudieron cargar las tareas');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setError('No se pudieron cargar las tareas');
      setLoading(false);
    }
  };
  // 4. Lógica para detectar la tecla Enter y enviar los datos al servidor (POST)
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && title.trim() !== '') {
        try {
          const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description: '' }),
          });

          if (res.ok) {
            setTitle('');
            setIsCreating(false);
            fetchTasks(); // Actualiza automáticamente el listado inferior
          }
        } catch (error) {
          console.error('Error al guardar la tarea:', error);
          setError('No se pudieron cargar las tareas');
          setLoading(false);
        }
      }
    };

    if (loading) {
      return <p>Cargando tareas...</p>;
    }
    if (error) {
      return <p>{error}</p>;
    }

    return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Gestor de Tareas</h1>

      {/* 5. Sección superior: Texto opaco interactivo por doble clic */}
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

      {/* 6. Sección inferior: Renderizado dinámico de la lista de tareas */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tareas Agregadas</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">No hay tareas creadas todavía.</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className="border border-gray-200 dark:border-zinc-800 p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
            >
              <p className="font-medium text-black dark:text-white">{task.title}</p>
              <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
              <p className="text-gray-600 dark:text-gray-400">
                Estado: {task.completed ? "Completada" : "Pendiente"}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}