export const zhTW = {
	login: {
		appName: "ProcessPulse",
		kicker: "廢水處理程序控制",
		title: "登入控制平台",
		subtitle: "安全存取廢水處理監控、PLC 連線、警報與操作管理。",
		username: "使用者名稱",
		usernamePlaceholder: "你的使用者名稱",
		email: "電子郵件",
		emailPlaceholder: "你的電子郵件@網域.com",
		password: "密碼",
		passwordPlaceholder: "輸入密碼",
		language: "語言",
		signIn: "登入",
		signingIn: "登入中...",
		notice: "帳號由管理員建立，不開放公開註冊。",
		adminOnly: "管理員建立帳號",
		processes: "支援 AD、AO、A2O、SBR、MBR 與試驗程序",
		role: "依角色授權",
		roleText: "API 會控管管理員、操作員與檢視者權限。",
		control: "PLC 就緒",
		controlText: "適用於設備、標籤、即時讀值、警報與稽核紀錄。",
		required: "請輸入電子郵件地址和密碼",
		unavailable:
			"登入服務尚未啟用。前端已準備串接 POST /api/v1/auth/login。",
		failed: "無法登入，請確認帳號密碼後再試一次。",
		success: "登入成功。",
		navigation: {
			plantSetup: {
				label: "工廠設定",
				description: "首次使用設定",
			},
			noPlantAccess: {
				label: "等待授權",
				description: "等待管理員授權",
			},
			dashboard: {
				label: "儀表板",
				description: "系統總覽",
			},
			plc: {
				label: "PLC 控制",
				description: "即時操作",
			},
			equipment: {
				label: "設備",
				description: "裝置與站點",
			},
			tags: {
				label: "標籤",
				description: "訊號與讀值",
			},
			alarms: {
				label: "警報",
				description: "目前事件",
			},
			settings: {
				label: "設定",
				description: "系統偏好",
			},
		},
		noPlantAccess: {
			title: "尚無工廠存取權",
			description:
				"你的帳號尚未被授權存取任何工廠。請聯絡管理員將你加入工廠後，再使用此操作平台。",
			cardTitle: "需要授權",
			cardDescription:
				"管理員需要先允許你的帳號存取工廠。授權完成後，重新整理工作階段即可使用儀表板與操作頁面。",
		},
	},
}
