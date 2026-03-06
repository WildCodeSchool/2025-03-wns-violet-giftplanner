import { create } from "zustand";
import type { GetMyProfileQuery } from "../graphql/generated/graphql-types";

type State = {
  userProfile: null | UserProfile;
  setUserProfile: (user: null | UserProfile) => void;
  clearUserProfile: () => void;
};

export type UserProfile = GetMyProfileQuery["getMyProfile"];

export const useMyProfileStore = create<State>((set) => ({
  userProfile: null,
  setUserProfile: (newUser: UserProfile | null) =>
    set(() => ({
      userProfile: newUser
        ? ({
            ...newUser,
            image_url: newUser.image_url ? newUser.image_url : null,
          } as UserProfile)
        : null,
    })),
  clearUserProfile: () => set({ userProfile: null }),
}));
