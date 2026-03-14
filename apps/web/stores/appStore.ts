import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  goal?: 'diet' | 'muscle';
}

export type UserGoal = 'diet' | 'health' | 'muscle';

interface AppState {
  user: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  userGoal: UserGoal | null;
  showGoalSettings: boolean;
  activeWorkoutId: string | null;
  setUser: (user: UserProfile | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUserGoal: (goal: UserGoal | null) => void;
  setShowGoalSettings: (show: boolean) => void;
  setActiveWorkoutId: (id: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isGuest: false,
  isLoading: true,
  userGoal: null,
  showGoalSettings: false,
  activeWorkoutId: null,
  setUser: (user) => set({ user, isGuest: false }),
  setGuest: (isGuest) => set({ isGuest, user: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setUserGoal: (goal) => set({ userGoal: goal }),
  setShowGoalSettings: (show) => set({ showGoalSettings: show }),
  setActiveWorkoutId: (id) => set({ activeWorkoutId: id }),
  logout: () => set({ user: null, isGuest: false, userGoal: null, showGoalSettings: false }),
}));
