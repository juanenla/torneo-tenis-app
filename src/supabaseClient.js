// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Primero, decidimos cuál es nuestro objeto de variables de entorno
// Si import.meta.env existe (estamos en Vite), lo usamos.
// Si no, usamos process.env (estamos en Node.js).
const env = import.meta.env || process.env;

// Ahora leemos las variables desde el objeto 'env' que corresponda
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Añadimos una verificación para dar un error más claro si las claves no se encuentran
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Claves de Supabase no encontradas. Asegúrate de que tu archivo .env.local esté configurado.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);