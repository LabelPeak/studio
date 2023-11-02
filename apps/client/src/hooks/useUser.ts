import { Nullable } from "@/interfaces/common";
import { User } from "@/interfaces/user";
import { create } from "zustand";

interface UserState extends Nullable<User> {
  setUser: (value: Partial<User>) => void;
  reset: () => void;
}

const useUser = create<UserState>((set) => ({
  id: null,
  username: null,
  realname: null,
  isAdmin: null,
  setUser: (value) => set({ ...value }),
  reset: () => set({
    id: null,
    username: null,
    realname: null,
    isAdmin: null
  })
}));

export default useUser;