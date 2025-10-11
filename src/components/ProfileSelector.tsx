import { useState, useEffect } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { Profile } from '../types';
import { db } from '../lib/indexeddb';

interface ProfileSelectorProps {
  onProfileSelected: (profile: Profile) => void;
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    async function setupAndLoad() {
    await indexedDBService.init(); // Ensure initialization
    await loadProfiles();
  }

  }, []);

  const loadProfiles = async () => {
    await db.open();
    const loadedProfiles = await db.getProfiles();
    setProfiles(loadedProfiles);
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name: newProfileName.trim(),
      created_at: new Date().toISOString(),
    };

    await db.addProfile(newProfile);
    onProfileSelected(newProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-100 p-4 rounded-full">
              <Users className="w-12 h-12 text-emerald-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Observador d'Ocells
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Selecciona o crea un perfil
          </p>

          {!showNewProfile ? (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onProfileSelected(profile)}
                  className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {profile.name}
                  </span>
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowNewProfile(true)}
                className="w-full p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Crear nou perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom del perfil
                </label>
                <input
                  type="text"
                  id="profileName"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Introdueix el teu nom"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProfile(false);
                    setNewProfileName('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  disabled={!newProfileName.trim()}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
