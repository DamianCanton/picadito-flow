export const parsePlayers = (text) => {
    if (!text) return [];

    // Split by newline and process each line
    const lines = text.split(/\r?\n/);

    const players = lines
        .map(line => {
            // 1. Remove numbering (e.g., "1.", "1 -", "1)")
            let clean = line.replace(/^[\d]+[\.\-\)]\s*/, '');

            // 2. Remove emojis (basic range, can be expanded)
            clean = clean.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

            // 3. Trim whitespace
            return clean.trim();
        })
        .filter(name => name.length > 0) // Remove empty lines
        .map(name => {
            // Capitalize first letter of each word (optional, but looks nice)
            return name.replace(/\b\w/g, c => c.toUpperCase());
        });

    // Deduplicate
    return [...new Set(players)];
};
