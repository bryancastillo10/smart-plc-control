import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Language } from "@/types/enum";

export interface LanguageState {
	language: Language;
	setLanguage: (language: Language) => void;
}

export const useLanguageStore = create(
	persist<LanguageState>(
		(set) => ({
			language: "EN",
			setLanguage: (language) => set({ language }),
		}),
		{
			name: "language",
		},
	),
);
