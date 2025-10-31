import { create } from "zustand";
import { defaultPictureProfile } from "../data/pictureDefault";
import type { GetMeProfileQuery } from "../generated/graphql-types";

type State = {
  userProfile: null | UserProfil;
  setUserProfile: (user: null | UserProfil) => void;
  clearUserProfile: () => void;
};

type UserProfil = GetMeProfileQuery["getMeProfile"];

export const useMyProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (newUser: UserProfil | null) =>
    set(() => ({
      userProfile: newUser
        ? ({
            ...newUser,
            image_url: newUser.image_url ? `/service/picture/${newUser.image_url}` : defaultPictureProfile,
          } as UserProfil)
        : null,
    })),
  clearUserProfile: () => set({ userProfile: null }),
}));
// export const userProfil = () => useUserStore((set) => set.user);
// export const setUserProfil = () => useUserStore((set) => set.setProfil);
// export const clearUserProfil = () => useUserStore((set) => set.logout);
