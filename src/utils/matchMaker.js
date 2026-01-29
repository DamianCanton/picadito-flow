import { PLAYER_POSITIONS, FORMATION_SLOTS_442 } from './constants';

export const generateMatches = (players) => {
    // 1. Shuffle players (Fisher-Yates) to ensure randomness in distribution
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const matches = [];
    const reserves = [];
    const PLAYERS_PER_MATCH = 22;

    // 2. Create chunks of 22
    let matchIdCounter = 1;
    let currentIndex = 0;

    while (currentIndex + PLAYERS_PER_MATCH <= shuffled.length) {
        const matchPlayers = shuffled.slice(currentIndex, currentIndex + PLAYERS_PER_MATCH);

        // 3. Assign positions for each team strictly
        // We split the match pool into two groups of 11 first? 
        // No, current logic splits RANDOMLY first.
        // BETTER APPROACH: Split randomly, THEN strict-sort each team.
        const midPoint = Math.ceil(matchPlayers.length / 2);
        const rawTeamA = matchPlayers.slice(0, midPoint);
        const rawTeamB = matchPlayers.slice(midPoint);

        const teamA = assignPositionsToFormation(rawTeamA);
        const teamB = assignPositionsToFormation(rawTeamB);

        matches.push({
            id: matchIdCounter++,
            name: `Match ${matchIdCounter - 1}`,
            teamA,
            teamB,
            status: 'scheduled'
        });

        currentIndex += PLAYERS_PER_MATCH;
    }

    // 4. Handle reserves
    if (currentIndex < shuffled.length) {
        const remainingPlayers = shuffled.slice(currentIndex);
        reserves.push(...remainingPlayers);
    }

    return { matches, reserves };
};

// Helper: Assigns players to 4-4-2 slots efficiently
const assignPositionsToFormation = (teamPlayers) => {
    // 1. Group players by role
    const pools = {
        [PLAYER_POSITIONS.ARQ]: [],
        [PLAYER_POSITIONS.CEN]: [],
        [PLAYER_POSITIONS.LAT]: [],
        [PLAYER_POSITIONS.MED]: [], // Combined CM/CDM
        [PLAYER_POSITIONS.VOL]: [],
        [PLAYER_POSITIONS.DEL]: [],
        [PLAYER_POSITIONS.POLI]: [] // And generic/unknown
    };

    // Fill pools
    teamPlayers.forEach(p => {
        if (pools[p.position]) {
            pools[p.position].push(p);
        } else {
            // Treat unknown positions (old DEF/MED/etc) as POLI for flexibility or specific buckets if we wanted
            pools[PLAYER_POSITIONS.POLI].push(p);
        }
    });

    // 2. Prepare empty formation
    // Clone standard slots
    const finalSetup = FORMATION_SLOTS_442.map(slot => ({ ...slot, player: null }));

    // 3. Fill Specific Slots
    // Logic: Iterate through slots, find best candidate

    // We do multiple passes.

    // PASS 1: Fill Exact Matches
    // For each slot type, take from corresponding pool.
    // If pool has item, assign and remove from pool.
    // Excess items stay in pool.

    finalSetup.forEach(slot => {
        const poolName = slot.role; // e.g., ARQ, CEN
        if (pools[poolName] && pools[poolName].length > 0) {
            slot.player = pools[poolName].shift(); // Take first available
        }
    });

    // 4. Handle Overflow (Excess Specific Players become Fillers)
    // Gather all remaining specific players into the POLI pool
    Object.keys(pools).forEach(key => {
        if (key !== PLAYER_POSITIONS.POLI) {
            pools[PLAYER_POSITIONS.POLI].push(...pools[key]);
            pools[key] = []; // Empty the specific pool
        }
    });

    // 5. Fill Remaining Empty Slots with POLI/Overflow Pool
    finalSetup.forEach(slot => {
        if (!slot.player && pools[PLAYER_POSITIONS.POLI].length > 0) {
            slot.player = pools[PLAYER_POSITIONS.POLI].shift();
        }
    });

    // 6. Return standard array format for UI, but sorted by position index
    // If we still have players (shouldn't happen if team size == slot size, but validation needed)
    // The UI expects an array of players. 
    // We map back to: { ...player, currentPosition: slot.id } potentially?
    // Or just return the player objects in order? 
    // The previous UI mapped array index to grid position implicitly or just flex wrapped.
    // We need to ensure the ORDER is correct for the 4-4-2 visualizer: GK, DEF(4), MID(4), FWD(2).

    return finalSetup.map(slot => {
        if (slot.player) {
            return { ...slot.player, displayRole: slot.role };
        }
        return { name: 'VACANTE', position: 'N/A', id: `vacant-${slot.id}` }; // Should not happen with 11 players
    });
};
