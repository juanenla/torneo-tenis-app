import React, { useState, useMemo, useEffect } from 'react';
// --- CAMBIO 1: Importamos Supabase y ya no los datos iniciales de data.js ---
import { supabase } from './supabaseClient.js'; 
import { calculateLeaderboard, parseAndValidateResult, getWinnerFromScore } from './logic.js';

// --- Iconos y otros componentes (sin cambios) ---
// ... (El código de los iconos, PlayerRow, etc., se mantiene exactamente igual) ...

// --- Componente PlayerDetailModal (con un pequeño ajuste) ---
const PlayerDetailModal = ({ player, allPlayers, allMatches, onClose, onDeleteMatch, onAddMatch }) => {
    const ADMIN_PASSWORD = 'admin';
    const [view, setView] = useState('details');
    const [targetMatch, setTargetMatch] = useState(null);
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [calculatedWinner, setCalculatedWinner] = useState(null);

    const playedMatches = allMatches.filter(m => m.player1_id === player.id || m.player2_id === player.id);
    const playedOpponentIds = new Set(playedMatches.map(m => m.player1_id === player.id ? m.player2_id : m.player1_id));
    const pendingOpponents = allPlayers.filter(p => p.id !== player.id && p.isActive && !playedOpponentIds.has(p.id));

    const getOpponent = (match) => { const opponentId = match.player1_id === player.id ? match.player2_id : player.id; return allPlayers.find(p => p.id === opponentId); };
    const isWinner = (match) => { const winner = getWinnerFromScore(allPlayers.find(p => p.id === match.player1_id), allPlayers.find(p => p.id === match.player2_id), match.result); return winner.id === player.id; };
    
    const handleDeleteClick = (match) => { setTargetMatch(match); setView('deleting'); setPassword(''); setError(''); };
    const handleConfirmDelete = () => { if (password === ADMIN_PASSWORD) { onDeleteMatch(targetMatch.id); onClose(); } else { setError('Clave incorrecta.'); } };
    
    const handleLoadClick = (opponent) => { setTargetMatch({ player1: player, player2: opponent }); setView('loading'); setResult(''); setError(''); setCalculatedWinner(null); };
    const handleResultChange = (newResult) => {
        setResult(newResult);
        const normalized = parseAndValidateResult(newResult);
        if (normalized) { const winner = getWinnerFromScore(targetMatch.player1, targetMatch.player2, normalized); setCalculatedWinner(winner); } 
        else { setCalculatedWinner(null); }
    };

    // --- CAMBIO 2: Hacemos onAddMatch asíncrono para esperar a Supabase ---
    const handleConfirmLoad = async () => { 
        setError('');
        if (!calculatedWinner) { setError("Formato de resultado no válido."); return; }
        await onAddMatch({ player1_id: targetMatch.player1.id, player2_id: targetMatch.player2.id, result: parseAndValidateResult(result) });
        onClose();
    };

    // ... (el resto del JSX del modal se mantiene igual)
};

// --- Componente Principal de la App ---
export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    // --- CAMBIO 3: Estados inicializados en vacío. Se llenarán desde Supabase ---
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [pendingMatches, setPendingMatches] = useState([]); // ¡Nuevo estado!
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // --- CAMBIO 4: useEffect para cargar los datos desde Supabase al iniciar ---
    useEffect(() => {
        const fetchInitialData = async () => {
            console.log("Buscando datos iniciales de Supabase...");
            // 1. Obtener todos los jugadores
            const { data: playersData, error: playersError } = await supabase.from('players').select('*');
            if (playersError) console.error('Error fetching players:', playersError);
            else setPlayers(playersData || []);

            // 2. Obtener partidos APROBADOS para el ranking
            const { data: approvedMatches, error: matchesError } = await supabase.from('matches').select('*').eq('status', 'approved');
            if (matchesError) console.error('Error fetching approved matches:', matchesError);
            else setMatches(approvedMatches || []);
        };

        fetchInitialData();
    }, []);

    // El leaderboard se calcula cuando los jugadores o partidos cambian (sin cambios aquí)
    useEffect(() => {
        if (players.length > 0) {
            setLeaderboardData(calculateLeaderboard(players, matches));
        }
    }, [players, matches]);

    // --- CAMBIO 5: La lógica de localStorage se elimina ---

    // --- CAMBIO 6: handleAddMatch ahora guarda en Supabase y actualiza la UI temporalmente ---
    const handleAddMatch = async (newMatchData) => {
        try {
            const { data, error } = await supabase
                .from('matches')
                .insert([{ ...newMatchData, status: 'pending' }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setPendingMatches(currentPending => [...currentPending, data[0]]);
            }
            alert("Resultado cargado. Pendiente de aprobación.");
        } catch (error) {
            console.error("Error al guardar el partido:", error);
            alert("No se pudo guardar el partido.");
        }
    };
    
    // --- CAMBIO 7: handleDeleteMatch necesitará lógica de admin en el futuro ---
    const handleDeleteMatch = (matchIdToDelete) => {
        alert("La eliminación de partidos ahora debe hacerse desde un panel de admin.");
        // Aquí iría la llamada a Supabase para borrar, usando la llave de admin.
    };

    const filteredPlayers = useMemo(() => {
        // ... (lógica de filtrado sin cambios)
    }, [searchTerm, leaderboardData]);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* ... (Tu header y barra de búsqueda no cambian) ... */}
                
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
                    {/* ... (Tu tabla y thead no cambian) ... */}
                    <tbody>
                        {filteredPlayers.map((player) => (
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

            {/* --- CAMBIO 8: NUEVA SECCIÓN PARA MOSTRAR PARTIDOS PENDIENTES --- */}
            {pendingMatches.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Resultados Pendientes de Aprobación</h3>
                    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-4 space-y-3">
                        {pendingMatches.map(match => {
                            const p1 = players.find(p => p.id === match.player1_id);
                            const p2 = players.find(p => p.id === match.player2_id);
                            return (
                                <div key={match.id} className="bg-gray-700/50 p-3 rounded-md text-center">
                                    <p className="font-semibold">{p1?.name} vs {p2?.name}</p>
                                    <p className="text-gray-300">{match.result}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            </div>

            {selectedPlayer && <PlayerDetailModal 
                player={selectedPlayer} 
                allPlayers={players} 
                allMatches={matches} 
                onClose={() => setSelectedPlayer(null)}
                onDeleteMatch={handleDeleteMatch}
                onAddMatch={handleAddMatch}
             />}
        </div>
    );
}