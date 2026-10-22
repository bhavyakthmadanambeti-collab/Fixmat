import React from 'react';

interface AvatarBProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customUrl?: string;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
}

export const AvatarB: React.FC<AvatarBProps> = ({
  size = 'md',
  customUrl,
  className = '',
  onClick,
  showBadge = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl font-bold',
    xl: 'w-24 h-24 text-4xl font-extrabold',
  };

  const badgeSizes = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0',
    md: 'w-3 h-3 right-0 bottom-0',
    lg: 'w-4 h-4 right-0.5 bottom-0.5',
    xl: 'w-6 h-6 right-1 bottom-1',
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      {customUrl ? (
        <img
          src={customUrl}
          alt="Bhavyakth - Founder & Developer"
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-sky-500/30 shadow-sm`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-heading tracking-tight shadow-md ring-2 ring-white select-none`}
        >
          <span>B</span>
        </div>
      )}

      {showBadge && (
        <span
          className={`absolute ${badgeSizes[size]} bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-600/20`}
          title="Verified Founder & App Developer"
        />
      )}
    </div>
  );
};
