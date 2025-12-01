import React from 'react';
import { useGame } from '../context/GameContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { error } = useGame();

    return (
        <div className="app-container">
            <div className="background-grid"></div>
            <header className="app-header">
                <div className="logo">TYPE BATTLE</div>
            </header>
            <main className="app-content">
                {children}
            </main>
            {error && (
                <div className="error-toast">
                    {error}
                </div>
            )}
        </div>
    );
};
