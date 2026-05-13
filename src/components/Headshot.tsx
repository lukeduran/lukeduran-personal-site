import Image from 'next/image';

interface HeadshotProps {
  src: string;
  alt: string;
  className?: string;
}

export default function Headshot({ src, alt, className = '' }: HeadshotProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-3xl border-2 border-border/50 bg-muted/40 shadow-2xl aspect-square">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={400}
          className="h-full w-full object-cover object-[center_30%] grayscale-[10%] transition-all duration-700 hover:grayscale-0 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-foreground/5" />
        {/* Modern corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full" />
      </div>
    </div>
  );
}
