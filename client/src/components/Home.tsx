import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/SoundManager';
import { useVisualFeedback, ComboIndicator } from './VisualFeedback';
import { LoadingSpinner, NeonText } from './LoadingStates';

export const Home: React.FC = () => {
    const { createRoom, joinRoom } = useGame();
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [avatar, setAvatar] = useState('🤖');
    const [isLoading, setIsLoading] = useState(false);
    const [combo, setCombo] = useState(0);
    const { addSuccess } = useVisualFeedback();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && username && !isLoading) {
                handleCreate();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [username, isLoading]);

    const handleAvatarSelect = (selectedAvatar: string) => {
        setAvatar(selectedAvatar);
        soundManager.playClick();
        
        // Increment combo for quick avatar changes
        setCombo(prev => Math.min(prev + 1, 10));
        if (combo >= 3) {
            addSuccess();
        }
        
        setTimeout(() => setCombo(0), 2000);
    };

    const handleCreate = () => {
        console.log('🎮 Create room clicked:', { username, avatar, isLoading });
        if (!username || isLoading) {
            console.log('❌ Cannot create room:', { username: !!username, isLoading });
            return;
        }
        
        console.log('🚀 Starting room creation process...');
        setIsLoading(false); // Don't set to loading true
        soundManager.playClick();
        addSuccess();
        
        // Create room immediately - the socket event will handle the rest
        console.log('📡 Calling createRoom function...');
        createRoom(username, avatar);
    };

    const handleJoin = () => {
        if (!username || !roomId || isLoading) return;
        
        setIsLoading(false);
        soundManager.playClick();
        addSuccess();
        
        // Join room immediately
        joinRoom(roomId, username, avatar);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        
        // Play typing sound with throttling
        if (value.length > username.length) {
            soundManager.playType();
        }
    };

    const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        setRoomId(value);
        
        // Play typing sound with throttling
        if (value.length > roomId.length) {
            soundManager.playType();
        }
    };

    return (
        <div className="home-container">
            <ComboIndicator combo={combo} maxCombo={10} />
            
            <div className="card menu-card">
                <NeonText text="ENTER THE ARENA" color="primary" flicker />

                <div className="input-group">
                    <label>USERNAME</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="WARRIOR NAME"
                        maxLength={12}
                        disabled={isLoading}
                    />
                </div>

                <div className="avatar-selector">
                    {['🤖', '👽', '💀', '👾', '🤡', '👻'].map(emoji => (
                        <button
                            key={emoji}
                            className={`avatar-btn ${avatar === emoji ? 'selected' : ''}`}
                            onClick={() => handleAvatarSelect(emoji)}
                            disabled={isLoading}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="actions">
                    <button 
                        className="btn primary" 
                        onClick={handleCreate} 
                        disabled={!username || isLoading}
                    >
                        {isLoading ? <LoadingSpinner size="small" /> : 'CREATE ROOM'}
                    </button>

                    <div className="divider">OR</div>

                    <div className="join-group">
                        <input
                            type="text"
                            value={roomId}
                            onChange={handleRoomCodeChange}
                            placeholder="ROOM CODE"
                            maxLength={6}
                            disabled={isLoading}
                        />
                        <button 
                            className="btn secondary" 
                            onClick={handleJoin} 
                            disabled={!username || !roomId || isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="small" /> : 'JOIN'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
