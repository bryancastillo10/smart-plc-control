import { create } from "zustand";
import { persist } from "zustand/middleware";

import i18n, { i18nLanguageByApiLanguage } from "@/integrations/i18n";
import type { Language } from "@/types/enum";

export interface LanguageState {
	language: Language;
	setLanguage: (language: Language) => void;
	translateLanguage: (language?: Language) => Promise<void>;
}

export const useLanguageStore = create(
	persist<LanguageState>(
		(set, get) => ({
			language: "EN",
			setLanguage: (language) => {
				set({ language });
				void get().translateLanguage(language);
			},
			translateLanguage: async (language) => {
				const selectedLanguage = language ?? get().language;
				const i18nLanguage = i18nLanguageByApiLanguage[selectedLanguage];

				await i18n.changeLanguage(i18nLanguage);

				if (typeof document !== "undefined") {
					document.documentElement.lang = i18nLanguage;
				}
			},
		}),
		{
			name: "lang",
		},
	),
);
