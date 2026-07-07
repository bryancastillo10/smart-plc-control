import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { en } from "./locales/en.ts"
import { zhTW } from "./locales/zh-TW.ts"

export const supportedLanguages = ["EN", "ZH-TW"] as const
export type Language = (typeof supportedLanguages)[number]

export const i18nLanguageByApiLanguage = {
	EN: "en",
	"ZH-TW": "zh-TW",
} satisfies Record<Language, string>

i18n.use(initReactI18next).init({
	resources: {
		en,
		"zh-TW": zhTW,
	},
	lng: "en",
	fallbackLng: "en",
	defaultNS: "login",
	ns: ["login", "toast"],
	supportedLngs: ["en", "zh-TW"],
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
