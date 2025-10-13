import { PlayCircle, FolderOpen, LogOut } from 'lucide-react';
import { Profile } from '../types';

interface HomeScreenProps {
  profile: Profile;
  onStartNewSession: () => void;
  onLoadSession: () => void;
  onLogout: () => void;
}

export function HomeScreen({ profile, onStartNewSession, onLoadSession, onLogout }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-amber-100 px-4 py-2 rounded-full mb-4">
              <p className="text-amber-800 font-medium">Hola, {profile.name}!</p>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Observador d'Ocells
            </h1>
            <p className="text-gray-600">
              Què vols fer avui?
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onStartNewSession}
              className="w-full p-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">Iniciar sessió</p>
                  <p className="text-amber-100 text-sm">Comença una nova observació</p>
                </div>
              </div>
            </button>

            <button
              onClick={onLoadSession}
              className="w-full p-6 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">Carregar sessió</p>
                  <p className="text-sky-100 text-sm">Veure o editar sessions anteriors</p>
                </div>
              </div>
            </button>
          </div>

          <button
            onClick={onLogout}
            className="w-full mt-8 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Canviar de perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
