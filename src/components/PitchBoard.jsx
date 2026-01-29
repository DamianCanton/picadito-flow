import PlayerCard from './PlayerCard';

export default function PitchBoard({ match }) {
    const { teamA, teamB, id } = match;

    // Helper to render a full team on one side of the pitch
    const renderTeam = (team, side) => {
        // We know the team comes sorted by assignment logic:
        // Indices: 
        // 0: GK
        // 1-4: DEF (LB, LCB, RCB, RB)
        // 5-8: MID (LM, LCM, RCM, RM)
        // 9-10: FWD (LST, RST)

        const gk = team[0];
        const def = team.slice(1, 5);
        const mid = team.slice(5, 9);
        const fwd = team.slice(9, 11);

        // Reverse order for Team A (top) so GK is at top? 
        // Typically:
        // Team A (Top): GK -> DEF -> MID -> FWD (playing downwards? or upwards?)
        // Let's assume Top Team plays DOWN. So GK is at top.
        // Team B (Bottom): GK -> DEF -> MID -> FWD (playing UP). So GK is at bottom.

        const isTop = side === 'top';

        return (
            <div className={`flex-1 flex flex-col justify-between py-6 ${isTop ? 'pb-12' : 'pt-12'} px-4 h-full`}>
                {/* 
                   Layout for TOP team (Team A):
                   GK (top)
                   DEF
                   MID
                   FWD (near center)
                   
                   Layout for BOTTOM team (Team B):
                   FWD (near center)
                   MID
                   DEF
                   GK (bottom)
                */}

                {isTop ? (
                    <>
                        {/* GK Line */}
                        <div className="flex justify-center">
                            <PlayerCard player={gk} />
                        </div>
                        {/* DEF Line */}
                        <div className="flex justify-around px-8">
                            {def.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                        {/* MID Line */}
                        <div className="flex justify-around px-4">
                            {mid.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                        {/* FWD Line */}
                        <div className="flex justify-center gap-16">
                            {fwd.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                    </>
                ) : (
                    <>
                        {/* FWD Line */}
                        <div className="flex justify-center gap-16">
                            {fwd.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                        {/* MID Line */}
                        <div className="flex justify-around px-4">
                            {mid.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                        {/* DEF Line */}
                        <div className="flex justify-around px-8">
                            {def.map((p, i) => <PlayerCard key={i} player={p} />)}
                        </div>
                        {/* GK Line */}
                        <div className="flex justify-center">
                            <PlayerCard player={gk} />
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-6 bg-pitch-green rounded-xl shadow-2xl border-4 border-white overflow-hidden relative min-h-[800px]">
            {/* Field Lines / Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 to-transparent pointer-events-none"></div>

            {/* Center Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/40 -translate-y-1/2 flex items-center justify-center z-0">
                <div className="w-20 h-20 rounded-full border-2 border-white/40 bg-transparent"></div>
            </div>

            {/* Teams container */}
            <div className="relative z-10 flex flex-col h-full absolute inset-0">
                {/* Team A (Top) */}
                <div className="flex-1 border-b-2 border-white/10 relative">
                    <h3 className="absolute top-2 left-4 text-sm font-black text-white/50 tracking-widest uppercase">Equipo A</h3>
                    {renderTeam(teamA, 'top')}
                </div>

                {/* Team B (Bottom) */}
                <div className="flex-1 relative">
                    <h3 className="absolute bottom-2 right-4 text-sm font-black text-white/50 tracking-widest uppercase">Equipo B</h3>
                    {renderTeam(teamB, 'bottom')}
                </div>
            </div>

            {/* Goals (Visual only) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 border-b-4 border-l-4 border-r-4 border-white/60 rounded-b-lg opacity-60"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 border-t-4 border-l-4 border-r-4 border-white/60 rounded-t-lg opacity-60"></div>
        </div>
    );
}
