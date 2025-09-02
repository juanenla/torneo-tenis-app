import React, { useState, useMemo, useEffect } from 'react';

// --- INICIO: Contenido de tournamentData.js ---
const initialPlayers = [
    { id: 1, name: 'Andres Ospitaletche', phone: '1127922371', isActive: true },
    { id: 2, name: 'Antonio Cuence', phone: '1158090551', isActive: false },
    { id: 3, name: 'Carlos Guendulain', phone: '1153396039', isActive: false },
    { id: 4, name: 'Fernando Manzini', phone: '1165967337', isActive: true },
    { id: 5, name: 'Guillermo Calandrino', phone: '1153172709', isActive: true },
    { id: 6, name: 'Guillermo Mackintosh', phone: '1144012971', isActive: false },
    { id: 7, name: 'Guillermo Paredes Castro', phone: '1144138291', isActive: false },
    { id: 8, name: 'Gustavo Guadagni', phone: '1141576415', isActive: false },
    { id: 9, name: 'Javier Binaghi', phone: '1158936409', isActive: true },
    { id: 10, name: 'Jorge Estebenet', phone: '1144177535', isActive: true },
    { id: 11, name: 'Jorge Hiriart', phone: '1144019070', isActive: false },
    { id: 12, name: 'José Pérez Romanelli', phone: '1154641101', isActive: true },
    { id: 13, name: 'Juan Chacur', phone: '1150132649', isActive: true },
    { id: 14, name: 'Juan Frenkel', phone: '1161111387', isActive: true },
    { id: 15, name: 'Juan Risso Patrón (Capitán)', phone: '1162855826', isActive: true },
    { id: 16, name: 'Kike Lippold', phone: '1161741245', isActive: true },
    { id: 17, name: 'Lucas Llach', phone: '1140959096', isActive: true },
    { id: 18, name: 'Martín Granillo Ocampo', phone: '1158165322', isActive: true },
];

const initialMatches = [
    { matchId: 1, player1Id: 18, player2Id: 15, result: "6-4, 6-3" },
    { matchId: 2, player1Id: 4, player2Id: 9, result: "4-6, 6-4, 7-6" },
    { matchId: 3, player1Id: 5, player2Id: 16, result: "6-0, 6-0" },
    { matchId: 4, player1Id: 12, player2Id: 1, result: "7-5, 6-4" },
    { matchId: 5, player1Id: 17, player2Id: 7, result: "7-5, 6-4" },
    { matchId: 6, player1Id: 18, player2Id: 12, result: "6-1, 6-3" },
    { matchId: 7, player1Id: 14, player2Id: 9, result: "6-2, 6-4" },
    { matchId: 8, player1Id: 15, player2Id: 10, result: "6-4, 2-6, 7-6" },
    { matchId: 9, player1Id: 12, player2Id: 9, result: "6-2, 6-0" },
    { matchId: 10, player1Id: 12, player2Id: 7, result: "6-2, 3-6, 7-6" },
    { matchId: 11, player1Id: 14, player2Id: 13, result: "6-1, 6-3" },
    { matchId: 12, player1Id: 2, player2Id: 13, result: "6-1, 6-1" },
    { matchId: 13, player1Id: 5, player2Id: 11, result: "6-1, 6-1" },
    { matchId: 14, player1Id: 15, player2Id: 13, result: "6-0, 6-0" },
    { matchId: 15, player1Id: 4, player2Id: 18, result: "6-4, 6-7, 7-6" },
    { matchId: 16, player1Id: 7, player2Id: 1, result: "6-3, 6-2" },
    { matchId: 17, player1Id: 4, player2Id: 5, result: "6-3, 6-1" },
    { matchId: 18, player1Id: 15, player2Id: 12, result: "7-5, 6-3" },
    { matchId: 19, player1Id: 5, player2Id: 17, result: "2-6, 6-0, 7-6" },
    { matchId: 20, player1Id: 9, player2Id: 10, result: "6-3, 3-6, 7-6" },
    { matchId: 21, player1Id: 15, player2Id: 5, result: "6-0, 6-3" },
    { matchId: 22, player1Id: 13, player2Id: 10, result: "6-0, 6-4" },
    { matchId: 23, player1Id: 5, player2Id: 10, result: "6-2, 6-7, 7-6" },
    { matchId: 24, player1Id: 14, player2Id: 4, result: "1-6, 6-3, 7-6" },
    { matchId: 25, player1Id: 13, player2Id: 9, result: "6-2, 7-6" },
    { matchId: 26, player1Id: 18, player2Id: 9, result: "6-7, 6-2, 7-6" },
    { matchId: 27, player1Id: 14, player2Id: 10, result: "1-6, 6-2, 7-6" },
    { matchId: 28, player1Id: 10, player2Id: 12, result: "2-6, 6-1, 7-6" },
    { matchId: 29, player1Id: 16, player2Id: 12, result: "6-4, 6-3" },
    { matchId: 30, player1Id: 13, player2Id: 1, result: "3-6, 6-1, 7-6" },
    { matchId: 31, player1Id: 15, player2Id: 11, result: "6-2, 6-1" },
    { matchId: 32, player1Id: 15, player2Id: 9, result: "6-0, 6-2" },
    { matchId: 33, player1Id: 10, player2Id: 16, result: "6-3, 6-1" },
    { matchId: 34, player1Id: 9, player2Id: 16, result: "6-4, 3-6, 7-6" },
    { matchId: 35, player1Id: 17, player2Id: 14, result: "6-4, 6-7, 7-6" },
    { matchId: 36, player1Id: 10, player2Id: 18, result: "6-2, 6-4" },
    { matchId: 37, player1Id: 18, player2Id: 16, result: "6-3, 6-2" },
];
// --- FIN: Contenido de tournamentData.js ---


// --- INICIO: Contenido de logic.js ---
function calculateLeaderboard(players, matches) {
  const playerStats = new Map();

  players.forEach(player => {
    playerStats.set(player.id, {
      ...player,
      pj: 0, pg: 0, pp: 0,
      sg: 0, sp: 0, jg: 0, jp: 0,
    });
  });

  matches.forEach(match => {
    const p1 = playerStats.get(match.player1Id);
    const p2 = playerStats.get(match.player2Id);

    if (!p1 || !p2) {
      console.error(`Jugador no encontrado para el partido con ID: ${match.matchId}`);
      return;
    }

    p1.pj += 1;
    p2.pj += 1;

    const sets = match.result.split(',').map(set => set.trim());
    let p1SetsWon = 0;
    let p2SetsWon = 0;
    let p1TotalGames = 0;
    let p2TotalGames = 0;

    sets.forEach(setScore => {
      const games = setScore.split('-').map(g => parseInt(g, 10));
      const p1Games = games[0];
      const p2Games = games[1];

      p1TotalGames += p1Games;
      p2TotalGames += p2Games;

      if (p1Games > p2Games) {
        p1SetsWon += 1;
      } else {
        p2SetsWon += 1;
      }
    });

    p1.sg += p1SetsWon;
    p1.sp += p2SetsWon;
    p1.jg += p1TotalGames;
    p1.jp += p2TotalGames;

    p2.sg += p2SetsWon;
    p2.sp += p1SetsWon;
    p2.jg += p2TotalGames;
    p2.jp += p1TotalGames;

    if (p1SetsWon > p2SetsWon) {
      p1.pg += 1;
      p2.pp += 1;
    } else {
      p2.pg += 1;
      p1.pp += 1;
    }
  });

  return Array.from(playerStats.values());
}
// --- FIN: Contenido de logic.js ---


// --- Iconos ---
const SearchIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="11" cy="11" r="8" /> <path d="m21 21-4.3-4.3" /> </svg> );
const TrophyIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M8 21v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/><path d="M12 11v-1a4 4 0 0 0-4-4H8"/><path d="M12 11v-1a4 4 0 0 1 4-4h0"/></svg> );
const ShieldXIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/></svg> );
const CloseIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> );

// --- Componente del Formulario para Añadir Partidos ---
const AddMatchForm = ({ players, onAddMatch }) => {
    const [player1Id, setPlayer1Id] = useState('');
    const [player2Id, setPlayer2Id] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const activePlayers = players.filter(p => p.isActive);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!player1Id || !player2Id || !result) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (player1Id === player2Id) {
            setError('Los jugadores deben ser diferentes.');
            return;
        }
        
        onAddMatch({
            player1Id: parseInt(player1Id),
            player2Id: parseInt(player2Id),
            result,
        });

        // Reset form
        setPlayer1Id('');
        setPlayer2Id('');
        setResult('');
        setError('');
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Cargar Nuevo Partido</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="player1" className="block text-sm font-medium text-gray-400 mb-1">Jugador 1</label>
                    <select id="player1" value={player1Id} onChange={e => setPlayer1Id(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                        <option value="">Seleccionar...</option>
                        {activePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="player2" className="block text-sm font-medium text-gray-400 mb-1">Jugador 2</label>
                    <select id="player2" value={player2Id} onChange={e => setPlayer2Id(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                        <option value="">Seleccionar...</option>
                        {activePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label htmlFor="result" className="block text-sm font-medium text-gray-400 mb-1">Resultado (ej: 6-3, 6-4)</label>
                    <input type="text" id="result" value={result} onChange={e => setResult(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div className="md:col-span-1">
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Guardar Partido</button>
                </div>
            </form>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
};


// --- Componente del Modal de Detalles del Jugador ---
const PlayerDetailModal = ({ player, allPlayers, allMatches, onClose }) => {
    // Calcular partidos jugados
    const playedMatches = allMatches.filter(m => m.player1Id === player.id || m.player2Id === player.id);

    // Calcular oponentes pendientes
    const playedOpponentIds = new Set(playedMatches.map(m => m.player1Id === player.id ? m.player2Id : m.player1Id));
    const pendingOpponents = allPlayers.filter(p =>
        p.id !== player.id && p.isActive && !playedOpponentIds.has(p.id)
    );

    const getOpponent = (match) => {
        const opponentId = match.player1Id === player.id ? match.player2Id : match.player1Id;
        return allPlayers.find(p => p.id === opponentId)?.name || 'N/A';
    };

    const isWinner = (match) => {
        const sets = match.result.split(',').map(s => s.trim().split('-').map(Number));
        let playerSets = 0;
        let opponentSets = 0;
        if (match.player1Id === player.id) {
            sets.forEach(([s1, s2]) => s1 > s2 ? playerSets++ : opponentSets++);
        } else {
            sets.forEach(([s1, s2]) => s2 > s1 ? playerSets++ : opponentSets++);
        }
        return playerSets > opponentSets;
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 sticky top-0 bg-gray-800 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-cyan-400">{player.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Partidos Jugados */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">Partidos Jugados ({playedMatches.length})</h3>
                        <ul className="space-y-3">
                            {playedMatches.map(match => (
                                <li key={match.matchId} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-md">
                                    <div>
                                        <p className="font-medium">vs {getOpponent(match)}</p>
                                        <p className="text-sm text-gray-400">{match.result}</p>
                                    </div>
                                    {isWinner(match) ? (
                                        <div className="flex items-center space-x-2 text-green-400">
                                            <TrophyIcon className="w-5 h-5" />
                                            <span>Victoria</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 text-red-400">
                                            <ShieldXIcon className="w-5 h-5" />
                                            <span>Derrota</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Partidos Pendientes */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">Partidos Pendientes ({pendingOpponents.length})</h3>
                        <ul className="space-y-2">
                           {pendingOpponents.map(opponent => (
                               <li key={opponent.id} className="bg-gray-700/50 p-3 rounded-md">
                                   {opponent.name}
                               </li>
                           ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Componente del Jugador (una fila de la tabla) ---
const PlayerRow = ({ player, rank, onSelectPlayer }) => {
  const { name, pg, pj, pp, sg, sp, jg, jp, isActive } = player;
  const setRatio = (sg + sp) > 0 ? (sg / (sg + sp) * 100).toFixed(1) : '0.0';
  const gameRatio = (jg + jp) > 0 ? (jg / (jg + jp) * 100).toFixed(1) : '0.0';

  const rowClasses = isActive
    ? "border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
    : "border-b border-red-900/50 bg-red-900/20 text-gray-500";

  return (
    <tr onClick={() => isActive && onSelectPlayer(player)} className={`${rowClasses} transition-colors duration-200`}>
      <td className="py-3 px-4 text-center font-semibold">{rank}</td>
      <td className="py-3 px-4 font-medium">{name}</td>
      <td className="py-3 px-4 text-center font-bold text-cyan-400">{pg}</td>
      <td className="py-3 px-4 text-center">{pj}</td>
      <td className="py-3 px-4 text-center text-green-400">{pg}</td>
      <td className="py-3 px-4 text-center text-red-400">{pp}</td>
      <td className="py-3 px-4 text-center">{sg}</td>
      <td className="py-3 px-4 text-center">{sp}</td>
      <td className="py-3 px-4 text-center">{setRatio}%</td>
      <td className="py-3 px-4 text-center">{jg}</td>
      <td className="py-3 px-4 text-center">{jp}</td>
      <td className="py-3 px-4 text-center">{gameRatio}%</td>
    </tr>
  );
};

// --- Componente Principal de la App ---
export default function LeaderboardComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // El estado ahora se inicializa leyendo del localStorage
  const [matches, setMatches] = useState(() => {
    try {
      const savedMatches = localStorage.getItem('tournamentMatches');
      return savedMatches ? JSON.parse(savedMatches) : initialMatches;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialMatches;
    }
  });

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Este useEffect recalcula la tabla cada vez que la lista de partidos cambia
  useEffect(() => {
    const calculatedData = calculateLeaderboard(initialPlayers, matches);
    setLeaderboardData(calculatedData);
  }, [matches]);

  // Este NUEVO useEffect guarda los partidos en localStorage cada vez que se actualizan
  useEffect(() => {
    try {
      localStorage.setItem('tournamentMatches', JSON.stringify(matches));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [matches]);


  const handleAddMatch = (newMatchData) => {
      const newMatch = {
          ...newMatchData,
          matchId: Math.max(...matches.map(m => m.matchId), 0) + 1,
      };
      setMatches(currentMatches => [...currentMatches, newMatch]);
  };

  const filteredPlayers = useMemo(() => {
    const activePlayers = leaderboardData.filter(p => p.isActive);
    const inactivePlayers = leaderboardData.filter(p => !p.isActive);
    
    const sortedActivePlayers = activePlayers.sort((a, b) => {
      if (b.pg !== a.pg) return b.pg - a.pg;
      const aSetRatio = (a.sg + a.sp) > 0 ? (a.sg / (a.sg + a.sp)) : 0;
      const bSetRatio = (b.sg + b.sp) > 0 ? (b.sg / (b.sg + b.sp)) : 0;
      if (bSetRatio !== aSetRatio) return bSetRatio - aSetRatio;
      const aGameRatio = (a.jg + a.jp) > 0 ? (a.jg / (a.jg + a.jp)) : 0;
      const bGameRatio = (b.jg + b.jp) > 0 ? (b.jg / (b.jg + b.jp)) : 0;
      return bGameRatio - aGameRatio;
    });
    
    const finalSortedList = [...sortedActivePlayers, ...inactivePlayers];

    if (!searchTerm) return finalSortedList;
    
    return finalSortedList.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, leaderboardData]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center tracking-tight text-cyan-400">Torneo Round Robin</h1>
          <p className="text-center text-gray-400 text-lg mt-2">Categoría B</p>
        </header>

        <AddMatchForm players={initialPlayers} onAddMatch={handleAddMatch} />

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-center">#</th>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4 text-center">Pts</th>
                <th className="py-3 px-4 text-center">PJ</th>
                <th className="py-3 px-4 text-center">PG</th>
                <th className="py-3 px-4 text-center">PP</th>
                <th className="py-3 px-4 text-center">SG</th>
                <th className="py-3 px-4 text-center">SP</th>
                <th className="py-3 px-4 text-center">% Set</th>
                <th className="py-3 px-4 text-center">JG</th>
                <th className="py-3 px-4 text-center">JP</th>
                <th className="py-3 px-4 text-center">% Game</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPlayers.map((player, index) => {
                const rank = player.isActive ? index + 1 : 'INAC';
                return (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    rank={rank} 
                    onSelectPlayer={setSelectedPlayer}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPlayer && (
        <PlayerDetailModal 
            player={selectedPlayer}
            allPlayers={initialPlayers}
            allMatches={matches}
            onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}

