import React from 'react';
import { useGame } from '../context/GameContext';

export const Lobby: React.FC = () => {
    const { room, player, startGame, leaveRoom } = useGame();

    if (!room || !player) return null;

    const isHost = room.players[0].id === player.id;

    return (
        <div className="lobby-container">
            <div className="card lobby-card">
                <div className="lobby-header">
                    <h2>LOBBY</h2>
                    <div className="room-code">
                        CODE: <span>{room.id}</span>
                    </div>
                </div>

                <div className="players-list">
                    {room.players.map(p => (
                        <div key={p.id} className={`player-item ${p.id === player.id ? 'me' : ''}`}>
                            <span className="player-avatar">{p.avatar}</span>
                            <span className="player-name">{p.username}</span>
                            {p.id === room.players[0].id && <span className="host-badge">HOST</span>}
                        </div>
                    ))}
                    {[...Array(Math.max(0, 4 - room.players.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="player-item empty">
                            <span>Waiting for player...</span>
                        </div>
                    ))}
                </div>

                <div className="lobby-actions">
                    <button className="btn secondary" onClick={leaveRoom}>
                        LEAVE
                    </button>
                    {isHost && (
                        <button className="btn primary" onClick={startGame}>
                            START GAME
                        </button>
                    )}
                    {!isHost && (
                        <div className="waiting-msg">Waiting for host to start...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
