import PlayerCard from './PlayerCard';

export default function PitchBoard({ match }) {
    const { teamA, teamB, id } = match;

    return (
        <div className="w-full max-w-4xl mx-auto my-6 bg-pitch-green rounded-xl shadow-2xl border-4 border-white overflow-hidden relative">
            {/* Field Lines / Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 to-transparent pointer-events-none"></div>

            {/* Center Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/40 -translate-y-1/2 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-white/40 bg-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[600px]">

                {/* Team A (Top/Left) */}
                <div className="flex-1 flex flex-col justify-around py-8 border-b-2 md:border-b-0 md:border-r-2 border-white/20">
                    <h3 className="text-center text-2xl font-black text-white/90 tracking-tighter uppercase mb-4">Equipo A</h3>
                    <div className="flex flex-wrap justify-center gap-4 px-4 content-center">
                        {teamA.map((player, idx) => (
                            <PlayerCard key={`full-${id}-a-${idx}`} player={player} />
                        ))}
                    </div>
                </div>

                {/* Team B (Bottom/Right) */}
                <div className="flex-1 flex flex-col justify-around py-8">
                    <h3 className="text-center text-2xl font-black text-white/90 tracking-tighter uppercase mb-4">Equipo B</h3>
                    <div className="flex flex-wrap justify-center gap-4 px-4 content-center">
                        {teamB.map((player, idx) => (
                            <PlayerCard key={`full-${id}-b-${idx}`} player={player} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Goals (Visual only) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-lg opacity-50 md:hidden"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 border-t-2 border-l-2 border-r-2 border-white/40 rounded-t-lg opacity-50 md:hidden"></div>
        </div>
    );
}
