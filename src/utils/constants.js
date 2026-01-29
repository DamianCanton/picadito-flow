export const PLAYER_POSITIONS = {
    ARQ: 'ARQ',
    CEN: 'CEN',
    LAT: 'LAT',
    MED: 'MED',
    VOL: 'VOL',
    DEL: 'DEL',
    POLI: 'POLI'
};

export const POSITIONS_LIST = Object.values(PLAYER_POSITIONS);

export const FORMATION_SLOTS_442 = [
    { id: 'gk', role: PLAYER_POSITIONS.ARQ, line: 'GK' },
    { id: 'lb', role: PLAYER_POSITIONS.LAT, line: 'DEF' },
    { id: 'lcb', role: PLAYER_POSITIONS.CEN, line: 'DEF' },
    { id: 'rcb', role: PLAYER_POSITIONS.CEN, line: 'DEF' },
    { id: 'rb', role: PLAYER_POSITIONS.LAT, line: 'DEF' },
    { id: 'lm', role: PLAYER_POSITIONS.VOL, line: 'MID' },
    { id: 'lcm', role: PLAYER_POSITIONS.MED, line: 'MID' },
    { id: 'rcm', role: PLAYER_POSITIONS.MED, line: 'MID' },
    { id: 'rm', role: PLAYER_POSITIONS.VOL, line: 'MID' },
    { id: 'lst', role: PLAYER_POSITIONS.DEL, line: 'FWD' },
    { id: 'rst', role: PLAYER_POSITIONS.DEL, line: 'FWD' }
];
