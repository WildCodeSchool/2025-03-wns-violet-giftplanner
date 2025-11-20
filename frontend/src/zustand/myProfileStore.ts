import { create } from "zustand";
import { defaultPictureProfile } from "../data/pictureDefault";
import type { GetMyProfileQuery } from "../generated/graphql-types";

type State = {
  userProfile: null | UserProfil;
  setUserProfile: (user: null | UserProfil) => void;
  clearUserProfile: () => void;
};

type UserProfil = GetMyProfileQuery["getMyProfile"];

export const useMyProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (newUser: UserProfil | null) =>
    set(() => ({
      userProfile: newUser
        ? ({
            ...newUser,
            image_url: newUser.image_url
              ? `/service/picture/${newUser.image_url}`
              : defaultPictureProfile,
          } as UserProfil)
        : null,
    })),
  clearUserProfile: () => set({ userProfile: null }),
}));
