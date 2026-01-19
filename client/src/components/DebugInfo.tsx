import React from 'react';
import { useGame } from '../context/GameContext';

export const DebugInfo: React.FC = () => {
    const { socket, room, player, gameState, error } = useGame();
    
    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 1000,
            maxWidth: '300px'
        }}>
            <div><strong>Debug Info:</strong></div>
            <div>Socket ID: {socket?.id || 'null'}</div>
            <div>Connected: {socket?.connected ? 'Yes' : 'No'}</div>
            <div>Game State: {gameState}</div>
            <div>Room ID: {room?.id || 'null'}</div>
            <div>Player: {player?.username || 'null'}</div>
            <div>Error: {error || 'none'}</div>
        </div>
    );
};