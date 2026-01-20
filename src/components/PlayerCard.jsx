import { Shirt } from 'lucide-react';

export default function PlayerCard({ player, name, position }) {
    // Support both object prop or direct props
    const displayName = player ? player.name : name;
    const displayPos = player ? player.position : position;

    return (
        <div className="flex flex-col items-center justify-center p-2 mb-2 w-20 text-center animate-fadeIn">
            <div className="relative">
                <Shirt className="w-10 h-10 text-white drop-shadow-md" strokeWidth={1.5} fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className="text-xs font-bold text-white mt-1 leading-tight tracking-tight drop-shadow-sm line-clamp-2">
                {displayName}
            </span>
            {displayPos && (
                <span className="text-[10px] text-emerald-200 uppercase font-mono tracking-widest">{displayPos}</span>
            )}
        </div>
    );
}
