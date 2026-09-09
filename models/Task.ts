import fs from 'fs';
import path from 'path';
//Importé fs (File System) para leer y escribir archivos en el sistema de archivos, y path para manejar rutas de archivos y directorios.



//LA INTERFACE TASK
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
// Definí una interfaz Task que describe la estructura de un objeto de tarea con sus propiedades.


//DIRECTORIO DE DATOS
const dbPath = path.join(process.cwd(), 'data', 'tasks.json');
// Definí la ruta del archivo tasks.json donde se almacenarán las tareas. dbPath guarda la dirección exacta de nuestro archivero.



//FUNCIONES PARA LAS TAREAS

getAll: (): Task[] => {
    if (!fs.existsSync(dbPath)) return []; 
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  },

