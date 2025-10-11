import { Calendar, MapPin, Bird, ChevronRight } from 'lucide-react';
import { ObservationSession } from '../types';

interface SessionListProps {
  sessions: ObservationSession[];
  onSessionSelect: (sessionId: string) => void;
  onBack: () => void;
}

export function SessionList({ sessions, onSessionSelect, onBack }: SessionListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sessions Anteriors</h2>
          <p className="text-gray-600">Selecciona una sessió per veure o editar</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bird className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">No tens cap sessió guardada</p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Tornar a l'inici
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex items-center justify-between group"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">
                      {formatDate(session.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {session.location_lat.toFixed(4)}, {session.location_lng.toFixed(4)}
                      </span>
                    </div>
                    {session.end_time && (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                        Finalitzada
                      </span>
                    )}
                    {!session.end_time && (
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                        En curs
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </button>
            ))}

            <button
              onClick={onBack}
              className="w-full mt-6 p-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all font-medium"
            >
              Tornar a l'inici
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
