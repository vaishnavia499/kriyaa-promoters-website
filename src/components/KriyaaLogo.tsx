import React from 'react';

interface KriyaaLogoProps {
  className?: string;
  alt?: string;
}

export const KriyaaLogo: React.FC<KriyaaLogoProps> = ({
  className = 'w-full h-full',
  alt = 'Kriyaa Promoters Logo',
}) => {
  return (
    <img
      src="/kriyaa-logo.png"
      onError={(e) => {
        // Fallback to jpg if png cannot be resolved
        const target = e.currentTarget;
        if (!target.src.endsWith('/kriyaa-logo.jpg')) {
          target.src = '/kriyaa-logo.jpg';
        }
      }}
      alt={alt}
      className={`${className} object-contain`}
      draggable={false}
    />
  );
};
