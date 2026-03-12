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
  isLoading: boolean;
  activeWorkoutId: string | null;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveWorkoutId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: true,
  activeWorkoutId: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveWorkoutId: (id) => set({ activeWorkoutId: id }),
}));
