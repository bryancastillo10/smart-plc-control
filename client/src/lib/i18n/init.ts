import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "@/lib/i18n/en-US";
import zhTW from "@/lib/i18n/zh-TW";

i18next.use(initReactI18next).init({
	resources: {
		"en-US": {
			translation: enUS,
		},
		"zh-TW": {
			translation: zhTW,
		},
	},
	lng: "en-US",
	fallbackLng: "en-US",
	supportedLngs: ["en-US", "zh-TW"],
	interpolation: {
		escapeValue: false,
	},
});
