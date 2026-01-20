import PitchBoard from './PitchBoard';
import ReservesBench from './ReservesBench';

export default function MatchContainer({ matches, reserves }) {
    return (
        <div className="w-full px-4 pb-20">
            {matches.map((match) => (
                <div key={match.id} className="mb-12">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest inline-block border-b-4 border-emerald-500 pb-1">
                            {match.name.replace('Match', 'Partido')}
                        </h2>
                    </div>
                    <PitchBoard match={match} />
                </div>
            ))}

            <ReservesBench reserves={reserves} />
        </div>
    );
}
