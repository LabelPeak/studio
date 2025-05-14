import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setAuthConfig: ({ token }: { token: string }) => void;
  reset: () => void;
}

export const AUTH_TOKEN_KEY = "@label-peak-studio/auth";

const useAuth = create<AuthState>()(
  persist(
    (set) => {
      return {
        token: null,
        setAuthConfig: function ({ token }) {
          set({ token });
        },
        reset: function () {
          set({ token: null });
        }
      };
    },
    {
      name: AUTH_TOKEN_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useAuth;
