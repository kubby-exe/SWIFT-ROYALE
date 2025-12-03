import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Room, Player } from './types';
import { createRoom, joinRoom, leaveRoom, updatePlayer, getRoom, resetRoom } from './roomManager';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3001;

// Store socket -> room/player mapping
const socketMap: Record<string, { roomId: string; playerId: string }> = {};

// Store interval IDs for each room to clear them properly
const roomIntervals: Record<string, NodeJS.Timeout> = {};

const startGame = (roomId: string) => {
    const room = getRoom(roomId);
    if (room) {
        // Clear existing interval if any (game or countdown)
        if (roomIntervals[roomId]) {
            clearInterval(roomIntervals[roomId]);
            delete roomIntervals[roomId];
        }

        room.status = 'countdown';
        io.to(roomId).emit('room_updated', room);

        // Start countdown logic
        let count = 3;
        const countdownInterval = setInterval(() => {
            if (count > 0) {
                io.to(roomId).emit('countdown', count);
                count--;
            } else {
                clearInterval(countdownInterval);
                // We don't delete from roomIntervals here because we're about to replace it with gameInterval

                room.status = 'playing';
                room.startTime = Date.now();
                io.to(roomId).emit('game_started', room);

                // Start game timer
                let timeLeft = 60;
                const gameInterval = setInterval(() => {
                    const currentRoom = getRoom(roomId);
                    if (!currentRoom || currentRoom.status !== 'playing') {
                        clearInterval(gameInterval);
                        if (roomIntervals[roomId] === gameInterval) {
                            delete roomIntervals[roomId];
                        }
                        return;
                    }

                    timeLeft--;
                    currentRoom.timer = timeLeft;
                    io.to(roomId).emit('timer_update', timeLeft);

                    // Check if all players finished
                    const allFinished = currentRoom.players.every(p => p.finishedTime);

                    if (timeLeft <= 0 || allFinished) {
                        clearInterval(gameInterval);
                        if (roomIntervals[roomId] === gameInterval) {
                            delete roomIntervals[roomId];
                        }
                        currentRoom.status = 'finished';
                        io.to(roomId).emit('game_over', currentRoom);
                        io.to(roomId).emit('room_updated', currentRoom);
                    }
                }, 1000);

                roomIntervals[roomId] = gameInterval;
            }
        }, 1000);

        roomIntervals[roomId] = countdownInterval;
    }
};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('create_room', ({ username, avatar }) => {
        const player: Player = {
            id: socket.id,
            username,
            avatar,
            progress: 0,
            wpm: 0,
            isReady: false
        };
        const room = createRoom(player);
        socketMap[socket.id] = { roomId: room.id, playerId: player.id };
        socket.join(room.id);
        socket.emit('room_created', room);
    });

    socket.on('join_room', ({ roomId, username, avatar }) => {
        const player: Player = {
            id: socket.id,
            username,
            avatar,
            progress: 0,
            wpm: 0,
            isReady: false
        };
        const room = joinRoom(roomId, player);
        if (room) {
            socketMap[socket.id] = { roomId: room.id, playerId: player.id };
            socket.join(room.id);
            io.to(room.id).emit('room_updated', room);
            socket.emit('room_joined', room);
        } else {
            socket.emit('error', 'Room not found or game already started');
        }
    });

    socket.on('player_update', ({ roomId, progress, wpm }) => {
        const room = updatePlayer(roomId, socket.id, { progress, wpm });
        if (room) {
            // Check for winner
            if (progress >= 100 && !room.players.find(p => p.id === socket.id)?.finishedTime) {
                updatePlayer(roomId, socket.id, { finishedTime: Date.now() });
            }
            io.to(roomId).emit('room_updated', room);
        }
    });

    socket.on('player_ready', ({ roomId }) => {
        console.log(`Player ${socket.id} ready in room ${roomId}`);
        const room = updatePlayer(roomId, socket.id, { isReady: true });
        if (room) {
            console.log('Room updated after player ready:', room);
            io.to(roomId).emit('room_updated', room);

            // Check if all players are ready
            const allReady = room.players.every(p => p.isReady);
            if (allReady && room.players.length > 0) {
                console.log('All players ready, resetting room');
                const resetRoomData = resetRoom(roomId);
                if (resetRoomData) {
                    io.to(roomId).emit('room_updated', resetRoomData);
                    // Start game automatically if everyone is ready
                    startGame(roomId);
                }
            }
        } else {
            console.log('Room not found or player not found for ready update');
        }
    });

    socket.on('start_game', ({ roomId }) => {
        const room = getRoom(roomId);
        if (room && room.players[0].id === socket.id) { // Only host can start
            startGame(roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const data = socketMap[socket.id];
        if (data) {
            const room = leaveRoom(data.roomId, data.playerId);
            if (room) {
                io.to(room.id).emit('room_updated', room);
            }
            delete socketMap[socket.id];
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
