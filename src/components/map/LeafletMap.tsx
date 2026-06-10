'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMapInstance, Marker } from 'leaflet';
import type { Restaurant } from '@/types';
import { scoreClass } from '@/lib/data';

interface LeafletMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (r: Restaurant) => void;
}

export default function LeafletMap({ restaurants, selectedId, onSelect }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Marker[]>([]);
  // Flipped once the async Leaflet import finishes, so the marker effect
  // re-runs after the map actually exists (it races the import otherwise).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // `cancelled` guards the StrictMode double-mount: the first mount's
    // pending import must not create a second map in the same container.
    let cancelled = false;
    let map: LeafletMapInstance | null = null;

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      map = L.map(containerRef.current, {
        center: [47.16, 19.50],
        zoom: 7,
        minZoom: 6,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: true,
        maxBounds: [[45.5, 15.8], [48.8, 23.1]],
        maxBoundsViscosity: 0.7,
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setTimeout(() => map?.invalidateSize(), 60);
      setReady(true);
    });

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || mapRef.current !== map) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      restaurants.forEach((r) => {
        const cls = scoreClass(r.reviews > 0 ? r.score : 0);
        const isSelected = r.id === selectedId;
        const label = r.reviews > 0
          ? `<span style="font-size:9px">★</span>${r.score.toFixed(1)}`
          : 'Új';
        const html = `
          <div class="map-pin-leaflet">
            ${r.reviews > 0 && r.score >= 4.7 ? '<span class="pin-pulse"></span>' : ''}
            <div class="pin-body ${cls}${isSelected ? ' selected' : ''}">
              ${label}
            </div>
          </div>`;

        const icon = L.divIcon({
          className: 'bb-leaflet-icon',
          html,
          iconSize: [54, 26],
          iconAnchor: [27, 26],
        });

        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
        marker.on('click', () => onSelect(r));
        markersRef.current.push(marker);
      });
    });

    return () => { cancelled = true; };
  }, [restaurants, selectedId, onSelect, ready]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, background: 'var(--bb-cream)' }}
    />
  );
}
