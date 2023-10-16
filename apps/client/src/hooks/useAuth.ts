import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  setAuthConfig: (
    { token }: { token: string }
  ) => void;
  reset: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => {
      return {
        token: null,
        setAuthConfig: function({ token }) {
          set({ token });
        },
        reset: function() {
          set({ token: null });
        }
      };
    }, {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;