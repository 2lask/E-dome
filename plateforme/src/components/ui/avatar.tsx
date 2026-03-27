'use client';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, firstName, lastName, size = 'md', className, online }: AvatarProps) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`;

  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className={cn('rounded-full object-cover', sizes[size])}
          loading="lazy"
        />
      ) : (
        <div className={cn(
          'rounded-full bg-gradient-to-br from-[#C4956A]/20 to-[#C4956A]/5 flex items-center justify-center font-semibold text-[#C4956A]',
          sizes[size]
        )}>
          {initials}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080808]" />
      )}
    </div>
  );
}
