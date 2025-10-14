import { useState, useEffect } from 'react';
import { UserPlus, Users, Trash2 } from 'lucide-react';
import { Profile } from '../types';
import { db } from '../lib/indexeddb';

interface ProfileSelectorProps {
  onProfileSelected: (profile: Profile) => void;
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [deleteConfirmProfile, setDeleteConfirmProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfiles();


  }, []);

  const loadProfiles = async () => {
    await db.init();
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

  const handleDeleteProfile = async (profileId: string) => {
    await db.deleteProfile(profileId);
    setDeleteConfirmProfile(null);
    await loadProfiles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-100 p-4 rounded-full">
              <Users className="w-12 h-12 text-amber-600" />
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
                <div
                  key={profile.id}
                  className="w-full p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <button
                    onClick={() => onProfileSelected(profile)}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {profile.name}
                    </span>
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmProfile(profile);
                    }}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar perfil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowNewProfile(true)}
                className="w-full p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl transition-colors flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {deleteConfirmProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Eliminar Perfil</h3>
            <p className="text-gray-600 mb-6">
              Estàs segur que vols eliminar el perfil <strong>{deleteConfirmProfile.name}</strong>?
              Aquesta acció eliminarà totes les sessions i observacions associades i no es pot desfer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmProfile(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel·lar
              </button>
              <button
                onClick={() => handleDeleteProfile(deleteConfirmProfile.id)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
