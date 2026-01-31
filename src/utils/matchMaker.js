import { PLAYER_POSITIONS, FORMATION_SLOTS_442 } from './constants';

export const generateMatches = (players) => {
    // 1. Separate players by role (Specific vs POLI)
    const pools = {
        [PLAYER_POSITIONS.ARQ]: [],
        [PLAYER_POSITIONS.CEN]: [],
        [PLAYER_POSITIONS.LAT]: [],
        [PLAYER_POSITIONS.MED]: [],
        [PLAYER_POSITIONS.VOL]: [],
        [PLAYER_POSITIONS.DEL]: [],
        [PLAYER_POSITIONS.POLI]: []
    };

    // Shuffle original input first to ensure initial randomness
    const shuffledInput = [...players];
    for (let i = shuffledInput.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledInput[i], shuffledInput[j]] = [shuffledInput[j], shuffledInput[i]];
    }

    // Distribute into pools
    shuffledInput.forEach(p => {
        if (pools[p.position]) {
            pools[p.position].push(p);
        } else {
            pools[PLAYER_POSITIONS.POLI].push(p);
        }
    });

    const matches = [];
    const reserves = []; // Will collect leftovers
    const PLAYERS_PER_MATCH = 22;
    const PLAYERS_PER_TEAM = 11;

    // Define priority order for specific roles (ARQ usually top priority to balance)
    const SPECIFIC_ROLES = [
        PLAYER_POSITIONS.ARQ,
        PLAYER_POSITIONS.CEN,
        PLAYER_POSITIONS.LAT,
        PLAYER_POSITIONS.MED,
        PLAYER_POSITIONS.VOL,
        PLAYER_POSITIONS.DEL
    ];

    let matchIdCounter = 1;

    // While we have enough players for a full match
    while (getTotalCount(pools) >= PLAYERS_PER_MATCH) {
        const teamA = [];
        const teamB = [];

        // Dynamic calculation of remaining matches
        const currentTotalPlayers = getTotalCount(pools);
        const matchesRemaining = Math.floor(currentTotalPlayers / PLAYERS_PER_MATCH);

        // Distribute Specifics Round-Robin with QUOTA
        SPECIFIC_ROLES.forEach(role => {
            const rolePool = pools[role];

            // Calculate Quota for THIS match: Math.ceil(available / matchesRemaining)
            // e.g., 4 ARQs, 2 Matches left -> take 2.
            // e.g., 5 ARQs, 2 Matches left -> take 3 for first, leaving 2 for second.
            // Ensures we don't consume everyone in the first match.
            const maxForThisMatch = Math.ceil(rolePool.length / matchesRemaining);
            let assignedCount = 0;

            let assignToA = Math.random() < 0.5; // Random start for fairness

            // Distribute up to quota
            while (rolePool.length > 0 && assignedCount < maxForThisMatch) {
                // If both teams full, stop distributing this role (defer to next match)
                if (teamA.length >= PLAYERS_PER_TEAM && teamB.length >= PLAYERS_PER_TEAM) break;

                let assigned = false;
                if (assignToA) {
                    if (teamA.length < PLAYERS_PER_TEAM) {
                        teamA.push(rolePool.shift());
                        assignToA = !assignToA;
                        assigned = true;
                    } else if (teamB.length < PLAYERS_PER_TEAM) {
                        teamB.push(rolePool.shift());
                        assigned = true;
                    }
                } else {
                    if (teamB.length < PLAYERS_PER_TEAM) {
                        teamB.push(rolePool.shift());
                        assignToA = !assignToA;
                        assigned = true;
                    } else if (teamA.length < PLAYERS_PER_TEAM) {
                        teamA.push(rolePool.shift());
                        assigned = true;
                    }
                }

                if (assigned) assignedCount++;
                else break;
            }
        });

        // Fill remaining spots with POLI
        const poliPool = pools[PLAYER_POSITIONS.POLI];
        let assignToA = Math.random() < 0.5;

        while ((teamA.length < PLAYERS_PER_TEAM || teamB.length < PLAYERS_PER_TEAM) && poliPool.length > 0) {
            if (assignToA) {
                if (teamA.length < PLAYERS_PER_TEAM) {
                    teamA.push(poliPool.shift());
                    assignToA = !assignToA;
                } else if (teamB.length < PLAYERS_PER_TEAM) {
                    teamB.push(poliPool.shift());
                }
            } else {
                if (teamB.length < PLAYERS_PER_TEAM) {
                    teamB.push(poliPool.shift());
                    assignToA = !assignToA;
                } else if (teamA.length < PLAYERS_PER_TEAM) {
                    teamA.push(poliPool.shift());
                }
            }
        }

        // Final check: fallback if pools drained but teams not full (edge case)
        fillTeamsWithAnyRemaining(teamA, teamB, pools, PLAYERS_PER_TEAM);

        // Assign formations
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

    // Collect all remaining players into reserves
    Object.values(pools).forEach(pool => reserves.push(...pool));

    return { matches, reserves };
};

// Helper to count total remaining
const getTotalCount = (pools) => {
    return Object.values(pools).reduce((acc, curr) => acc + curr.length, 0);
};

// Helper for edge cases where we run out of Preferred players but have others
const fillTeamsWithAnyRemaining = (teamA, teamB, pools, maxPerTeam) => {
    const allRemaining = [];
    Object.values(pools).forEach(p => allRemaining.push(...p));
    // Flattening removes them from pool? No, we need to shift from source.

    // Easier: Loop all pools
    const poolKeys = Object.keys(pools);

    for (const key of poolKeys) {
        const pool = pools[key];
        while (pool.length > 0 && (teamA.length < maxPerTeam || teamB.length < maxPerTeam)) {
            if (teamA.length < maxPerTeam) {
                teamA.push(pool.shift());
            } else {
                teamB.push(pool.shift());
            }
        }
    }
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
