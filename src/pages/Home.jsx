import { ClipboardList, Play } from 'lucide-react';
import useAppStore from '../store';

export default function Home() {
    const { inputPlayers, setInputPlayers, syncPlayersFromText } = useAppStore();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
            <div className="w-full max-w-2xl animate-fade-in-up">
                {/* Heather / Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600 drop-shadow-sm">
                        Fútbol 11 Manager
                    </h1>
                    <p className="text-slate-400 mt-2 font-mono">Organiza tus partidos al instante.</p>
                </div>

                {/* Input Area */}
                <div className="bg-slate-800 p-1 rounded-xl shadow-2xl border border-slate-700">
                    <div className="bg-slate-900 rounded-lg p-2 border-b border-slate-700 flex items-center gap-2 mb-1">
                        <ClipboardList className="text-emerald-500 w-5 h-5" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Lista del Vestuario</span>
                    </div>
                    <textarea
                        className="w-full h-80 bg-slate-900/50 text-slate-300 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg resize-none placeholder-slate-600"
                        placeholder="Pega tu lista de jugadores aquí..."
                        value={inputPlayers}
                        onChange={(e) => setInputPlayers(e.target.value)}
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={() => syncPlayersFromText(inputPlayers)}
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl py-4 rounded-xl uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                    <span>Gestionar Jugadores</span>
                    <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-slate-600 text-xs mt-6">
                    El sistema da prioridad a partidos 11 vs 11. El resto va a reservas.
                </p>
            </div>
        </div>
    );
}
