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