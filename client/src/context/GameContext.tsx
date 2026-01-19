import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room, Player } from '../types';
import { soundManager } from '../utils/SoundManager';

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
        console.log('Initializing socket connection...');
        const newSocket = io(`http://${window.location.hostname}:3001`, {
            timeout: 10000,
            forceNew: true
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to server with ID:', newSocket.id);
            setError(null); // Clear any previous errors
        });

        newSocket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error);
            setError('Failed to connect to server. Please check if server is running on port 3001.');
        });

        newSocket.on('disconnect', (reason) => {
            console.log('🔌 Disconnected from server:', reason);
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                newSocket.connect();
            }
            setError('Disconnected from server. Please refresh the page.');
        });

        // Add debug listeners for all events
        newSocket.onAny((eventName, ...args) => {
            console.log(`📡 Socket event: ${eventName}`, args);
        });

        newSocket.on('room_created', (newRoom: Room) => {
            setRoom(newRoom);
            setGameState('lobby');
            soundManager.playSuccess();
            const me = newRoom.players.find(p => p.id === newSocket.id);
            if (me) setPlayer(me);
        });

        newSocket.on('room_joined', (newRoom: Room) => {
            setRoom(newRoom);
            setGameState('lobby');
            soundManager.playSuccess();
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
            soundManager.playSuccess();
        });

        newSocket.on('timer_update', (timeLeft: number) => {
            setRoom(prev => prev ? { ...prev, timer: timeLeft } : null);
        });

        newSocket.on('game_over', (finishedRoom: Room) => {
            setRoom(finishedRoom);
            setGameState('results');

            // Check if current player won
            const me = finishedRoom.players.find(p => p.id === newSocket.id);
            if (me && finishedRoom.players[0]?.id === me.id) {
                soundManager.playWin();
            } else {
                soundManager.playSuccess();
            }
        });

        newSocket.on('error', (msg: string) => {
            console.error('Socket error:', msg);
            setError(msg);
            soundManager.playError();
            setTimeout(() => setError(null), 5000);
        });

        newSocket.on('room_error', (error: { message: string }) => {
            console.error('Room error:', error);
            setError(error.message);
            soundManager.playError();
            setTimeout(() => setError(null), 5000);
        });

        return () => {
            newSocket.close();
        };
    }, []);



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
            createRoom: (username: string, avatar: string) => {
                console.log('🎯 GameContext.createRoom called:', { username, avatar, socketId: socket?.id });
                if (socket?.connected) {
                    socket.emit('create_room', { username, avatar });
                } else {
                    console.error('❌ Socket not connected');
                    setError('Not connected to server');
                }
            },
            joinRoom: (roomId: string, username: string, avatar: string) => {
                console.log('🎯 GameContext.joinRoom called:', { roomId, username, avatar, socketId: socket?.id });
                if (socket?.connected) {
                    socket.emit('join_room', { roomId, username, avatar });
                } else {
                    console.error('❌ Socket not connected');
                    setError('Not connected to server');
                }
            },
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
