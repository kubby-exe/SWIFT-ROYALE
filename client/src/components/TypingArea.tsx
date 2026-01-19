import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';

export const TypingArea: React.FC = () => {
    const { room, updateProgress } = useGame();
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!room) return null;

    const text = room.text;

    useEffect(() => {
        if (room.status === 'playing' && !startTime) {
            setStartTime(Date.now());
            inputRef.current?.focus();
        }
    }, [room.status, startTime]);

    const calculateStats = (currentInput: string) => {
        if (!startTime) return { wpm: 0, progress: 0 };

        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const correctChars = currentInput.split('').filter((char, i) => char === text[i]).length;
        const currentWpm = Math.round((correctChars / 5) / timeElapsed) || 0;
        const progress = Math.min(100, (correctChars / text.length) * 100);

        return { wpm: currentWpm, progress };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        const { wpm, progress } = calculateStats(value);
        setWpm(wpm);

        updateProgress(progress, wpm);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        // Optional: Show a toast or message
    };

const renderText = () => {
        // Add proper spacing and punctuation handling
        const words = text.split(' ');
        let charIndex = 0;
        
        return words.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
                {word.split('').map((char, index) => {
                    let className = 'char';
                    
                    // Add punctuation class for punctuation marks
                    if (/[.,!?;:'"]/.test(char)) {
                        className += ' punctuation';
                    }
                    
                    if (charIndex < input.length) {
                        className += input[charIndex] === char ? ' correct' : ' incorrect';
                    } else if (charIndex === input.length) {
                        className += ' current';
                    }
                    
                    const element = (
                        <span key={charIndex} className={className}>
                            {char}
                        </span>
                    );
                    charIndex++;
                    return element;
                })}
                {/* Add space between words */}
                {wordIndex < words.length - 1 && (
                    <span 
                        key={`space-${wordIndex}`} 
                        className={`char space${charIndex < input.length ? input[charIndex] === ' ' ? ' correct' : ' incorrect' : ''}${charIndex === input.length ? ' current' : ''}`}
                    >
                        {' '}
                    </span>
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className="game-container">
            <div className="card game-card">
                <div className="game-stats">
                    <div className="stat-item">
                        <span className="label">WPM</span>
                        <span className="value">{wpm}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">TIME</span>
                        <span className="value">{room.timer}s</span>
                    </div>
                </div>

                <div className="text-display" onClick={() => inputRef.current?.focus()}>
                    {renderText()}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    className="hidden-input"
                    value={input}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    autoFocus
                    disabled={room.status !== 'playing'}
                />

                {room.status === 'countdown' && (
                    <div className="overlay">
                        <div className="countdown-text">GET READY!</div>
                    </div>
                )}
            </div>
        </div>
    );
};
