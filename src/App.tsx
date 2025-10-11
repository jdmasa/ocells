import { useState, useEffect } from 'react';
import { Profile, ObservationSession, Observation } from './types';
import { db } from './lib/indexeddb';
import { generateCSV, downloadCSV, createSessionCSVFilename } from './lib/csv-export';
import { ProfileSelector } from './components/ProfileSelector';
import { HomeScreen } from './components/HomeScreen';
import { NewSessionForm } from './components/NewSessionForm';
import { SessionList } from './components/SessionList';
import { ObservationSession as ObservationSessionComponent } from './components/ObservationSession';

type Screen =
  | { type: 'profile' }
  | { type: 'home' }
  | { type: 'new-session' }
  | { type: 'session-list' }
  | { type: 'active-session'; sessionId: string; isEditMode: boolean };

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'profile' });
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [currentSession, setCurrentSession] = useState<ObservationSession | null>(null);
  const [currentObservations, setCurrentObservations] = useState<Observation[]>([]);
  const [sessions, setSessions] = useState<ObservationSession[]>([]);

  useEffect(() => {
    db.init();
  }, []);

  const handleProfileSelected = (profile: Profile) => {
    setCurrentProfile(profile);
    setScreen({ type: 'home' });
  };

  const handleLogout = () => {
    setCurrentProfile(null);
    setCurrentSession(null);
    setCurrentObservations([]);
    setScreen({ type: 'profile' });
  };

  const handleStartNewSession = () => {
    setScreen({ type: 'new-session' });
  };

  const handleLoadSession = async () => {
    if (!currentProfile) return;
    const profileSessions = await db.getSessionsByProfile(currentProfile.id);
    setSessions(profileSessions);
    setScreen({ type: 'session-list' });
  };

  const handleSessionStart = async (startTime: string, lat: number, lng: number) => {
    if (!currentProfile) return;

    const newSession: ObservationSession = {
      id: crypto.randomUUID(),
      profile_id: currentProfile.id,
      start_time: new Date(startTime).toISOString(),
      end_time: null,
      location_lat: lat,
      location_lng: lng,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.addSession(newSession);
    setCurrentSession(newSession);
    setCurrentObservations([]);
    setScreen({ type: 'active-session', sessionId: newSession.id, isEditMode: false });
  };

  const handleSessionSelect = async (sessionId: string) => {
    const session = await db.getSession(sessionId);
    if (!session) return;

    const observations = await db.getObservationsBySession(sessionId);
    setCurrentSession(session);
    setCurrentObservations(observations);
    setScreen({ type: 'active-session', sessionId, isEditMode: true });
  };

  const handleObservationChange = (observations: Observation[]) => {
    setCurrentObservations(observations);
  };

  const handleEndSession = async (endTime: string) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      end_time: new Date(endTime).toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.updateSession(updatedSession);
    setCurrentSession(updatedSession);

    for (const obs of currentObservations) {
      const existingObs = await db.getObservationsBySession(currentSession.id);
      const existing = existingObs.find((o) => o.id === obs.id);

      if (existing) {
        await db.updateObservation(obs);
      } else {
        await db.addObservation(obs);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      updated_at: new Date().toISOString(),
    };

    await db.updateSession(updatedSession);

    const existingObservations = await db.getObservationsBySession(currentSession.id);

    for (const obs of currentObservations) {
      const existing = existingObservations.find((o) => o.id === obs.id);
      if (existing) {
        await db.updateObservation(obs);
      } else {
        await db.addObservation(obs);
      }
    }

    for (const existing of existingObservations) {
      if (!currentObservations.find((o) => o.id === existing.id)) {
        await db.deleteObservation(existing.id);
      }
    }

    setScreen({ type: 'home' });
  };

  const handleModifyTimestamps = async (startTime: string, endTime: string | null) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    await db.updateSession(updatedSession);
    setCurrentSession(updatedSession);
  };

  const handleModifyLocation = async (lat: number, lng: number) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      location_lat: lat,
      location_lng: lng,
      updated_at: new Date().toISOString(),
    };

    await db.updateSession(updatedSession);
    setCurrentSession(updatedSession);
  };

  const handleDownloadCSV = () => {
    if (!currentSession) return;

    const csvContent = generateCSV(currentSession, currentObservations);
    const filename = createSessionCSVFilename(currentSession);
    downloadCSV(filename, csvContent);
  };

  const handleBackToHome = () => {
    setCurrentSession(null);
    setCurrentObservations([]);
    setScreen({ type: 'home' });
  };

  if (screen.type === 'profile') {
    return <ProfileSelector onProfileSelected={handleProfileSelected} />;
  }

  if (screen.type === 'home' && currentProfile) {
    return (
      <HomeScreen
        profile={currentProfile}
        onStartNewSession={handleStartNewSession}
        onLoadSession={handleLoadSession}
        onLogout={handleLogout}
      />
    );
  }

  if (screen.type === 'new-session') {
    return (
      <NewSessionForm
        onSessionStart={handleSessionStart}
        onCancel={handleBackToHome}
      />
    );
  }

  if (screen.type === 'session-list') {
    return (
      <SessionList
        sessions={sessions}
        onSessionSelect={handleSessionSelect}
        onBack={handleBackToHome}
      />
    );
  }

  if (screen.type === 'active-session' && currentSession) {
    return (
      <ObservationSessionComponent
        sessionId={currentSession.id}
        startTime={currentSession.start_time}
        endTime={currentSession.end_time}
        location={{ lat: currentSession.location_lat, lng: currentSession.location_lng }}
        observations={currentObservations}
        isEditMode={screen.isEditMode}
        onObservationChange={handleObservationChange}
        onEndSession={handleEndSession}
        onSaveChanges={handleSaveChanges}
        onModifyTimestamps={handleModifyTimestamps}
        onModifyLocation={handleModifyLocation}
        onDownloadCSV={handleDownloadCSV}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return null;
}

export default App;
