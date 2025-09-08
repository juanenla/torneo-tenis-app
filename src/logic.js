// src/logic.js

// --- TU FUNCIÓN DE VALIDACIÓN AVANZADA (INTEGRADA) ---
// Valida múltiples formatos de resultado (6-3, 6/3, 63) y lo normaliza.
export function parseAndValidateResult(resultString) {
    if (!resultString || typeof resultString !== 'string' || resultString.trim() === '') {
      return null;
    }
  
    let sets;
    // Soporta resultados separados por coma o por espacio
    if (resultString.includes(',')) {
      sets = resultString.split(',').map(s => s.trim());
    } else {
      sets = resultString.split(' ').map(s => s.trim()).filter(Boolean);
    }
  
    const validatedSets = [];
    for (const set of sets) {
      let games;
      // Busca formatos como "6-3", "6/3" o "6 3"
      let match = set.match(/^(\d{1,2})[\s/-](\d{1,2})$/);
      if (match) {
        games = [match[1], match[2]];
      } else {
        // Busca formatos como "63"
        match = set.match(/^(\d)(\d)$/);
        if (match) {
          games = [match[1], match[2]];
        } else {
          return null; // Formato de set inválido
        }
      }
      validatedSets.push(`${games[0]}-${games[1]}`);
    }
  
    // Un partido debe tener 2 o 3 sets
    if (validatedSets.length < 2 || validatedSets.length > 3) return null;
    
    // Devuelve el resultado normalizado, ej: "6-3, 6-4"
    return validatedSets.join(', ');
  }
  
  
  // --- TU FUNCIÓN PARA OBTENER EL GANADOR (EXPORTADA COMO UTILIDAD) ---
  // Esta función te puede servir en otras partes de tu aplicación.
  export function getWinnerFromScore(player1, player2, result) {
    let p1_sets_won = 0, p2_sets_won = 0;
    const sets = result.split(',').map(s => s.trim().split('-').map(Number));
    
    sets.forEach(([games1, games2]) => {
      if (games1 > games2) p1_sets_won++;
      else p2_sets_won++;
    });
  
    return p1_sets_won > p2_sets_won ? player1 : player2;
  }
  
  
  // --- FUNCIÓN PRINCIPAL DEL RANKING (ACTUALIZADA PARA USAR TU VALIDACIÓN) ---
  export function calculateLeaderboard(players, matches) {
      const playerStats = new Map();
      players.forEach(player => {
        playerStats.set(player.id, { ...player, pj: 0, pg: 0, pp: 0, sg: 0, sp: 0, jg: 0, jp: 0 });
      });
    
      matches.forEach(match => {
        const statsP1 = playerStats.get(match.player1Id);
        const statsP2 = playerStats.get(match.player2Id);
        if (!statsP1 || !statsP2) return;
  
        // 1. Validar y normalizar el resultado del partido USANDO TU FUNCIÓN
        const normalizedResult = parseAndValidateResult(match.result);
        
        // Si el resultado es inválido, no procesamos este partido
        if (!normalizedResult) {
          return; 
        }
  
        let p1_sets_won = 0, p2_sets_won = 0, p1_games_won = 0, p2_games_won = 0;
        
        const sets = normalizedResult.split(',').map(s => s.trim().split('-').map(Number));
        
        sets.forEach(([games1, games2]) => {
            p1_games_won += games1;
            p2_games_won += games2;
            if (games1 > games2) p1_sets_won++;
            else p2_sets_won++;
        });
        
        statsP1.pj++; statsP2.pj++;
        statsP1.sg += p1_sets_won; statsP1.sp += p2_sets_won;
        statsP1.jg += p1_games_won; statsP1.jp += p2_games_won;
        statsP2.sg += p2_sets_won; statsP2.sp += p1_sets_won;
        statsP2.jg += p2_games_won; statsP2.jp += p1_games_won;
        
        if (p1_sets_won > p2_sets_won) {
            statsP1.pg++;
            statsP2.pp++;
        } else {
            statsP2.pg++;
            statsP1.pp++;
        }
      });
    
      const allPlayersWithStats = Array.from(playerStats.values());
      const activePlayers = allPlayersWithStats.filter(p => p.isActive);
      const inactivePlayers = allPlayersWithStats.filter(p => !p.isActive);
    
      // 2. Ordenar el ranking con la lógica que ya corregimos
      activePlayers.sort((a, b) => {
        if (a.pg !== b.pg) return b.pg - a.pg;
        const setRatioA = (a.sg + a.sp > 0) ? a.sg / (a.sg + a.sp) : 0;
        const setRatioB = (b.sg + b.sp > 0) ? b.sg / (b.sg + b.sp) : 0;
        if (setRatioA !== setRatioB) return setRatioB - setRatioA;
        const gameRatioA = (a.jg + a.jp > 0) ? a.jg / (a.jg + a.jp) : 0;
        const gameRatioB = (b.jg + b.jp > 0) ? b.jg / (b.jg + b.jp) : 0;
        if (gameRatioA !== gameRatioB) return gameRatioB - gameRatioA;
        return 0;
      });
    
      const rankedActivePlayers = activePlayers.map((player, index) => ({
        ...player,
        rank: index + 1
      }));
      const rankedInactivePlayers = inactivePlayers.map(player => ({
          ...player,
          rank: 'INAC'
      }));
    
      return [...rankedActivePlayers, ...rankedInactivePlayers];
  }