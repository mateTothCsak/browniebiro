'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import type { Restaurant } from '@/types';
import { scoreClass } from '@/lib/data';

interface LeafletMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (r: Restaurant) => void;
}

export default function LeafletMap({ restaurants, selectedId, onSelect }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(containerRef.current!, {
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
      setTimeout(() => map.invalidateSize(), 60);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    import('leaflet').then((L) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      restaurants.forEach((r) => {
        const cls = scoreClass(r.score);
        const isSelected = r.id === selectedId;
        const html = `
          <div class="map-pin-leaflet">
            ${r.score >= 4.7 ? '<span class="pin-pulse"></span>' : ''}
            <div class="pin-body ${cls}${isSelected ? ' selected' : ''}">
              <span style="font-size:9px">★</span>${r.score.toFixed(1)}
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
  }, [restaurants, selectedId, onSelect]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, background: 'var(--bb-cream)' }}
    />
  );
}
