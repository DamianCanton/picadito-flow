import PlayerCard from './PlayerCard';

export default function ReservesBench({ reserves }) {
    if (!reserves || reserves.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🚌</span> Suplentes / Lista de Espera
            </h3>
            <div className="flex flex-wrap gap-4">
                {reserves.map((player, idx) => (
                    <div key={`reserve-${idx}`} className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                        <span className="text-slate-400 font-mono text-xs">{idx + 1}.</span>
                        {/* Handle object or string for backward compatibility though we switched all */}
                        <span className="font-semibold text-slate-200">{player.name || player}</span>
                        {player.position && <span className="text-[10px] text-emerald-400 font-mono">{player.position}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}
