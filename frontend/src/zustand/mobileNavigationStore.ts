import { create } from "zustand";

type MobileNavigationState = {
  isBottomNavVisible: boolean;
  setBottomNavVisible: (visible: boolean) => void;
};

export const useMobileNavigationStore = create<MobileNavigationState>((set) => ({
  isBottomNavVisible: true,
  setBottomNavVisible: (visible: boolean) => set({ isBottomNavVisible: visible }),
}));
