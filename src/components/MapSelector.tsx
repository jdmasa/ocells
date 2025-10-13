import { useEffect, useRef, useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapSelectorProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export function MapSelector({ initialLat, initialLng, onLocationSelect, onCancel }: MapSelectorProps) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="color: #ef4444; filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3" fill="white"></circle>
        </svg>
      </div>`,
      iconSize: [48, 48],
      iconAnchor: [24, 48],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setPosition({ lat: pos.lat, lng: pos.lng });
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setPosition({ lat, lng });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialLat, initialLng]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 bg-amber-600 text-white flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selecciona la ubicació
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-amber-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div
            ref={mapContainerRef}
            className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200"
          />

          <div className="mt-4 bg-gray-50 px-4 py-3 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">Coordenades seleccionades:</p>
            <div className="font-mono text-sm">
              <p className="text-gray-800">Lat: {position.lat.toFixed(6)}</p>
              <p className="text-gray-800">Lng: {position.lng.toFixed(6)}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Fes clic al mapa o arrossega el marcador</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel·lar
            </button>
            <button
              onClick={() => onLocationSelect(position.lat, position.lng)}
              className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirmar ubicació
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
