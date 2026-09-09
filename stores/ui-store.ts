import { create } from "zustand";

type UIState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  /** header inverts to the night palette while a dark section is under it */
  headerInverted: boolean;
  setHeaderInverted: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  headerInverted: false,
  setHeaderInverted: (v) => set({ headerInverted: v }),
}));
