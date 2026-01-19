import React from 'react';
import './LoadingStates.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary' 
}) => {
  return (
    <div className={`loading-spinner loading-${size} loading-${color}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-core"></div>
    </div>
  );
};

interface LoadingBarProps {
  progress: number;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ 
  progress, 
  showPercentage = true,
  color = 'primary' 
}) => {
  return (
    <div className={`loading-bar loading-${color}`}>
      <div className="loading-bar-track">
        <div 
          className="loading-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
        <div className="loading-bar-glow" />
      </div>
      {showPercentage && (
        <div className="loading-percentage">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

interface PulseLoaderProps {
  count?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({ 
  count = 3, 
  color = 'primary' 
}) => {
  return (
    <div className="pulse-loader">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i}
          className={`pulse-dot pulse-${color}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  width = '100%', 
  height = '20px',
  variant = 'rectangular' 
}) => {
  return (
    <div 
      className={`skeleton-loader skeleton-${variant}`}
      style={{ width, height }}
    />
  );
};

interface TypingIndicatorProps {
  isActive: boolean;
  message?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isActive, 
  message = 'Someone is typing...' 
}) => {
  if (!isActive) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
      <span className="typing-message">{message}</span>
    </div>
  );
};

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  seconds, 
  onComplete,
  size = 'medium' 
}) => {
  const [timeLeft, setTimeLeft] = React.useState(seconds);
  const isActive = React.useState(true)[0];

  React.useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && onComplete) {
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isActive, onComplete]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (timeLeft / seconds) * circumference;

  return (
    <div className={`countdown-timer countdown-${size}`}>
      <svg className="countdown-svg" width="100" height="100">
        <circle
          className="countdown-bg"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          className="countdown-progress"
          cx="50"
          cy="50"
          r="45"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="countdown-text">
        {timeLeft}
      </div>
    </div>
  );
};

interface PageTransitionProps {
  children: React.ReactNode;
  isEntering?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  isEntering = true 
}) => {
  return (
    <div className={`page-transition ${isEntering ? 'entering' : 'exiting'}`}>
      {children}
    </div>
  );
};

interface GlitchTextProps {
  text: string;
  isActive?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  isActive = true 
}) => {
  return (
    <div className={`glitch-text ${isActive ? 'active' : ''}`} data-text={text}>
      {text}
    </div>
  );
};

interface NeonTextProps {
  text: string;
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
  flicker?: boolean;
}

export const NeonText: React.FC<NeonTextProps> = ({ 
  text, 
  color = 'primary',
  flicker = false 
}) => {
  return (
    <div className={`neon-text neon-${color} ${flicker ? 'flicker' : ''}`}>
      {text}
    </div>
  );
};

export const LoadingStates = {
  LoadingSpinner,
  LoadingBar,
  PulseLoader,
  SkeletonLoader,
  TypingIndicator,
  CountdownTimer,
  PageTransition,
  GlitchText,
  NeonText
};