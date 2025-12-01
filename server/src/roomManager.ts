import { Room, Player } from './types';
import { v4 as uuidv4 } from 'uuid';

const rooms: Record<string, Room> = {};

const SAMPLE_TEXTS = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step."
];

export const createRoom = (host: Player): Room => {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    const room: Room = {
        id: roomId,
        players: [host],
        status: 'waiting',
        text: SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)],
        timer: 60
    };
    rooms[roomId] = room;
    return room;
};

export const joinRoom = (roomId: string, player: Player): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;
    if (room.status !== 'waiting') return null; // Can't join if game started

    room.players.push(player);
    return room;
};

export const leaveRoom = (roomId: string, playerId: string): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);

    if (room.players.length === 0) {
        delete rooms[roomId];
        return null;
    }

    return room;
};

export const getRoom = (roomId: string): Room | null => {
    return rooms[roomId] || null;
};

export const updatePlayer = (roomId: string, playerId: string, data: Partial<Player>): Room | null => {
    const room = rooms[roomId];
    if (!room) return null;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
        Object.assign(player, data);
    }
    return room;
};
