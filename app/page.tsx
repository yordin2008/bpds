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
  const handleDelete = () => {
    
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");
    
    if (confirmed) {
      try {
        
        alert("¡Elemento eliminado con éxito! (Persona 4)");
      } catch (error) {
        
        alert("Ocurrió un error al intentar eliminar el elemento.");
        console.error(error);
      }
    } else {
      console.log("Acción de eliminación cancelada.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4"> boton Eliminar</h1>
      <p className="mb-6 text-gray-400">Funcionalidad de eliminación con confirmación y manejo de errores.</p>
      
      <button 
        onClick={handleDelete}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
      >
        Eliminar Elemento
      </button>
    </main>
  );
}