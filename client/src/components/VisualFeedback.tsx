import React, { useState, useEffect } from 'react';
import './VisualFeedback.css';

interface ClickRippleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const ClickRipple: React.FC<ClickRippleProps> = ({ x, y, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="click-ripple"
      style={{ 
        left: x - 25, 
        top: y - 25 
      }}
    />
  );
};

interface SuccessBurstProps {
  onComplete: () => void;
}

export const SuccessBurst: React.FC<SuccessBurstProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="success-burst">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="burst-particle"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-20px)`
          }}
        />
      ))}
    </div>
  );
};

interface PowerBarProps {
  power: number;
  maxPower: number;
}

export const PowerBar: React.FC<PowerBarProps> = ({ power, maxPower }) => {
  const percentage = (power / maxPower) * 100;
  
  return (
    <div className="power-bar">
      <div className="power-bar-bg">
        <div 
          className="power-bar-fill"
          style={{ 
            width: `${percentage}%`,
            background: percentage > 80 ? 'var(--secondary)' : 
                       percentage > 50 ? 'var(--gold)' : 
                       'var(--primary)'
          }}
        />
      </div>
      <div className="power-bar-glow" style={{ width: `${percentage}%` }} />
    </div>
  );
};

interface ComboIndicatorProps {
  combo: number;
  maxCombo: number;
}

export const ComboIndicator: React.FC<ComboIndicatorProps> = ({ combo }) => {
  const [showCombo, setShowCombo] = useState(false);
  
  useEffect(() => {
    if (combo > 1) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  if (!showCombo || combo <= 1) return null;

  return (
    <div className={`combo-indicator combo-${Math.min(combo, 10)}`}>
      <div className="combo-text">{combo}x COMBO!</div>
      <div className="combo-particles">
        {[...Array(Math.min(combo, 6))].map((_, i) => (
          <div 
            key={i}
            className="combo-particle"
            style={{
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface SpeedLinesProps {
  active: boolean;
}

export const SpeedLines: React.FC<SpeedLinesProps> = ({ active }) => {
  if (!active) return null;

  return (
    <div className="speed-lines">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className="speed-line"
          style={{
            top: `${20 + i * 15}%`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  );
};

export const useVisualFeedback = () => {
  const [clicks, setClicks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [successes, setSuccesses] = useState<Array<{ id: number }>>([]);

  const addClick = (x: number, y: number) => {
    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== id));
    }, 600);
  };

  const addSuccess = () => {
    const id = Date.now();
    setSuccesses(prev => [...prev, { id }]);
    
    setTimeout(() => {
      setSuccesses(prev => prev.filter(success => success.id !== id));
    }, 1000);
  };

  const ClickRipples = () => (
    <>
      {clicks.map(click => (
        <ClickRipple
          key={click.id}
          x={click.x}
          y={click.y}
          onComplete={() => {
            setClicks(prev => prev.filter(c => c.id !== click.id));
          }}
        />
      ))}
    </>
  );

  const SuccessBursts = () => (
    <>
      {successes.map(success => (
        <SuccessBurst
          key={success.id}
          onComplete={() => {
            setSuccesses(prev => prev.filter(s => s.id !== success.id));
          }}
        />
      ))}
    </>
  );

  return {
    addClick,
    addSuccess,
    ClickRipples,
    SuccessBursts
  };
};