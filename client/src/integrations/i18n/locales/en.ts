export const en = {
	login: {
		appName: "ProcessPulse",
		kicker: "Wastewater process control",
		title: "Sign in to the control console",
		subtitle:
			"Secure access for wastewater treatment monitoring, PLC connectivity, alarms, and process operations.",
		username: "Username",
		usernamePlaceholder: "your username",
		email: "Email",
		emailPlaceholder: "your_email@domain.com",
		password: "Password",
		passwordPlaceholder: "Enter password",
		language: "Language",
		signIn: "Sign in",
		signingIn: "Signing in...",
		notice: "Administrator-managed access only. Public sign-up is disabled.",
		adminOnly: "Admin provisioned",
		processes: "AD, AO, A2O, SBR, MBR and pilot processes",
		role: "Role-aware access",
		roleText: "Admin, operator and viewer permissions are enforced by the API.",
		control: "PLC-ready",
		controlText: "Designed for devices, tags, live readings, alarms and audit trails.",
		required: "Enter both email and password",
		unavailable:
			"Login service is not available yet. The client is ready for POST /api/v1/auth/login.",
		failed: "Unable to sign in. Check your credentials and try again.",
		success: "Signed in successfully.",
		navigation: {
			plantSetup: {
				label: "Plant Setup",
				description: "First-run access",
			},
			noPlantAccess: {
				label: "Access Pending",
				description: "Await admin access",
			},
			dashboard: {
				label: "Dashboard",
				description: "System overview",
			},
			plc: {
				label: "PLC Control",
				description: "Live operations",
			},
			equipment: {
				label: "Equipment",
				description: "Devices and stations",
			},
			tags: {
				label: "Tags",
				description: "Signals and readings",
			},
			alarms: {
				label: "Alarms",
				description: "Active events",
			},
			settings: {
				label: "Settings",
				description: "System preferences",
			},
		},
		noPlantAccess: {
			title: "No Plant Access",
			description:
				"Your account does not have access to a plant yet. Please request an administrator to add you to a plant before operating this workspace.",
			cardTitle: "Access Required",
			cardDescription:
				"An admin user needs to allow your account access to a plant. Once access is granted, the dashboard and operating pages will become available automatically after your session refreshes.",
		},
	},
}
