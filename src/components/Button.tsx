import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  download?: boolean;
  target?: string;
  rel?: string;
}

export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
  download = false,
  target,
  rel,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg px-5 py-3 sm:px-6 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] touch-manipulation';
  
  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    secondary:
      'border border-border bg-transparent text-foreground hover:bg-muted focus:ring-foreground',
    ghost:
      'bg-transparent text-foreground hover:bg-muted/50 focus:ring-foreground',
  };

  const styles = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    // External links or download links
    if (href.startsWith('http') || href.startsWith('mailto:') || download) {
      return (
        <a
          href={href}
          className={styles}
          download={download}
          target={target}
          rel={rel}
        >
          {children}
        </a>
      );
    }
    // Internal Next.js links
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
