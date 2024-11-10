export interface Player {
    id: number;
    name: string;
    guild?: {
        name: string;
    };
}

export interface LeaderboardEntry {
    score: number;
    wins: number;
    losses: number;
    player: Player;
    winRate?: number;
}
