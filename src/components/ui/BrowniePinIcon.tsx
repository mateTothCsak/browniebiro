import Image from 'next/image';

// The brownie mark used on sidebar tiles and the detail hero.
// (The Leaflet map pins use a plain <img> in raw HTML — see LeafletMap.tsx.)
export default function BrowniePinIcon({ size = 24 }: { size?: number }) {
  return (
    <Image
      src="/brownie.png"
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
