import React from 'react';
import { useGame } from '../context/GameContext';

export const Results: React.FC = () => {
    const { room, player, leaveRoom, playerReady } = useGame();

    if (!room || !player) return null;

    const sortedPlayers = [...room.players].sort((a, b) => b.progress - a.progress);
    const winner = sortedPlayers[0];
    const isWinner = winner.id === player.id;
    const me = room.players.find(p => p.id === player.id);

    return (
        <div className="results-overlay">
            <div className="card results-card">
                <div className="results-header">
                    <h2>{isWinner ? 'VICTORY!' : 'GAME OVER'}</h2>
                    <div className="winner-display">
                        <span className="winner-avatar">{winner.avatar}</span>
                        <span className="winner-name">{winner.username} WON!</span>
                    </div>
                </div>

                <div className="final-standings">
                    {sortedPlayers.map((p, index) => (
                        <div key={p.id} className={`result-row ${p.id === player.id ? 'me' : ''}`}>
                            <span className="rank">#{index + 1}</span>
                            <span className="avatar">{p.avatar}</span>
                            <span className="name">{p.username}</span>
                            <span className="wpm">{p.wpm} WPM</span>
                            {p.isReady && <span className="ready-badge">READY</span>}
                        </div>
                    ))}
                </div>

                <div className="results-actions">
                    <button className="btn secondary" onClick={leaveRoom}>
                        LEAVE
                    </button>
                    {!me?.isReady ? (
                        <button className="btn primary" onClick={playerReady}>
                            READY UP
                        </button>
                    ) : (
                        <div className="waiting-msg">Waiting for others...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
