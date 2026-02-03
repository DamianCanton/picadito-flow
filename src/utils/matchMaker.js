import { PLAYER_POSITIONS, FORMATION_SLOTS_442 } from './constants';

const PLAYERS_PER_MATCH = 22;
const PLAYERS_PER_TEAM = 11;

// Priority order for specific roles
const SPECIFIC_ROLES = [
    PLAYER_POSITIONS.ARQ,
    PLAYER_POSITIONS.CEN,
    PLAYER_POSITIONS.LAT,
    PLAYER_POSITIONS.MED,
    PLAYER_POSITIONS.VOL,
    PLAYER_POSITIONS.DEL
];

export const generateMatches = (players) => {
    // 1. Setup Phase
    const shuffledPlayers = shuffleArray([...players]);
    const pools = initializePools(shuffledPlayers);
    
    const matches = [];
    let matchIdCounter = 1;

    // 2. Match Generation Loop
    while (getTotalCount(pools) >= PLAYERS_PER_MATCH) {
        const teamA = [];
        const teamB = [];
        
        // Calculate remaining matches to determine quotas
        const currentTotalPlayers = getTotalCount(pools);
        const matchesRemaining = Math.floor(currentTotalPlayers / PLAYERS_PER_MATCH);

        // Phase A: Distribute Specific Roles with Quotas
        SPECIFIC_ROLES.forEach(role => {
            const rolePool = pools[role];
            // Calculate quota: evenly distribute scarce roles across remaining matches
            const quota = Math.ceil(rolePool.length / matchesRemaining);
            
            draftPlayers(rolePool, teamA, teamB, quota);
        });

        // Phase B: Fill remaining spots with Polifuncionales
        const poliPool = pools[PLAYER_POSITIONS.POLI];
        draftPlayers(poliPool, teamA, teamB, Infinity); // No quota, fill as much as possible

        // Phase C: Emergency Fill (Force Balance)
        // If teams are still not full (e.g. ran out of POLI), take from ANY remaining specific pool
        forceBalanceTeams(pools, teamA, teamB);

        // 3. Finalize Match
        const formattedTeamA = assignPositionsToFormation(teamA);
        const formattedTeamB = assignPositionsToFormation(teamB);

        matches.push({
            id: matchIdCounter++,
            name: `Match ${matchIdCounter - 1}`,
            teamA: formattedTeamA,
            teamB: formattedTeamB,
            status: 'scheduled'
        });
    }

    // 4. Collect Reserves
    const reserves = [];
    Object.values(pools).forEach(pool => reserves.push(...pool));

    return { matches, reserves };
};

// --- Core Logic Helpers ---

// Generic Drafter: Assigns players from a source array to Team A and Team B alternatingly
// balanced: Ensures one team doesn't get more than 1 extra player during this specific draft session
const draftPlayers = (sourcePool, teamA, teamB, limit = Infinity) => {
    let assignedCount = 0;
    // Randomize who gets the first pick in this draft session to avoid bias
    let assignToA = Math.random() < 0.5;

    while (
        sourcePool.length > 0 && 
        assignedCount < limit && 
        (teamA.length < PLAYERS_PER_TEAM || teamB.length < PLAYERS_PER_TEAM)
    ) {
        // If both teams are full, stop immediately
        if (teamA.length >= PLAYERS_PER_TEAM && teamB.length >= PLAYERS_PER_TEAM) break;

        let playerAssigned = false;

        if (assignToA) {
            if (teamA.length < PLAYERS_PER_TEAM) {
                teamA.push(sourcePool.shift());
                playerAssigned = true;
                assignToA = !assignToA; // Switch turn
            } else if (teamB.length < PLAYERS_PER_TEAM) {
                // Team A full, forced to Team B
                teamB.push(sourcePool.shift());
                playerAssigned = true;
            }
        } else {
            if (teamB.length < PLAYERS_PER_TEAM) {
                teamB.push(sourcePool.shift());
                playerAssigned = true;
                assignToA = !assignToA; // Switch turn
            } else if (teamA.length < PLAYERS_PER_TEAM) {
                // Team B full, forced to Team A
                teamA.push(sourcePool.shift());
                playerAssigned = true;
            }
        }

        if (playerAssigned) assignedCount++;
    }
};

// Fallback: If POLI runs out, scavenge from any remaining specific pools
const forceBalanceTeams = (pools, teamA, teamB) => {
    const allPoolKeys = Object.keys(pools);
    
    for (const key of allPoolKeys) {
        // Stop if both teams are full
        if (teamA.length >= PLAYERS_PER_TEAM && teamB.length >= PLAYERS_PER_TEAM) break;
        
        // Use the same fair draft logic for every remaining pool
        draftPlayers(pools[key], teamA, teamB, Infinity);
    }
};

// --- Utility Helpers ---

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const initializePools = (players) => {
    const pools = {
        [PLAYER_POSITIONS.ARQ]: [],
        [PLAYER_POSITIONS.CEN]: [],
        [PLAYER_POSITIONS.LAT]: [],
        [PLAYER_POSITIONS.MED]: [],
        [PLAYER_POSITIONS.VOL]: [],
        [PLAYER_POSITIONS.DEL]: [],
        [PLAYER_POSITIONS.POLI]: []
    };

    players.forEach(p => {
        if (pools[p.position]) {
            pools[p.position].push(p);
        } else {
            pools[PLAYER_POSITIONS.POLI].push(p);
        }
    });

    return pools;
};

const getTotalCount = (pools) => {
    return Object.values(pools).reduce((acc, curr) => acc + curr.length, 0);
};

// --- Formation Logic (Existing, preserved for compatibility) ---

const assignPositionsToFormation = (teamPlayers) => {
    // 1. Group team players by role
    const pools = initializePools(teamPlayers);

    // 2. Prepare empty formation
    const finalSetup = FORMATION_SLOTS_442.map(slot => ({ ...slot, player: null }));

    // 3. Pass 1: Exact Matches
    finalSetup.forEach(slot => {
        const poolName = slot.role;
        if (pools[poolName] && pools[poolName].length > 0) {
            slot.player = pools[poolName].shift();
        }
    });

    // 4. Handle Overflow (Excess Specific -> POLI)
    Object.keys(pools).forEach(key => {
        if (key !== PLAYER_POSITIONS.POLI) {
            pools[PLAYER_POSITIONS.POLI].push(...pools[key]);
            pools[key] = [];
        }
    });

    // 5. Pass 2: Fill Remaining with POLI/Overflow
    finalSetup.forEach(slot => {
        if (!slot.player && pools[PLAYER_POSITIONS.POLI].length > 0) {
            slot.player = pools[PLAYER_POSITIONS.POLI].shift();
        }
    });

    // 6. Return formatted for UI
    return finalSetup.map(slot => {
        if (slot.player) {
            return { ...slot.player, displayRole: slot.role };
        }
        return { name: 'VACANTE', position: 'N/A', id: `vacant-${slot.id}` };
    });
};
