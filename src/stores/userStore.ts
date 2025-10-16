import { create } from "zustand";

interface User {
  username: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null;
  displayUsername: string | null;
}

interface UserState {
  user: User | null;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...user } : ({ ...user } as User),
    })),
  clearUser: () => set({ user: null }),
}));
