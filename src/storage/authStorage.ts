import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  id: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);