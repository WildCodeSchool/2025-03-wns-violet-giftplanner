import { create } from "zustand";
import type { Users } from "../generated/graphql-types";

type State = {
  userProfile: null | Users;
  setUserProfile: (user: null | Users) => void;
  clearUserProfile: () => void;
};
export const useMyProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (newUser) => set(() => ({ userProfile: newUser })),
  clearUserProfile: () => set({ userProfile: null }),
}));

// export const userProfil = () => useUserStore((set) => set.user);
// export const setUserProfil = () => useUserStore((set) => set.setProfil);
// export const clearUserProfil = () => useUserStore((set) => set.logout);
