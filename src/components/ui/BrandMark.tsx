interface BrandMarkProps {
  size?: number;
  color?: string;
}

export default function BrandMark({ size = 28, color = 'currentColor' }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="3" y="9" width="26" height="18" rx="4" fill={color} />
      <path d="M3 13 Q8 10 12 13 T22 13 T29 13" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none" />
      <circle cx="10" cy="18" r="1.4" fill="rgba(255,255,255,0.35)" />
      <circle cx="18" cy="20" r="1.1" fill="rgba(255,255,255,0.30)" />
      <circle cx="22" cy="16" r="1.2" fill="rgba(255,255,255,0.32)" />
      <path d="M9 9 L12 4 L16 8 L20 4 L23 9 Z" fill={color} />
    </svg>
  );
}
