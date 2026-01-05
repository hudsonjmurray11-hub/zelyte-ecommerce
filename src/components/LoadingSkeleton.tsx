import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'image' | 'card' | 'button';
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  variant = 'text',
  lines = 1 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  if (variant === 'image') {
    return <div className={`${baseClasses} ${className}`} aria-label="Loading image" />;
  }
  
  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${className}`} role="status" aria-label="Loading content">
        <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (variant === 'button') {
    return <div className={`${baseClasses} h-10 ${className}`} aria-label="Loading button" />;
  }
  
  // Text variant
  return (
    <div role="status" aria-label="Loading content" className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} h-4 mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;

