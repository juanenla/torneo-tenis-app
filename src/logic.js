// LÓGICA DE CÁLCULO RECONSTRUIDA PARA MÁXIMA CLARIDAD
export function calculateLeaderboard(players, matches) {
    const playerStats = new Map();
    players.forEach(player => {
      playerStats.set(player.id, { ...player, pj: 0, pg: 0, pp: 0, sg: 0, sp: 0, jg: 0, jp: 0 });
    });
  
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
  
    // <-- CAMBIO CLAVE 1: SEPARAR JUGADORES ACTIVOS E INACTIVOS -->
    const activePlayers = allPlayersWithStats.filter(p => p.isActive);
    const inactivePlayers = allPlayersWithStats.filter(p => !p.isActive);
  
    // <-- CAMBIO CLAVE 2: ORDENAR SOLO A LOS JUGADORES ACTIVOS -->
    activePlayers.sort((a, b) => {
      if (a.pg !== b.pg) return b.pg - a.pg;
      const diffSetsA = a.sg - a.sp;
      const diffSetsB = b.sg - b.sp;
      if (diffSetsA !== diffSetsB) return diffSetsB - diffSetsA;
      const diffGamesA = a.jg - a.jp;
      const diffGamesB = b.jg - a.jp;
      if (diffGamesA !== diffGamesB) return diffGamesB - diffGamesA;
      return 0;
    });
  
    // <-- CAMBIO CLAVE 3: ASIGNAR RANKING NUMÉRICO A ACTIVOS Y 'INAC' A INACTIVOS -->
    const rankedActivePlayers = activePlayers.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    const rankedInactivePlayers = inactivePlayers.map(player => ({
        ...player,
        rank: 'INAC'
    }));
  
    // Devolvemos la lista final, con activos rankeados primero, seguidos por los inactivos.
    return [...rankedActivePlayers, ...rankedInactivePlayers];
  }
  
  // --- OTRAS FUNCIONES SIN CAMBIOS ---
  
  export function parseAndValidateResult(resultString) {
    let sets;
    if (resultString.includes(',')) {
        sets = resultString.split(',').map(s => s.trim());
    } else {
        sets = resultString.split(' ').map(s => s.trim()).filter(Boolean);
    }
  
    const validatedSets = [];
    for (const set of sets) {
        let games;
        let match = set.match(/^(\d{1,2})[\s/-](\d{1,2})$/);
        if (match) {
            games = [match[1], match[2]];
        } else {
            match = set.match(/^(\d)(\d)$/);
            if (match) {
                games = [match[1], match[2]];
            } else {
                return null;
            }
        }
        validatedSets.push(`${games[0]}-${games[1]}`);
    }
  
    if (validatedSets.length < 2 || validatedSets.length > 3) return null;
    return validatedSets.join(', ');
  }
  
  export function getWinnerFromScore(player1, player2, result) {
    let p1_sets_won = 0, p2_sets_won = 0;
    const sets = result.split(',').map(s => s.trim().split('-').map(Number));
    sets.forEach(([games1, games2]) => {
        if (games1 > games2) p1_sets_won++;
        else p2_sets_won++;
    });
    return p1_sets_won > p2_sets_won ? player1 : player2;
  }
  