import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  goal?: 'diet' | 'muscle';
}

interface AppState {
  user: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  activeWorkoutId: string | null;
  setUser: (user: UserProfile | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveWorkoutId: (id: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isGuest: false,
  isLoading: true,
  activeWorkoutId: null,
  setUser: (user) => set({ user, isGuest: false }), // Reset guest if real user logs in
  setGuest: (isGuest) => set({ isGuest, user: null }), // Clear user if guest logs in
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveWorkoutId: (id) => set({ activeWorkoutId: id }),
  logout: () => set({ user: null, isGuest: false }),
}));
