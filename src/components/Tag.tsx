interface TagProps {
  children: string;
  className?: string;
}

export default function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block rounded-md border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-foreground/70 ${className}`}
    >
      {children}
    </span>
  );
}
