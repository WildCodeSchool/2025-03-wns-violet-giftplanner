import { create } from "zustand";
import { defaultPictureProfile } from "../data/pictureDefault";
import type { Users } from "../generated/graphql-types";

type State = {
  userProfile: null | Users;
  setUserProfile: (user: null | Users) => void;
  clearUserProfile: () => void;
};
export const useMyProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (newUser: Users | null) =>
    set(() => ({
      userProfile: newUser
        ? ({
            ...newUser,
            image_url: newUser.image_url ? `/service/picture/${newUser.image_url}` : defaultPictureProfile,
          } as Users)
        : null,
    })),
  clearUserProfile: () => set({ userProfile: null }),
}));
// export const userProfil = () => useUserStore((set) => set.user);
// export const setUserProfil = () => useUserStore((set) => set.setProfil);
// export const clearUserProfil = () => useUserStore((set) => set.logout);
