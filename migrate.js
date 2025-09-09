

import { supabase } from './src/supabaseClient.js';
// Importa tus datos actuales desde donde los tengas
import { initialPlayers as localPlayers, initialMatches as localMatches } from './src/data.js';

export const migrateDataToSupabase = async () => {
  console.log("Iniciando migración...");

  // 1. Subir jugadores
  const { error: playersError } = await supabase.from('players').insert(localPlayers);
  if (playersError) {
    console.error("Error subiendo jugadores:", playersError);
    return;
  }
  console.log("Jugadores subidos con éxito.");

  // 2. Preparar y subir partidos existentes como 'approved'
  const matchesToUpload = localMatches.map(match => ({
    player1_id: match.player1Id,
    player2_id: match.player2Id,
    result: match.result,
    status: 'approved' // ¡Clave! Los partidos viejos ya están aprobados.
  }));

  const { error: matchesError } = await supabase.from('matches').insert(matchesToUpload);
  if (matchesError) {
    console.error("Error subiendo partidos:", matchesError);
    return;
  }
  console.log("Partidos existentes subidos con éxito. Migración completa.");
};
migrateDataToSupabase();