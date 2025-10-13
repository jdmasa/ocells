import { useState, useEffect } from 'react';
import { Menu, Home, Download, Clock, Save, MapPin, Plus } from 'lucide-react';
import { Observation } from '../types';
import { barcelonaBirds } from '../data/birds';
import { BirdCounter } from './BirdCounter';
import { MapSelector } from './MapSelector';

interface ObservationSessionProps {
  sessionId: string;
  startTime: string;
  endTime: string | null;
  location: { lat: number; lng: number };
  observations: Observation[];
  isEditMode: boolean;
  onObservationChange: (observations: Observation[]) => void;
  onEndSession: (endTime: string) => void;
  onSaveChanges: () => void;
  onModifyTimestamps: (startTime: string, endTime: string | null) => void;
  onModifyLocation: (lat: number, lng: number) => void;
  onDownloadCSV: () => void;
  onBackToHome: () => void;
}

export function ObservationSession({
  sessionId,
  startTime,
  endTime,
  location,
  observations,
  isEditMode,
  onObservationChange,
  onEndSession,
  onSaveChanges,
  onModifyTimestamps,
  onModifyLocation,
  onDownloadCSV,
  onBackToHome,
}: ObservationSessionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [showTimestampDialog, setShowTimestampDialog] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [showCustomBirdDialog, setShowCustomBirdDialog] = useState(false);
  const [customBirdName, setCustomBirdName] = useState('');
  const [localEndTime, setLocalEndTime] = useState('');
  const [localStartTime, setLocalStartTime] = useState('');
  const [localEndTimeEdit, setLocalEndTimeEdit] = useState('');

  useEffect(() => {
    const offset = new Date().getTimezoneOffset() * 60000;
    setLocalStartTime(new Date(new Date(startTime).getTime() - offset).toISOString().slice(0, 16));
    if (endTime) {
      setLocalEndTimeEdit(new Date(new Date(endTime).getTime() - offset).toISOString().slice(0, 16));
    }
  }, [startTime, endTime]);

  const handleBirdCountChange = (birdId: string, count: number, isCustom: boolean = false) => {
    const existingIndex = observations.findIndex((obs) => obs.bird_species === birdId);

    if (existingIndex >= 0) {
      if (count === 0) {
        onObservationChange(observations.filter((obs) => obs.bird_species !== birdId));
      } else {
        const updated = [...observations];
        updated[existingIndex] = { ...updated[existingIndex], count };
        onObservationChange(updated);
      }
    } else if (count > 0) {
      const newObservation: Observation = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        bird_species: birdId,
        count,
        is_custom: isCustom,
        created_at: new Date().toISOString(),
      };
      onObservationChange([...observations, newObservation]);
    }
  };

  const getBirdCount = (birdId: string): number => {
    const obs = observations.find((o) => o.bird_species === birdId);
    return obs ? obs.count : 0;
  };

  const handleAddCustomBird = () => {
    if (!customBirdName.trim()) return;
    handleBirdCountChange(customBirdName.trim(), 1, true);
    setShowCustomBirdDialog(false);
    setCustomBirdName('');
  };

  const customBirds = observations.filter((obs) => obs.is_custom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Sessió d'Observació</h1>
            <p className="text-sm text-gray-600">
              {new Date(startTime).toLocaleString('ca-ES', {dateStyle: 'short', timeStyle: 'short',})}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {!isEditMode && !endTime && (
                    <button
                      onClick={() => {
                        const now = new Date();
                        const offset = now.getTimezoneOffset() * 60000;
                        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
                        setLocalEndTime(localISOTime);
                        setShowEndSessionDialog(true);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Finalitzar sessió
                    </button>
                  )}

                  {isEditMode && (
                    <>
                      <button
                        onClick={() => {
                          onSaveChanges();
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Desar canvis
                      </button>
                      <button
                        onClick={() => {
                          setShowTimestampDialog(true);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        Modificar timestamps
                      </button>
                      <button
                        onClick={() => {
                          setShowMapSelector(true);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Modificar ubicació
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      onDownloadCSV();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descarregar CSV
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={() => {
                      onBackToHome();
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Tornar a l'inici
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {barcelonaBirds.map((bird) => (
            <BirdCounter
              key={bird.id}
              birdName={bird.name_ca}
              count={getBirdCount(bird.id)}
              onCountChange={(count) => handleBirdCountChange(bird.id, count)}
            />
          ))}

          {customBirds.map((customBird) => (
            <BirdCounter
              key={customBird.id}
              birdName={customBird.bird_species}
              count={customBird.count}
              isCustom
              onCountChange={(count) => handleBirdCountChange(customBird.bird_species, count, true)}
            />
          ))}

          <button
            onClick={() => setShowCustomBirdDialog(true)}
            className="aspect-square bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-dashed border-emerald-300 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 text-emerald-600"
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Afegir ocell</span>
          </button>
        </div>
      </div>

      {showEndSessionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Finalitzar Sessió</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data i hora de finalització
              </label>
              <input
                type="datetime-local"
                value={localEndTime}
                onChange={(e) => setLocalEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndSessionDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => {
                  onEndSession(localEndTime);
                  setShowEndSessionDialog(false);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Finalitzar
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimestampDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Modificar Timestamps</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data i hora d'inici
                </label>
                <input
                  type="datetime-local"
                  value={localStartTime}
                  onChange={(e) => setLocalStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data i hora de finalització
                </label>
                <input
                  type="datetime-local"
                  value={localEndTimeEdit}
                  onChange={(e) => setLocalEndTimeEdit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTimestampDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => {
                  onModifyTimestamps(localStartTime, localEndTimeEdit);
                  setShowTimestampDialog(false);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
              >
                Desar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomBirdDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Afegir Ocell Personalitzat</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'ocell
              </label>
              <input
                type="text"
                value={customBirdName}
                onChange={(e) => setCustomBirdName(e.target.value)}
                placeholder="Introdueix el nom"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomBirdDialog(false);
                  setCustomBirdName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel·lar
              </button>
              <button
                onClick={handleAddCustomBird}
                disabled={!customBirdName.trim()}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Afegir
              </button>
            </div>
          </div>
        </div>
      )}

      {showMapSelector && (
        <MapSelector
          initialLat={location.lat}
          initialLng={location.lng}
          onLocationSelect={(lat, lng) => {
            onModifyLocation(lat, lng);
            setShowMapSelector(false);
          }}
          onCancel={() => setShowMapSelector(false)}
        />
      )}
    </div>
  );
}
