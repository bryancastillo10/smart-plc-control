import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/types/user";

type UserState = {
	authUser: User | null;
	setAuthUser: (user: User) => void;
	clearAuthUser: () => void;
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			authUser: null,
			setAuthUser: (user) => {
				set({ authUser: user });
			},
			clearAuthUser: () => {
				set({ authUser: null });
			},
		}),
		{
			name: "authUser",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				authUser: state.authUser,
			}),
		},
	),
);
