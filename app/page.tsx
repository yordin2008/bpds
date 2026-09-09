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