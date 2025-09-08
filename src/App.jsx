import React, { useState, useMemo, useEffect } from 'react';
import { initialPlayers, initialMatches } from './data.js';
import { calculateLeaderboard, parseAndValidateResult, getWinnerFromScore } from './logic.js';

// --- Iconos (Sin cambios) ---
const SearchIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <circle cx="11" cy="11" r="8" /> <path d="m21 21-4.3-4.3" /> </svg> );
const TrophyIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M8 21v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"/><path d="M12 11v-1a4 4 0 0 0-4-4H8"/><path d="M12 11v-1a4 4 0 0 1 4-4h0"/></svg> );
const ShieldXIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/></svg> );
const CloseIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> );
const TrashIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> );
const PlusCircleIcon = (props) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> );

// --- Componentes de la UI (Sin cambios) ---
const PlayerDetailModal = ({ player, allPlayers, allMatches, onClose, onDeleteMatch, onAddMatch }) => {
    const ADMIN_PASSWORD = 'admin';
    const [view, setView] = useState('details');
    const [targetMatch, setTargetMatch] = useState(null);
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [calculatedWinner, setCalculatedWinner] = useState(null);

    const playedMatches = allMatches.filter(m => m.player1Id === player.id || m.player2Id === player.id);
    const playedOpponentIds = new Set(playedMatches.map(m => m.player1Id === player.id ? m.player2Id : m.player1Id));
    const pendingOpponents = allPlayers.filter(p => p.id !== player.id && p.isActive && !playedOpponentIds.has(p.id));

    const getOpponent = (match) => { const opponentId = match.player1Id === player.id ? match.player2Id : match.player1Id; return allPlayers.find(p => p.id === opponentId); };
    const isWinner = (match) => { const winner = getWinnerFromScore(allPlayers.find(p => p.id === match.player1Id), allPlayers.find(p => p.id === match.player2Id), match.result); return winner.id === player.id; };
    
    const handleDeleteClick = (match) => { setTargetMatch(match); setView('deleting'); setPassword(''); setError(''); };
    const handleConfirmDelete = () => {
        if (password === ADMIN_PASSWORD) { onDeleteMatch(targetMatch.matchId); onClose(); } else { setError('Clave incorrecta.'); }
    };
    
    const handleLoadClick = (opponent) => { setTargetMatch({ player1: player, player2: opponent }); setView('loading'); setResult(''); setError(''); setCalculatedWinner(null); };
    const handleResultChange = (newResult) => {
        setResult(newResult);
        const normalized = parseAndValidateResult(newResult);
        if (normalized) {
            const winner = getWinnerFromScore(targetMatch.player1, targetMatch.player2, normalized);
            setCalculatedWinner(winner);
        } else {
            setCalculatedWinner(null);
        }
    };
    const handleConfirmLoad = () => {
        setError('');
        if (!calculatedWinner) { setError("Formato de resultado no válido."); return; }
        onAddMatch({ player1Id: targetMatch.player1.id, player2Id: targetMatch.player2.id, result: parseAndValidateResult(result) });
        onClose();
    };

    const renderContent = () => {
        switch(view) {
            case 'deleting': return ( <div className="p-6 text-center"><h3 className="text-lg font-semibold mb-4 text-gray-300">Eliminar Partido</h3><p className="mb-4">Para eliminar el partido contra <span className="font-bold">{getOpponent(targetMatch)?.name}</span>, ingresa la clave de administrador.</p><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Clave de admin" className="w-full bg-gray-700 border-gray-600 rounded-md p-2 mb-4" />{error && <p className="text-red-400 text-sm mb-4">{error}</p>}<div className="flex justify-center gap-4"><button onClick={() => setView('details')} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancelar</button><button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Confirmar</button></div></div> );
            case 'loading': return ( <div className="p-6"><h3 className="text-lg font-semibold mb-4 text-gray-300">Cargar Partido</h3><p className="mb-1">Jugador 1: <span className="font-bold">{targetMatch.player1.name}</span></p><p className="mb-4">Jugador 2: <span className="font-bold">{targetMatch.player2.name}</span></p><label htmlFor="modal-result" className="block text-sm font-medium text-gray-400 mb-1">Resultado (para Jugador 1)</label><input type="text" id="modal-result" value={result} onChange={e => handleResultChange(e.target.value)} placeholder="ej: 6-3, 6-4" className="w-full bg-gray-700 border-gray-600 rounded-md p-2 mb-2" /> {calculatedWinner && <p className="text-sm text-yellow-400 mb-4">Ganador calculado: <span className="font-bold">{calculatedWinner.name}</span>. ¿Es correcto?</p>} {error && <p className="text-red-400 text-sm mb-4">{error}</p>}<div className="flex justify-center gap-4"><button onClick={() => setView('details')} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">Cancelar</button><button onClick={handleConfirmLoad} disabled={!calculatedWinner} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed">Guardar</button></div></div> );
            default: return ( <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">Partidos Jugados ({playedMatches.length})</h3><ul className="space-y-3">{playedMatches.map(match => (<li key={match.matchId} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-md"><div><p className="font-medium">vs {getOpponent(match)?.name}</p><p className="text-sm text-gray-400">{match.result}</p></div><div className="flex items-center gap-2">{isWinner(match) ? (<div className="flex items-center space-x-2 text-green-400"><TrophyIcon className="w-5 h-5" /><span>V</span></div>) : (<div className="flex items-center space-x-2 text-red-400"><ShieldXIcon className="w-5 h-5" /><span>D</span></div>)}<button onClick={() => handleDeleteClick(match)} className="text-gray-400 hover:text-red-400 p-1 rounded-full"><TrashIcon className="w-5 h-5" /></button></div></li>))}</ul></div><div><h3 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-700 pb-2">Partidos Pendientes ({pendingOpponents.length})</h3><ul className="space-y-2">{pendingOpponents.map(opponent => (<li key={opponent.id}><button onClick={() => handleLoadClick(opponent)} className="w-full text-left flex items-center justify-between bg-gray-700/50 p-3 rounded-md hover:bg-gray-700"><span>{opponent.name}</span><PlusCircleIcon className="w-5 h-5 text-green-400" /></button></li>))}</ul></div></div> );
        }
    };
    return ( <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"><div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"><div className="p-6 sticky top-0 bg-gray-800 border-b border-gray-700"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-cyan-400">{player.name}</h2><button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button></div></div>{renderContent()}</div></div> );
};

const PlayerRow = ({ player, rank, onSelectPlayer }) => {
    const { name, pg, pj, pp, sg, sp, jg, jp, isActive } = player;
    const setRatio = (sg + sp) > 0 ? (sg / (sg + sp) * 100).toFixed(1) : '0.0'; 
    const gameRatio = (jg + jp) > 0 ? (jg / (jg + jp) * 100).toFixed(1) : '0.0';
    const rowClasses = isActive ? "border-b border-gray-700 hover:bg-gray-700 cursor-pointer" : "border-b border-red-900/50 bg-red-900/20 text-gray-500";
    
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
export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [matches, setMatches] = useState(() => { try { const savedMatches = localStorage.getItem('tournamentMatches'); return savedMatches ? JSON.parse(savedMatches) : initialMatches; } catch (error) { return initialMatches; } });
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        setLeaderboardData(calculateLeaderboard(initialPlayers, matches));
    }, [matches]);

    useEffect(() => { try { localStorage.setItem('tournamentMatches', JSON.stringify(matches)); } catch (error) { console.error("Error al guardar en localStorage", error); } }, [matches]);

    const handleAddMatch = (newMatchData) => { const newMatch = { ...newMatchData, matchId: Math.max(...matches.map(m => m.matchId), 0) + 1 }; setMatches(currentMatches => [...currentMatches, newMatch]); };
    const handleDeleteMatch = (matchIdToDelete) => { setMatches(currentMatches => currentMatches.filter(match => match.matchId !== matchIdToDelete)); };

    const filteredPlayers = useMemo(() => {
        if (!searchTerm) {
            return leaderboardData;
        }
        return leaderboardData.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, leaderboardData]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-cyan-400">Torneo LIGA CUBANITOS</h1>
                <p className="text-gray-400 text-2xl mt-2">Categoría B</p>
                </header>
                <p className="text-center text-gray-400 mb-8 -mt-2">Haz clic en un jugador para ver detalles y cargar partidos pendientes.</p>
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Buscar jugador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-700 text-xs uppercase tracking-wider">
                            <tr><th className="py-3 px-4 text-center">#</th><th className="py-3 px-4">Jugador</th><th className="py-3 px-4 text-center">Pts</th><th className="py-3 px-4 text-center">PJ</th><th className="py-3 px-4 text-center">PG</th><th className="py-3 px-4 text-center">PP</th><th className="py-3 px-4 text-center">SG</th><th className="py-3 px-4 text-center">SP</th><th className="py-3 px-4 text-center">% Set</th><th className="py-3 px-4 text-center">JG</th><th className="py-3 px-4 text-center">JP</th><th className="py-3 px-4 text-center">% Game</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredPlayers.map((player) => (
                                // --- ESTA ES LA LÍNEA CRÍTICA Y LA SOLUCIÓN FINAL ---
                                // Usamos 'player.rank' que ya viene PRE-CALCULADO desde 'logic.js'.
                                // Esto asegura que el número de ranking sea el de la tabla general,
                                // sin importar si la lista de jugadores está filtrada por la búsqueda.
                                // El error anterior ocurría al calcular el ranking aquí usando el 'index'.
                                <PlayerRow 
                                    key={player.id} 
                                    player={player} 
                                    rank={player.rank} 
                                    onSelectPlayer={setSelectedPlayer} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedPlayer && <PlayerDetailModal 
                player={selectedPlayer} 
                allPlayers={initialPlayers} 
                allMatches={matches} 
                onClose={() => setSelectedPlayer(null)}
                onDeleteMatch={handleDeleteMatch}
                onAddMatch={handleAddMatch}
             />}
        </div>
    );
}

