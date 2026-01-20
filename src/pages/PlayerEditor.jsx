import { useState } from 'react';
import { Trash2, Plus, Play, User } from 'lucide-react';
import useAppStore from '../store';

const POSITIONS = ['ARQ', 'DEF', 'MED', 'DEL', 'POLI'];

export default function PlayerEditor() {
    const { activePlayers, addPlayer, removePlayer, updatePlayer, createMatches } = useAppStore();
    const [newPlayerName, setNewPlayerName] = useState('');

    const handleAdd = () => {
        if (newPlayerName.trim()) {
            addPlayer(newPlayerName);
            setNewPlayerName('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 px-4 py-8 pb-32">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                    Gestionar Jugadores
                </h1>
                <p className="text-emerald-500 font-mono text-sm">Total: {activePlayers.length}</p>
            </header>

            <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                {/* Add Bar */}
                <div className="p-4 bg-slate-900 border-b border-slate-700 flex gap-2">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder="Nombre del jugador..."
                        className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors"
                    >
                        <Plus />
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-slate-700/50 max-h-[60vh] overflow-y-auto">
                    {activePlayers.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 p-3 hover:bg-slate-700/30 transition-colors group">
                            <User className="w-5 h-5 text-slate-500" />

                            {/* Name Edit */}
                            <input
                                className="flex-1 bg-transparent text-white font-semibold focus:outline-none focus:border-b border-emerald-500"
                                value={player.name}
                                onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                            />

                            {/* Position Selector */}
                            <select
                                className="bg-slate-900 text-emerald-400 text-xs font-mono py-1 px-2 rounded border border-slate-700 focus:border-emerald-500 outline-none"
                                value={player.position}
                                onChange={(e) => updatePlayer(player.id, 'position', e.target.value)}
                            >
                                {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                            </select>

                            <button
                                onClick={() => removePlayer(player.id)}
                                className="text-slate-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {activePlayers.length === 0 && (
                        <div className="p-8 text-center text-slate-500 italic">
                            No hay jugadores. Añade algunos o pega una lista en el inicio.
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            {activePlayers.length > 0 && (
                <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50">
                    <button
                        onClick={createMatches} // No args needed now, usages store state
                        className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-10 rounded-full shadow-xl shadow-emerald-900/50 flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 text-lg tracking-widest uppercase animate-bounce-subtle"
                    >
                        <span>Generar Partidos</span>
                        <Play className="w-6 h-6 fill-current" />
                    </button>
                </div>
            )}
        </div>
    );
}
