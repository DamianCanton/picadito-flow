import { ArrowLeft, Share2 } from 'lucide-react';
import useAppStore from '../store';
import MatchContainer from '../components/MatchContainer';

export default function MatchRoom() {
    const { matches, reserves, navigate } = useAppStore();

    const handleCopyToWhatsApp = () => {
        let text = `⚽ *DÍA DE PARTIDO* ⚽\n\n`;

        matches.forEach(match => {
            text += `🔥 *${match.name.replace('Match', 'Partido').toUpperCase()}*\n`;
            text += `🔴 *EQUIPO A*: ${match.teamA.map(p => `${p.name} (${p.position})`).join(', ')}\n`;
            text += `🔵 *EQUIPO B*: ${match.teamB.map(p => `${p.name} (${p.position})`).join(', ')}\n\n`;
        });

        if (reserves.length > 0) {
            text += `🚌 *SUPLENTES*: ${reserves.map(p => p.name).join(', ')}\n`;
        }

        navigator.clipboard.writeText(text);
        alert('¡Alineaciones copiadas al portapapeles!');
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate('editor')} // Go back to editor, not home
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-black uppercase tracking-wider text-white">Día de Partido</h1>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </header>

            {/* Content */}
            <MatchContainer matches={matches} reserves={reserves} />

            {/* Footer Action */}
            <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
                <button
                    onClick={handleCopyToWhatsApp}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full shadow-xl shadow-green-900/50 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <Share2 className="w-5 h-5" />
                    <span>Copiar para WhatsApp</span>
                </button>
            </div>
        </div>
    );
}
