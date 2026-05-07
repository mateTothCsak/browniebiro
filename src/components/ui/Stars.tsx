interface StarsProps {
  value: number;
  size?: 'sm' | 'lg' | 'xl';
  interactive?: boolean;
  onRate?: (n: number) => void;
}

export default function Stars({ value, size = 'sm', interactive = false, onRate }: StarsProps) {
  const sizeClass = size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : '';

  return (
    <span className={`bb-stars ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={i <= Math.round(value) ? 'filled' : 'empty'}
          onClick={interactive && onRate ? () => onRate(i) : undefined}
          style={interactive ? { cursor: 'pointer' } : undefined}
        >
          <path d="M12 2.5l2.92 6.05 6.58.94-4.78 4.55 1.16 6.46L12 17.6l-5.88 2.9 1.16-6.46L2.5 9.49l6.58-.94L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}
