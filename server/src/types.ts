export interface Player {
    id: string;
    username: string;
    avatar: string;
    progress: number; // 0-100
    wpm: number;
    isReady: boolean;
    finishedTime?: number;
}

export interface Room {
    id: string;
    players: Player[];
    status: 'waiting' | 'countdown' | 'playing' | 'finished';
    text: string;
    startTime?: number;
    timer: number;
}
