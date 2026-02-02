
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'cyan' | 'magenta' | 'default';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan': return 'bg-cyan-500/5 border-cyan-500/10';
      case 'magenta': return 'bg-magenta-500/5 border-magenta-500/10';
      default: return 'bg-white/5 border-white/5';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border animate-pulse ${getVariantStyles()} ${className}`}>
      <div className="absolute inset-0 animate-shimmer"></div>
    </div>
  );
};

export const AcademicSkeletonBlock: React.FC = () => (
  <div className="space-y-6 w-full">
    <Skeleton className="h-12 w-3/4 mb-10" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="py-8">
      <Skeleton className="h-64 w-full rounded-[3rem]" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-11/12" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);

export default Skeleton;
