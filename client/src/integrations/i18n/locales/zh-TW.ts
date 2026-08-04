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
		steps: {
			plant: {
				title: "工廠資訊",
				description: "定義工廠識別資訊、地點、運作狀態及整體用途。",
				details: {
					configured:
						"已將 {{name}} 設為本次設定的工廠。定義程序前，請檢查其地點、狀態及描述。",
					empty:
						"先填寫基本工廠資訊。請在描述中摘要工廠用途、生產範圍、處理能力或主要運作職責。",
				},
			},
			processUnits: {
				title: "程序單元",
				description: "識別工廠的主要處理階段、生產區域及支援單元。",
				details: {
					configured_one:
						"已定義 {{count}} 個程序單元。請確認清單涵蓋理解完整程序所需的主要階段及支援區域。",
					configured_other:
						"已定義 {{count}} 個程序單元。請確認清單涵蓋理解完整程序所需的主要階段及支援區域。",
					empty:
						"將工廠劃分為有意義的運作區域或單元操作，例如槽體、反應槽、澄清池、過濾器、泵浦站、儲存區及公用系統。",
				},
			},
			devices: {
				title: "設備與控制裝置",
				description: "登錄用於監控、控制及跨程序交換資訊的設備。",
				details: {
					configured_one:
						"已識別 {{count}} 個設備。請確認各程序區域所需的觀測與控制設備皆已列入。",
					configured_other:
						"已識別 {{count}} 個設備。請確認各程序區域所需的觀測與控制設備皆已列入。",
					empty:
						"識別收集量測值、發出命令或連接工廠區域的 PLC、閘道器、模擬器及其他控制設備。",
				},
			},
			tags: {
				title: "程序量測與訊號",
				description: "定義運作期間使用的量測值、設備狀態及控制訊號。",
				details: {
					configured_one:
						"已定義 {{count}} 個量測值或訊號。請確認每個項目皆連結至正確的設備與程序區域。",
					configured_other:
						"已定義 {{count}} 個量測值或訊號。請確認每個項目皆連結至正確的設備與程序區域。",
					empty:
						"列出操作員需要監控或控制的值，例如流量、液位、壓力、溫度、品質、設備狀態、設定值及命令。",
				},
			},
			diagram: {
				title: "程序流程配置",
				description: "排列程序單元，並顯示物料或公用介質如何在單元間流動。",
				details: {
					configured_one:
						"已定義 {{count}} 個程序連線。請檢查單元間的流程順序與方向。",
					configured_other:
						"已定義 {{count}} 個程序連線。請檢查單元間的流程順序與方向。",
					empty:
						"依正常運作順序排列程序單元，再說明水、產品、廢棄物、藥劑、氣體或公用介質如何由一個單元流向另一個單元。",
				},
			},
			alertRules: {
				title: "運作警報",
				description: "設定需要注意的運作條件，並指出其緊急程度。",
				details: {
					configured_one:
						"已定義 {{count}} 個運作警報。請檢查各項限制、緊急程度及訊息，確保能支援適當的操作員應對。",
					configured_other:
						"已定義 {{count}} 個運作警報。請檢查各項限制、緊急程度及訊息，確保能支援適當的操作員應對。",
					empty:
						"定義運作值何時需要注意。請考量正常限制、警告條件、嚴重條件、設備保護及操作員應採取的行動。",
				},
			},
			simulation: {
				title: "程序模擬",
				description: "準備具代表性的運作行為，以測試程序條件及反應。",
				details: {
					available:
						"已有模擬來源。請定義具代表性的數值及運作變化，以檢視工廠在預期與異常條件下的行為。",
					unavailable:
						"若要使用具代表性的運作值及情境檢視工廠行為，請在「設備與控制裝置」中新增模擬器。",
				},
			},
			users: {
				title: "團隊與職責",
				description: "指派負責操作、監督及檢查工廠的人員。",
				details: {
					configured_one:
						"已指派 {{count}} 位團隊成員。請確認操作、監督及檢查職責皆已適當涵蓋。",
					configured_other:
						"已指派 {{count}} 位團隊成員。請確認操作、監督及檢查職責皆已適當涵蓋。",
					empty:
						"識別負責操作工廠、監督效能、檢查條件或維護設定的人員，並依各自角色指派職責。",
				},
			},
			dashboard: {
				title: "開啟工廠總覽",
				description: "完成設定並前往工廠運作總覽。",
				details: {
					default: "繼續前，請開啟工廠總覽以查看目前的本機設定值。",
				},
			},
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
		addTag: {
			deviceRequired: "請先新增至少一個設備，再定義其量測與訊號。",
			device: {
				label: "設備",
				placeholder: "選擇設備",
			},
			processUnit: {
				label: "程序單元",
				unassigned: "未指派程序單元",
			},
			name: {
				label: "標籤名稱",
				placeholder: "曝氣槽液位",
			},
			address: "設備位址",
			dataTypeLabel: "數值類型",
			dataTypes: {
				boolean: "布林值",
				integer: "整數",
				decimal: "小數",
				text: "文字",
			},
			engineeringUnit: "工程單位",
			description: {
				label: "描述",
				placeholder: "說明此數值代表的意義及其在運作期間的用途。",
			},
			enabled: "將此量測或訊號納入工廠運作",
			add: "新增標籤",
			empty: "尚未新增任何標籤。",
			saved: "已儲存的量測與訊號",
			remove: "移除 {{name}}",
			unknownDevice: "未知設備",
			notAssigned: "未指派",
			savedDetails: {
				device: "設備：{{name}}",
				address: "位址：{{address}}",
				processUnit: "程序單元：{{name}}",
			},
		},
		processArrangement: {
			instructions:
				"拖曳各卡片以配置工廠。若要建立程序流程，請拖曳程序單元右側的箭頭控制點，並在另一個程序單元上放開。",
			connectionsTitle: "程序流程連線（{{count}}）",
			empty: "尚未新增任何程序流程連線。",
			remove: "移除程序連線",
			flowTypes: {
				water: "水",
				wastewater: "廢水",
				sludge: "污泥",
				gas: "氣體",
				chemical: "化學品",
				rawMaterial: "原料",
				others: "其他",
			},
		},
		addAlertRule: {
			tagRequired: "請先新增至少一個量測值或訊號，再定義運作警報。",
			tag: {
				label: "量測值或訊號",
				placeholder: "選擇量測值或訊號",
			},
			selected: {
				device: "設備：{{name}}",
				processUnit: "程序單元：{{name}}",
				value: "數值：{{type}}",
			},
			unknown: "未知",
			notAssigned: "未指派",
			name: {
				label: "警報名稱",
				placeholder: "槽體液位過高",
			},
			severityLabel: "緊急程度",
			severities: {
				low: "低",
				medium: "中",
				high: "高",
				critical: "嚴重",
			},
			operatorLabel: "條件",
			operators: {
				above: "高於",
				atOrAbove: "大於或等於",
				below: "低於",
				atOrBelow: "小於或等於",
				equalTo: "等於",
				notEqualTo: "不等於",
			},
			threshold: {
				label: "運作限制",
				statePlaceholder: "選擇狀態",
				true: "真",
				false: "假",
				placeholder: "限制值",
			},
			message: {
				label: "操作員訊息",
				placeholder: "說明此條件及操作員應採取的應對措施。",
			},
			enabled: "啟用此運作警報",
			add: "新增警報規則",
			empty: "尚未新增任何運作警報。",
			saved: "已儲存的運作警報",
			unknownTag: "未知標籤",
			remove: "移除 {{name}}",
			savedDetails: {
				device: "設備：{{name}}",
				processUnit: "程序單元：{{name}}",
			},
		},
		addSimulation: {
			optional: {
				title: "模擬設定為選用項目",
				description:
					"在設備設定期間未新增模擬器設備。你可以略過此步驟並繼續，或返回「設備」新增模擬器，以提供具代表性的程序行為。",
			},
			availableDevices: "可用的模擬器設備",
			deviceDescription:
				"模擬設定檔套用於整個工廠。模擬器設備可在測試期間提供具代表性的數值。",
			name: {
				label: "模擬名稱",
				placeholder: "正常運作設定檔",
			},
			updateInterval: {
				label: "更新間隔（毫秒）",
				help: "代表性程序數值的更新頻率，最短為 100 毫秒。",
			},
			variation: {
				label: "變異係數",
				help: "為產生的數值加入自然變化；0 表示穩定值，1 表示最大變化。",
			},
			add: "新增模擬設定檔",
			empty: "尚未新增任何模擬設定檔。",
			saved: "已儲存的模擬設定檔",
			statuses: {
				idle: "待命",
				running: "執行中",
				paused: "已暫停",
				stopped: "已停止",
			},
			remove: "移除 {{name}}",
			savedDetails: {
				updateInterval: "更新間隔：{{value}} 毫秒",
				variation: "變異係數：{{value}}",
			},
		},
		plantUsers: {
			table: {
				user: "使用者",
				responsibility: "工廠職責",
				role: "角色",
				language: "語言",
			},
			owner: "工廠擁有者",
			teamMember: "團隊成員",
			roleFor: "{{name}} 的角色",
			roles: {
				admin: "管理員",
				operator: "操作員",
				viewer: "檢視者",
			},
			languages: {
				english: "英文",
				traditionalChinese: "繁體中文",
			},
			empty: "尚未指派任何使用者至此工廠。",
			addMember: {
				title: "新增團隊成員",
				description: "建立帳號並授予此工廠的存取權限。",
			},
			fields: {
				username: "使用者名稱",
				email: "電子郵件",
				role: "角色",
				language: "語言",
				temporaryPassword: "臨時密碼",
				confirmPassword: "確認密碼",
			},
			validation: "請填寫所有必填欄位，並確認兩次輸入的密碼相符。",
			creating: "正在建立帳號...",
			add: "新增使用者",
			adminOnly: "只有管理員使用者可以建立帳號或變更團隊成員的角色。",
		},
		plantOverview: {
			modal: {
				close: "關閉",
				done: "完成",
				description: "每個設定請求會依相依順序執行，請在下方查看進度。",
				title: "正在建立工廠設定",
			},
			introduction: {
				title: "開啟工廠總覽",
				description:
					"開啟工廠總覽前，請檢視目前的本機草稿值。這些值只會從工廠設定表單儲存區讀取。",
			},
			sections: {
				plantInformation: "工廠資訊",
				processUnit: "程序單元",
				processConnection: "程序連線",
				device: "設備",
				tag: "標籤",
				alertRule: "警報規則",
				simulation: "模擬",
			},
			labels: {
				name: "名稱",
				location: "位置",
				status: "狀態",
				description: "說明",
				type: "類型",
				position: "座標",
				ports: "連接埠",
				icon: "圖示",
				sourceUnit: "來源單元",
				sourcePort: "來源連接埠",
				targetUnit: "目標單元",
				targetPort: "目標連接埠",
				flowType: "流體類型",
				label: "標籤",
				protocol: "通訊協定",
				host: "主機",
				port: "連接埠",
				enabled: "啟用",
				device: "設備",
				processUnit: "程序單元",
				address: "位址",
				dataType: "資料類型",
				unit: "單位",
				tag: "標籤",
				condition: "條件",
				severity: "嚴重程度",
				message: "訊息",
				plant: "工廠",
				updateInterval: "更新間隔",
				noiseFactor: "變異係數",
			},
			values: {
				yes: "是",
				no: "否",
				notSet: "未設定",
			},
			submit: "送出",
		},
		plantFinal: {
			requests: {
				plant: "工廠資訊",
				processUnits: "程序單元",
				devices: "設備",
				connections: "程序連線",
				tags: "標籤",
				alertRules: "警報規則",
				simulations: "模擬",
			},
			status: {
				creatingProgress: "正在建立第 {{current}} 個，共 {{total}} 個...",
				creating: "正在建立...",
				nothing: "沒有需要建立的項目",
				completed_one: "已完成 {{count}} 個請求",
				completed_other: "已完成 {{count}} 個請求",
				failed: "請求失敗",
				skipped: "因先前發生錯誤而略過",
				waiting: "等待中",
			},
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
