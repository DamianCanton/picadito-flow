import { create } from 'zustand';
import { generateMatches } from './utils/matchMaker';
import { initialPlayers } from './Data/initialPlayers';
import { parsePlayers } from './utils/parser';

const useAppStore = create((set, get) => ({
    inputPlayers: '',
    activePlayers: [], // { id, name, position }
    matches: [],
    reserves: [],
    currentView: 'home', // 'home' | 'editor' | 'matchRoom'

    setInputPlayers: (text) => set({ inputPlayers: text }),

    // Sync raw text to structured players (Parsing)
    syncPlayersFromText: (text) => {
        const names = parsePlayers(text);
        const currentPlayers = get().activePlayers;

        // Avoid duplicates: only add names that don't exist
        const newPlayers = names
            .filter(name => !currentPlayers.some(p => p.name.toLowerCase() === name.toLowerCase()))
            .map(name => ({
                id: crypto.randomUUID(),
                name: name,
                position: 'POLI' // Default position
            }));

        set({
            inputPlayers: text,
            activePlayers: [...currentPlayers, ...newPlayers],
            currentView: 'editor' // Redirect to editor after pasting
        });
    },

    // CRUD Actions
    addPlayer: (name) => set((state) => ({
        activePlayers: [...state.activePlayers, {
            id: crypto.randomUUID(),
            name,
            position: 'POLI'
        }]
    })),

    removePlayer: (id) => set((state) => ({
        activePlayers: state.activePlayers.filter(p => p.id !== id)
    })),

    updatePlayer: (id, field, value) => set((state) => ({
        activePlayers: state.activePlayers.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        )
    })),

    createMatches: () => {
        const { activePlayers } = get();
        // Map objects back to simple list for key for now, or update generator to handle objects
        const { matches, reserves } = generateMatches(activePlayers);
        set({ matches, reserves, currentView: 'matchRoom' });
    },

    navigate: (view) => set({ currentView: view }),
    reset: () => set({ currentView: 'home', matches: [], reserves: [] }),
}));

export default useAppStore;
