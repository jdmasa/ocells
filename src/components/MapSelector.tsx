import { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';

interface MapSelectorProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export function MapSelector({ initialLat, initialLng, onLocationSelect, onCancel }: MapSelectorProps) {
  const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lng = initialLng + (x - rect.width / 2) * 0.0001;
    const lat = initialLat - (y - rect.height / 2) * 0.0001;

    setPosition({ lat, lng });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selecciona la ubicació
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div
            className="relative w-full h-96 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-xl cursor-crosshair overflow-hidden border-2 border-gray-200"
            onClick={handleMapClick}
          >
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-pulse">
                <MapPin className="w-12 h-12 text-red-500 drop-shadow-lg" fill="currentColor" />
              </div>
            </div>

            <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono">
              <p className="text-gray-600">Lat: {position.lat.toFixed(6)}</p>
              <p className="text-gray-600">Lng: {position.lng.toFixed(6)}</p>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
              Fes clic al mapa per seleccionar
            </div>
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
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors flex items-center justify-center gap-2"
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
