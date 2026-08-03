import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useLanguageStore } from "@/store/language";
import type { UserProfile } from "@/types/user";

export interface AuthState {
	user: UserProfile | null;
	setUser: (user: UserProfile) => void;
	clearUser: () => void;
	markPlantSetupComplete: () => void;
	validateAuth: () => boolean;
}

export const useUserStore = create(
	persist<AuthState>(
		(set, get) => ({
			user: null,
			setUser: (user) => {
				set({ user });
				useLanguageStore.getState().setLanguage(user.language);
			},
			clearUser: () => set({ user: null }),
			markPlantSetupComplete: () =>
				set((state) => ({
					user: state.user ? { ...state.user, hasOwnedPlant: true } : null,
				})),
			validateAuth: () => get().user !== null,
		}),
		{
			name: "auth",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
