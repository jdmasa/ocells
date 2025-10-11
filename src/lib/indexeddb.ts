import { Profile, ObservationSession, Observation } from '../types';

const DB_NAME = 'BirdTrackerDB';
const DB_VERSION = 1;

const STORES = {
  PROFILES: 'profiles',
  SESSIONS: 'sessions',
  OBSERVATIONS: 'observations',
};

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.PROFILES)) {
          db.createObjectStore(STORES.PROFILES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionsStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
          sessionsStore.createIndex('profile_id', 'profile_id', { unique: false });
          sessionsStore.createIndex('start_time', 'start_time', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.OBSERVATIONS)) {
          const observationsStore = db.createObjectStore(STORES.OBSERVATIONS, { keyPath: 'id' });
          observationsStore.createIndex('session_id', 'session_id', { unique: false });
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async addProfile(profile: Profile): Promise<void> {
    const store = this.getStore(STORES.PROFILES, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(profile);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProfiles(): Promise<Profile[]> {
    const store = this.getStore(STORES.PROFILES);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addSession(session: ObservationSession): Promise<void> {
    const store = this.getStore(STORES.SESSIONS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateSession(session: ObservationSession): Promise<void> {
    const store = this.getStore(STORES.SESSIONS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSessionsByProfile(profileId: string): Promise<ObservationSession[]> {
    const store = this.getStore(STORES.SESSIONS);
    const index = store.index('profile_id');
    return new Promise((resolve, reject) => {
      const request = index.getAll(profileId);
      request.onsuccess = () => {
        const sessions = request.result.sort((a, b) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
        resolve(sessions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getSession(sessionId: string): Promise<ObservationSession | null> {
    const store = this.getStore(STORES.SESSIONS);
    return new Promise((resolve, reject) => {
      const request = store.get(sessionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async addObservation(observation: Observation): Promise<void> {
    const store = this.getStore(STORES.OBSERVATIONS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(observation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateObservation(observation: Observation): Promise<void> {
    const store = this.getStore(STORES.OBSERVATIONS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(observation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getObservationsBySession(sessionId: string): Promise<Observation[]> {
    const store = this.getStore(STORES.OBSERVATIONS);
    const index = store.index('session_id');
    return new Promise((resolve, reject) => {
      const request = index.getAll(sessionId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteObservation(observationId: string): Promise<void> {
    const store = this.getStore(STORES.OBSERVATIONS, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(observationId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const db = new IndexedDBService();
