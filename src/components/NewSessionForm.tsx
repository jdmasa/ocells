import { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { MapSelector } from './MapSelector';

interface NewSessionFormProps {
  onSessionStart: (startTime: string, lat: number, lng: number) => void;
  onCancel: () => void;
  initialStartTime?: string;
  initialLat?: number;
  initialLng?: number;
}

export function NewSessionForm({
  onSessionStart,
  onCancel,
  initialStartTime,
  initialLat,
  initialLng
}: NewSessionFormProps) {
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (initialStartTime) {
      setStartTime(initialStartTime);
    } else {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
      setStartTime(localISOTime);
    }

    if (initialLat !== undefined && initialLng !== undefined) {
      setLocation({ lat: initialLat, lng: initialLng });
    } else {
      getCurrentLocation();
    }
  }, [initialStartTime, initialLat, initialLng]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocation({ lat: 41.3851, lng: 2.1734 });
          setIsLoadingLocation(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      setLocation({ lat: 41.3851, lng: 2.1734 });
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && startTime) {
      onSessionStart(startTime, location.lat, location.lng);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setShowMap(false);
  };

  if (showMap) {
    return (
      <MapSelector
        initialLat={location?.lat || 41.3851}
        initialLng={location?.lng || 2.1734}
        onLocationSelect={handleLocationSelect}
        onCancel={() => setShowMap(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Nova Sessió d'Observació
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data i hora d'inici
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ubicació
              </label>
              <div className="bg-gray-50 rounded-xl p-4 mb-3">
                {isLoadingLocation ? (
                  <p className="text-gray-600 text-sm">Obtenint ubicació...</p>
                ) : location ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-mono">Lat: {location.lat.toFixed(6)}</p>
                    <p className="font-mono">Lng: {location.lng.toFixed(6)}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Ubicació no disponible</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="w-full px-4 py-2 border border-amber-500 text-amber-600 rounded-xl hover:bg-amber-50 transition-colors font-medium"
              >
                Seleccionar ubicació al mapa
              </button>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel·lar
              </button>
              <button
                type="submit"
                disabled={!location || !startTime}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
              >
                Començar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
