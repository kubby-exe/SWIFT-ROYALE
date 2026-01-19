"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRoom = exports.updatePlayer = exports.getRoom = exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
const uuid_1 = require("uuid");
const rooms = {};
const SAMPLE_TEXTS = [
    "The concept of a robot taking over the world is a common trope in science fiction. However, in reality, artificial intelligence is designed to assist humans rather than replace them. From medical diagnosis to autonomous driving, AI is revolutionizing various industries, making our lives easier and more efficient. The future of technology holds endless possibilities, and it is up to us to shape it responsibly.",
    "In the heart of the bustling city, a small park offered a quiet refuge for weary souls. The sound of rustling leaves and chirping birds provided a stark contrast to the honking horns and sirens outside. People from all walks of life gathered here to read, talk, or simply sit in silence, finding a moment of peace amidst the chaos of urban life.",
    "Exploration has always been a fundamental part of human nature. From the depths of the oceans to the vastness of space, we are driven by a curiosity to discover the unknown. Each new discovery brings with it a deeper understanding of our universe and our place within it, pushing the boundaries of what we thought was possible.",
    "Cooking is an art form that requires both creativity and precision. The perfect balance of flavors, textures, and aromas can transform simple ingredients into a masterpiece. Whether it's a comforting bowl of soup on a rainy day or an elaborate feast for a celebration, food has the power to bring people together and create lasting memories.",
    "The ancient ruins stood as a testament to a civilization long gone. Weathered stone walls and crumbling pillars whispered secrets of the past to those who took the time to listen. As the sun set, casting long shadows across the site, one could almost imagine the bustling streets and vibrant markets that once thrived in this now desolate place."
];
const createRoom = (host) => {
    const roomId = (0, uuid_1.v4)().slice(0, 6).toUpperCase();
    const room = {
        id: roomId,
        players: [host],
        status: 'waiting',
        text: SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)],
        timer: 60
    };
    rooms[roomId] = room;
    return room;
};
exports.createRoom = createRoom;
const joinRoom = (roomId, player) => {
    const room = rooms[roomId];
    if (!room)
        return null;
    if (room.status !== 'waiting')
        return null; // Can't join if game started
    room.players.push(player);
    return room;
};
exports.joinRoom = joinRoom;
const leaveRoom = (roomId, playerId) => {
    const room = rooms[roomId];
    if (!room)
        return null;
    room.players = room.players.filter(p => p.id !== playerId);
    if (room.players.length === 0) {
        delete rooms[roomId];
        return null;
    }
    return room;
};
exports.leaveRoom = leaveRoom;
const getRoom = (roomId) => {
    return rooms[roomId] || null;
};
exports.getRoom = getRoom;
const updatePlayer = (roomId, playerId, data) => {
    const room = rooms[roomId];
    if (!room)
        return null;
    const player = room.players.find(p => p.id === playerId);
    if (player) {
        Object.assign(player, data);
    }
    return room;
};
exports.updatePlayer = updatePlayer;
const resetRoom = (roomId) => {
    const room = rooms[roomId];
    if (!room)
        return null;
    room.status = 'waiting';
    room.text = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    room.startTime = undefined;
    room.timer = 60;
    room.players.forEach(p => {
        p.progress = 0;
        p.wpm = 0;
        p.finishedTime = undefined;
        p.isReady = false;
    });
    return room;
};
exports.resetRoom = resetRoom;
