import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, Player } from '../types';

interface GameContextType {
    socket: Socket | null;
    room: Room | null;
    player: Player | null;
    gameState: 'menu' | 'lobby' | 'game' | 'results';
    createRoom: (username: string, avatar: string) => void;
    joinRoom: (roomId: string, username: string, avatar: string) => void;
    startGame: () => void;
    updateProgress: (progress: number, wpm: number) => void;
    leaveRoom: () => void;
    playerReady: () => void;
    error: string | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [gameState, setGameState] = useState<'menu' | 'lobby' | 'game' | 'results'>('menu');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newSocket = io(`http://${window.location.hostname}:3001`);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('room_created', (newRoom: Room) => {
            setRoom(newRoom);
            setGameState('lobby');
            const me = newRoom.players.find(p => p.id === newSocket.id);
            if (me) setPlayer(me);
        });

        newSocket.on('room_joined', (newRoom: Room) => {
            setRoom(newRoom);
            setGameState('lobby');
            const me = newRoom.players.find(p => p.id === newSocket.id);
            if (me) setPlayer(me);
        });

        newSocket.on('room_updated', (updatedRoom: Room) => {
            setRoom(updatedRoom);
            // Update my player stats if needed
            const me = updatedRoom.players.find(p => p.id === newSocket.id);
            if (me) setPlayer(me);

            if (updatedRoom.status === 'playing' && gameState !== 'game') {
                setGameState('game');
            }
        });

        newSocket.on('game_started', (startedRoom: Room) => {
            setRoom(startedRoom);
            setGameState('game');
        });

        newSocket.on('timer_update', (timeLeft: number) => {
            setRoom(prev => prev ? { ...prev, timer: timeLeft } : null);
        });

        newSocket.on('game_over', (finishedRoom: Room) => {
            setRoom(finishedRoom);
            setGameState('results');
        });

        newSocket.on('error', (msg: string) => {
            setError(msg);
            setTimeout(() => setError(null), 3000);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const createRoom = (username: string, avatar: string) => {
        if (socket) {
            socket.emit('create_room', { username, avatar });
        }
    };

    const joinRoom = (roomId: string, username: string, avatar: string) => {
        if (socket) {
            socket.emit('join_room', { roomId, username, avatar });
        }
    };

    const startGame = () => {
        if (socket && room) {
            socket.emit('start_game', { roomId: room.id });
        }
    };

    const updateProgress = (progress: number, wpm: number) => {
        if (socket && room) {
            socket.emit('player_update', { roomId: room.id, progress, wpm });
        }
    };

    const leaveRoom = () => {
        window.location.reload();
    };

    const playerReady = () => {
        if (socket && room) {
            socket.emit('player_ready', { roomId: room.id });
        }
    };

    return (
        <GameContext.Provider value={{
            socket,
            room,
            player,
            gameState,
            createRoom,
            joinRoom,
            startGame,
            updateProgress,
            leaveRoom,
            playerReady,
            error
        }}>
            {children}
        </GameContext.Provider>
    );
};
