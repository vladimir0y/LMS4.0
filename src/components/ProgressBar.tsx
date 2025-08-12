'use client';

import React from 'react';

interface ProgressBarProps {
  /** The progress percentage (0-100) */
  progress: number;
  /** Optional size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional color variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Show percentage text */
  showPercentage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'default',
  showPercentage = false,
  className = ''
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'progress-bar',
    success: 'progress-bar progress-bar-success',
    warning: 'progress-bar progress-bar-warning',
    error: 'progress-bar progress-bar-error'
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-foreground/70">{Math.round(normalizedProgress)}%</span>
        </div>
      )}
      <div className={`progress-container ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} progress-bar-animated`}
          style={{ 
            width: `${normalizedProgress}%`,
            transition: 'width 0.5s ease-in-out'
          }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${Math.round(normalizedProgress)}%`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
