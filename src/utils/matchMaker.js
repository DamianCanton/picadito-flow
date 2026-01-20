export const generateMatches = (players) => {
    // 1. Shuffle players (Fisher-Yates)
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

        // 3. Split into Team A and Team B (Random split for now)
        // In a real app with positions, we'd balance here.
        const midPoint = Math.ceil(matchPlayers.length / 2);
        const teamA = matchPlayers.slice(0, midPoint);
        const teamB = matchPlayers.slice(midPoint);

        matches.push({
            id: matchIdCounter++,
            name: `Match ${matchIdCounter - 1}`,
            teamA,
            teamB,
            status: 'scheduled' // scheduled, played
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
