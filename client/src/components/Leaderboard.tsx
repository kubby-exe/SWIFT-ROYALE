import React from 'react';
import { useGame } from '../context/GameContext';

export const Leaderboard: React.FC = () => {
    const { room, player } = useGame();

    if (!room || !player) return null;

    const sortedPlayers = [...room.players].sort((a, b) => b.progress - a.progress);

    return (
        <div className="leaderboard-container">
            <h3>🏆 LIVE STANDINGS</h3>
            <div className="players-list">
                {sortedPlayers.map((p, index) => (
                    <div key={p.id} className={`player-row ${p.id === player.id ? 'me' : ''}`}>
                        <div className="player-info">
                            <span className="rank">#{index + 1}</span>
                            <span className="avatar">{p.avatar}</span>
                            <span className="name">{p.username} {p.id === player.id && '(YOU)'}</span>
                        </div>
                        <div className="player-stats">
                            <span className="wpm">{p.wpm} WPM</span>
                            <span className="progress-text">{Math.round(p.progress)}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${p.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
