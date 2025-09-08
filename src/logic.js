// logic.js
export function calculateLeaderboard(players, matches) {
    const playerStats = new Map();
    players.forEach(player => {
      // Inicializa las estadísticas de cada jugador
      playerStats.set(player.id, { ...player, pj: 0, pg: 0, pp: 0, sg: 0, sp: 0, jg: 0, jp: 0 });
    });
  
    // Itera sobre los partidos para calcular las estadísticas
    matches.forEach(match => {
      const statsP1 = playerStats.get(match.player1Id);
      const statsP2 = playerStats.get(match.player2Id);
      if (!statsP1 || !statsP2) return;
  
      let p1_sets_won = 0, p2_sets_won = 0, p1_games_won = 0, p2_games_won = 0;
      
      const sets = match.result.split(',').map(s => s.trim().split('-').map(Number));
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
  
    // ORDENAMIENTO CORREGIDO FINAL
    activePlayers.sort((a, b) => {
      // 1. Criterio principal: Partidos ganados (PG)
      if (a.pg !== b.pg) return b.pg - a.pg;

      // 2. Desempate por Porcentaje de sets ganados
      const setRatioA = (a.sg + a.sp > 0) ? a.sg / (a.sg + a.sp) : 0;
      const setRatioB = (b.sg + b.sp > 0) ? b.sg / (b.sg + b.sp) : 0; // CORREGIDO
      if (setRatioA !== setRatioB) return setRatioB - setRatioA;

      // 3. Desempate por Porcentaje de games ganados
      const gameRatioA = (a.jg + a.jp > 0) ? a.jg / (a.jg + a.jp) : 0;
      const gameRatioB = (b.jg + b.jp > 0) ? b.jg / (b.jg + b.jp) : 0; // CORREGIDO
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