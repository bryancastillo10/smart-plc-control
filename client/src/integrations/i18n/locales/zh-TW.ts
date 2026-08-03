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
		notice: "帳號由管理員建立，不開放公開註冊。",
		adminOnly: "管理員建立帳號",
		processes: "支援 AD、AO、A2O、SBR、MBR 與試驗程序",
		role: "依角色授權",
		roleText: "API 會控管管理員、操作員與檢視者權限。",
		control: "PLC 就緒",
		controlText: "適用於設備、標籤、即時讀值、警報與稽核紀錄。",
		required: "請輸入電子郵件地址和密碼",
		unavailable: "登入服務尚未啟用。前端已準備串接 POST /api/v1/auth/login。",
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
	plantSetup: {
		wizard: {
			kicker: "首次設定",
			title: "工廠設定流程",
			description: "依序完成工廠設定；後端整合將於後續加入。",
			progress: "步驟 {{current}} / {{total}}",
			currentStep: "目前步驟",
			previous: "上一步",
			next: "下一步",
		},
		plantInformation: {
			name: {
				label: "工廠名稱",
				placeholder: "主要生產工廠",
			},
			location: {
				label: "地點",
				placeholder: "新竹，台灣",
			},
			status: {
				label: "初始狀態",
				options: {
					active: "運作中",
					inactive: "停用",
					maintenance: "維護中",
				},
			},
			description: {
				label: "描述",
				placeholder: "說明工廠範圍、設備區域或運作情境。",
			},
			save: "儲存工廠資訊",
			savedTitle: "已儲存工廠資訊",
			notProvided: "未提供",
		},
		addDevice: {
			plantRequired: "請先儲存「工廠資訊」步驟，再新增設備。",
			name: {
				label: "設備名稱",
				placeholder: "主要製程 PLC",
			},
			typeLabel: "設備類型",
			types: {
				plc: "PLC",
				simulator: "模擬器",
				gateway: "閘道器",
				sensorGroup: "感測器群組",
				actuatorGroup: "致動器群組",
			},
			protocolLabel: "通訊方式",
			protocols: {
				modbusTcp: "Modbus TCP",
				opcUa: "OPC UA",
				simulator: "模擬器",
			},
			icon: {
				label: "顯示圖示",
				placeholder: "選擇設備圖示",
			},
			icons: {
				controller: "控制器",
				server: "伺服器",
				gateway: "閘道器",
				instrumentGroup: "儀表群組",
				connectedEquipment: "連接設備",
			},
			host: "主機或位址",
			port: "通訊埠",
			description: {
				label: "描述",
				placeholder: "說明設備的職責及其服務的製程區域。",
			},
			enabled: "將此設備納入工廠運作",
			add: "新增設備",
			empty: "尚未新增任何設備。",
			saved: "已儲存的設備",
			internalSimulation: "內部模擬",
			addressNotProvided: "未提供位址",
			remove: "移除 {{name}}",
			noDescription: "未提供描述。",
			included: "已納入",
			notIncluded: "未納入",
		},
		processUnit: {
			plantRequired: "請先儲存「工廠資訊」步驟，再新增程序單元。",
			name: {
				label: "單元名稱",
				placeholder: "曝氣槽 1",
			},
			typeLabel: "單元類型",
			typePlaceholder: "選擇單元類型",
			types: {
				tank: "槽體",
				reactor: "反應槽",
				clarifier: "澄清池",
				pumpStation: "泵浦站",
				filter: "過濾器",
				custom: "自訂",
			},
			status: {
				label: "初始狀態",
				options: {
					active: "運作中",
					inactive: "停用",
					maintenance: "維護中",
				},
			},
			icon: {
				label: "流程圖圖示",
				placeholder: "選擇流程圖圖示",
			},
			icons: {
				factory: "工廠",
				tank: "槽體",
				waterProcess: "水處理",
				meteredUnit: "計量單元",
			},
			description: {
				label: "描述",
				placeholder: "說明此單元在工廠程序中的用途。",
			},
			add: "新增程序單元",
			empty: "尚未新增任何程序單元。",
			saved: "已儲存的程序單元",
			remove: "移除 {{name}}",
			noDescription: "未提供描述。",
			connectionPorts_one: "{{count}} 個連接埠",
			connectionPorts_other: "{{count}} 個連接埠",
			iconValue: "{{icon}} 圖示",
		},
	},
	toast: {
		auth: {
			signIn: {
				success: "登入成功。",
				loading: "登入中...",
				failed: "無法登入，請確認帳號密碼後再試一次。",
				required: "請輸入電子郵件地址和密碼。",
			},
			signOut: {
				success: "登出成功。",
				loading: "登出中...",
				failed: "無法登出，請稍後再試。",
			},
			register: {
				success: "已建立使用者帳號。",
				loading: "正在建立使用者帳號...",
				failed: "建立使用者帳號失敗。",
			},
		},
		currentUser: {
			update: {
				success: "你的個人資料已更新。",
				loading: "正在更新你的個人資料...",
				failed: "更新個人資料失敗。",
			},
		},
		user: {
			update: {
				success: "已更新使用者。",
				loading: "正在更新使用者...",
				failed: "更新使用者失敗。",
			},
			delete: {
				success: "已刪除使用者。",
				loading: "正在刪除使用者...",
				failed: "刪除使用者失敗。",
			},
		},
		plant: {
			create: {
				success: "已建立工廠。",
				loading: "正在建立工廠...",
				failed: "建立工廠失敗。",
				required: "請輸入工廠名稱與位置。",
			},
			update: {
				success: "已更新工廠。",
				loading: "正在更新工廠...",
				failed: "更新工廠失敗。",
			},
			delete: {
				success: "已刪除工廠。",
				loading: "正在刪除工廠...",
				failed: "刪除工廠失敗。",
			},
		},
		processUnit: {
			create: {
				success: "已新增程序單元。",
				loading: "正在新增程序單元...",
				failed: "新增程序單元失敗。",
			},
			update: {
				success: "已更新程序單元。",
				loading: "正在更新程序單元...",
				failed: "更新程序單元失敗。",
			},
			delete: {
				success: "已刪除程序單元。",
				loading: "正在刪除程序單元...",
				failed: "刪除程序單元失敗。",
			},
		},
		processUnitConnection: {
			create: {
				success: "已建立程序單元連線。",
				loading: "正在建立程序單元連線...",
				failed: "建立程序單元連線失敗。",
			},
			update: {
				success: "已更新程序單元連線。",
				loading: "正在更新程序單元連線...",
				failed: "更新程序單元連線失敗。",
			},
			delete: {
				success: "已刪除程序單元連線。",
				loading: "正在刪除程序單元連線...",
				failed: "刪除程序單元連線失敗。",
			},
		},
		device: {
			create: {
				success: "已建立設備。",
				loading: "正在建立設備...",
				failed: "建立設備失敗。",
			},
			update: {
				success: "已更新設備。",
				loading: "正在更新設備...",
				failed: "更新設備失敗。",
			},
			delete: {
				success: "已刪除設備。",
				loading: "正在刪除設備...",
				failed: "刪除設備失敗。",
			},
			connect: {
				success: "設備已連線。",
				loading: "正在連線設備...",
				failed: "設備連線失敗。",
			},
			disconnect: {
				success: "設備已中斷連線。",
				loading: "正在中斷設備連線...",
				failed: "設備中斷連線失敗。",
			},
		},
		tag: {
			create: {
				success: "已建立標籤。",
				loading: "正在建立標籤...",
				failed: "建立標籤失敗。",
			},
			update: {
				success: "已更新標籤。",
				loading: "正在更新標籤...",
				failed: "更新標籤失敗。",
			},
			delete: {
				success: "已刪除標籤。",
				loading: "正在刪除標籤...",
				failed: "刪除標籤失敗。",
			},
		},
		alertRule: {
			create: {
				success: "已建立警報規則。",
				loading: "正在建立警報規則...",
				failed: "建立警報規則失敗。",
			},
			update: {
				success: "已更新警報規則。",
				loading: "正在更新警報規則...",
				failed: "更新警報規則失敗。",
			},
			delete: {
				success: "已刪除警報規則。",
				loading: "正在刪除警報規則...",
				failed: "刪除警報規則失敗。",
			},
		},
		alert: {
			acknowledge: {
				success: "已確認警報。",
				loading: "正在確認警報...",
				failed: "確認警報失敗。",
			},
			resolve: {
				success: "已解除警報。",
				loading: "正在解除警報...",
				failed: "解除警報失敗。",
			},
		},
		simulation: {
			create: {
				success: "已建立模擬。",
				loading: "正在建立模擬...",
				failed: "建立模擬失敗。",
			},
			update: {
				success: "已更新模擬。",
				loading: "正在更新模擬...",
				failed: "更新模擬失敗。",
			},
			delete: {
				success: "已刪除模擬。",
				loading: "正在刪除模擬...",
				failed: "刪除模擬失敗。",
			},
			start: {
				success: "模擬已啟動。",
				loading: "正在啟動模擬...",
				failed: "啟動模擬失敗。",
			},
			pause: {
				success: "模擬已暫停。",
				loading: "正在暫停模擬...",
				failed: "暫停模擬失敗。",
			},
			stop: {
				success: "模擬已停止。",
				loading: "正在停止模擬...",
				failed: "停止模擬失敗。",
			},
		},
		simulationScenario: {
			create: {
				success: "已建立模擬情境。",
				loading: "正在建立模擬情境...",
				failed: "建立模擬情境失敗。",
			},
			update: {
				success: "已更新模擬情境。",
				loading: "正在更新模擬情境...",
				failed: "更新模擬情境失敗。",
			},
			delete: {
				success: "已刪除模擬情境。",
				loading: "正在刪除模擬情境...",
				failed: "刪除模擬情境失敗。",
			},
			trigger: {
				success: "已觸發模擬情境。",
				loading: "正在觸發模擬情境...",
				failed: "觸發模擬情境失敗。",
			},
		},
	},
};
