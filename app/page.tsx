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
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
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
        }
      }
    };
    return (
    <main className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Gestor de Tareas</h1>

      {/* 5. Sección superior: Cuadro interactivo de doble clic e input de creación */}
      <div className="mb-8">
        {!isCreating ? (
          <div
            onDoubleClick={() => setIsCreating(true)}
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50"
          >
            Doble clic aquí para agregar una nueva tarea
          </div>
        ) : (
          <input
            type="text"
            autoFocus
            placeholder="Escribe el nombre y presiona Enter..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsCreating(false)}
            className="border p-3 rounded-lg w-full text-black outline-none focus:border-blue-500 shadow-sm"
          />
        )}
      </div>

      {/* 6. Sección inferior: Renderizado dinámico de la lista de tareas */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">Tareas Agregadas</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay tareas creadas todavía.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <p className="font-medium text-black">{task.title}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}