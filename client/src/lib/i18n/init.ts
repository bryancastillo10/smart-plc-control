import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
	resources: {
		"en-US": {
			translation: {
				dashboard: "Dashboard",
				signIn: "Sign in",
				language: "Language",
				heroBadge: "Industrial Monitoring Platform",
				heroTitle: "Operate your PLC systems with confidence and clarity.",
				heroDescription:
					"Smart PLC Control gives your team one dashboard for live plant telemetry, valve behavior, and safer control decisions.",
				heroLaunchDashboard: "Launch Dashboard",
				heroExploreFeatures: "Explore Features",
				now: "Current date and time are {{currentDateTime, datetime}}",
			},
		},
		"zh-TW": {
			translation: {
				dashboard: "儀表板",
				signIn: "登入",
				language: "語言",
				heroBadge: "工業監控平台",
				heroTitle: "自信且清晰地操作您的 PLC 系統。",
				heroDescription:
					"Smart PLC Control 為團隊提供單一儀表板，用於即時廠區遙測、閥門行為分析與更安全的控制決策。",
				heroLaunchDashboard: "啟動儀表板",
				heroExploreFeatures: "探索功能",
				now: "目前日期時間是 {{currentDateTime, datetime}}",
			},
		},
	},
	lng: "en-US",
	fallbackLng: "en-US",
	supportedLngs: ["en-US", "zh-TW"],
	interpolation: {
		escapeValue: false,
	},
});
