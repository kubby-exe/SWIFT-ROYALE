import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/SoundManager';
import { useVisualFeedback } from './VisualFeedback';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { error } = useGame();
    const { ClickRipples, SuccessBursts } = useVisualFeedback();

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Play click sound
            soundManager.playClick();
            
            // Add visual feedback
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple-temp';
            ripple.style.left = e.clientX - 25 + 'px';
            ripple.style.top = e.clientY - 25 + 'px';
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="app-container">
            <div className="background-grid"></div>
            <div className="gradient-bg"></div>
            <div className="particles">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>
            <header className="app-header">
                <div className="logo">TYPE BATTLE</div>
            </header>
            <main className="app-content">
                {children}
            </main>
            <footer className="app-footer">
                <div className="credits">
                    Made with ❤️ by <span className="author-name">Kubiat</span>
                </div>
            </footer>
            {error && (
                <div className="error-toast">
                    {error}
                </div>
            )}
            <ClickRipples />
            <SuccessBursts />
        </div>
    );
};
