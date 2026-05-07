interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ name, size = 18, color, className }: IconProps) {
  const stroke = color || 'currentColor';
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24' as const,
    fill: 'none' as const,
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };

  switch (name) {
    case 'map':        return <svg {...props}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>;
    case 'list':       return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'trophy':     return <svg {...props}><path d="M6 4h12v4a6 6 0 11-12 0V4z"/><path d="M6 6H3a3 3 0 003 3M18 6h3a3 3 0 01-3 3M9 18h6M12 14v4"/></svg>;
    case 'user':       return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>;
    case 'search':     return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case 'arrow-right':return <svg {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case 'heart':      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
    case 'camera':     return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'calendar':   return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    case 'pin':        return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'check':      return <svg {...props}><path d="M20 6L9 17l-5-5"/></svg>;
    case 'x':          return <svg {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'crown':      return <svg {...props}><path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7z"/></svg>;
    case 'flame':      return <svg {...props}><path d="M12 2s6 4 6 10a6 6 0 11-12 0c0-2 1-4 2-5 0 2 1 3 2 3 0-3 2-6 2-8z"/></svg>;
    case 'filter':     return <svg {...props}><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/></svg>;
    case 'edit':       return <svg {...props}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>;
    default:           return null;
  }
}
