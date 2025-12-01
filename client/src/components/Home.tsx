import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export const Home: React.FC = () => {
    const { createRoom, joinRoom } = useGame();
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [avatar, setAvatar] = useState('🤖'); // Default avatar

    const handleCreate = () => {
        if (!username) return;
        createRoom(username, avatar);
    };

    const handleJoin = () => {
        if (!username || !roomId) return;
        joinRoom(roomId, username, avatar);
    };

    return (
        <div className="home-container">
            <div className="card menu-card">
                <h2>ENTER THE ARENA</h2>

                <div className="input-group">
                    <label>USERNAME</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="WARRIOR NAME"
                        maxLength={12}
                    />
                </div>

                <div className="avatar-selector">
                    {['🤖', '👽', '💀', '👾', '🤡', '👻'].map(emoji => (
                        <button
                            key={emoji}
                            className={`avatar-btn ${avatar === emoji ? 'selected' : ''}`}
                            onClick={() => setAvatar(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="actions">
                    <button className="btn primary" onClick={handleCreate} disabled={!username}>
                        CREATE ROOM
                    </button>

                    <div className="divider">OR</div>

                    <div className="join-group">
                        <input
                            type="text"
                            value={roomId}
                            onChange={e => setRoomId(e.target.value.toUpperCase())}
                            placeholder="ROOM CODE"
                            maxLength={6}
                        />
                        <button className="btn secondary" onClick={handleJoin} disabled={!username || !roomId}>
                            JOIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
