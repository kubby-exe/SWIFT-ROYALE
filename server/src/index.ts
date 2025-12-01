import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Room, Player } from './types';
import { createRoom, joinRoom, leaveRoom, updatePlayer, getRoom } from './roomManager';

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

    socket.on('start_game', ({ roomId }) => {
        const room = getRoom(roomId);
        if (room && room.players[0].id === socket.id) { // Only host can start
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
                    room.status = 'playing';
                    room.startTime = Date.now();
                    io.to(roomId).emit('game_started', room);
                }
            }, 1000);
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
