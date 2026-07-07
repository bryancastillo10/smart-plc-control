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
	toast: {
		auth: {
			signIn: {
				success: "Signed in successfully.",
				loading: "Signing in...",
				failed: "Unable to sign in. Check your credentials and try again.",
				required: "Enter both email and password.",
			},
			signOut: {
				success: "Signed out successfully.",
				loading: "Signing out...",
				failed: "Unable to sign out. Please try again.",
			},
			register: {
				success: "A user account has been created.",
				loading: "Creating user account...",
				failed: "Failed to create user account.",
			},
		},
		currentUser: {
			update: {
				success: "Your profile has been updated.",
				loading: "Updating your profile...",
				failed: "Failed to update your profile.",
			},
		},
		user: {
			update: {
				success: "The user has been updated.",
				loading: "Updating user...",
				failed: "Failed to update user.",
			},
			delete: {
				success: "The user has been deleted.",
				loading: "Deleting user...",
				failed: "Failed to delete user.",
			},
		},
		plant: {
			create: {
				success: "A plant has been created.",
				loading: "Creating plant...",
				failed: "Failed to create a plant.",
				required: "Enter both plant name and location.",
			},
			update: {
				success: "The plant has been updated.",
				loading: "Updating plant...",
				failed: "Failed to update plant.",
			},
			delete: {
				success: "The plant has been deleted.",
				loading: "Deleting plant...",
				failed: "Failed to delete plant.",
			},
		},
		processUnit: {
			create: {
				success: "A process unit has been added.",
				loading: "Adding process unit...",
				failed: "Failed to add process unit.",
			},
			update: {
				success: "The process unit has been updated.",
				loading: "Updating process unit...",
				failed: "Failed to update process unit.",
			},
			delete: {
				success: "The process unit has been deleted.",
				loading: "Deleting process unit...",
				failed: "Failed to delete process unit.",
			},
		},
		processUnitConnection: {
			create: {
				success: "A process-unit connection has been created.",
				loading: "Creating process-unit connection...",
				failed: "Failed to create process-unit connection.",
			},
			update: {
				success: "The process-unit connection has been updated.",
				loading: "Updating process-unit connection...",
				failed: "Failed to update process-unit connection.",
			},
			delete: {
				success: "The process-unit connection has been deleted.",
				loading: "Deleting process-unit connection...",
				failed: "Failed to delete process-unit connection.",
			},
		},
		device: {
			create: {
				success: "A device has been created.",
				loading: "Creating device...",
				failed: "Failed to create device.",
			},
			update: {
				success: "The device has been updated.",
				loading: "Updating device...",
				failed: "Failed to update device.",
			},
			delete: {
				success: "The device has been deleted.",
				loading: "Deleting device...",
				failed: "Failed to delete device.",
			},
			connect: {
				success: "The device has been connected.",
				loading: "Connecting device...",
				failed: "Failed to connect device.",
			},
			disconnect: {
				success: "The device has been disconnected.",
				loading: "Disconnecting device...",
				failed: "Failed to disconnect device.",
			},
		},
		tag: {
			create: {
				success: "A tag has been created.",
				loading: "Creating tag...",
				failed: "Failed to create tag.",
			},
			update: {
				success: "The tag has been updated.",
				loading: "Updating tag...",
				failed: "Failed to update tag.",
			},
			delete: {
				success: "The tag has been deleted.",
				loading: "Deleting tag...",
				failed: "Failed to delete tag.",
			},
		},
		alertRule: {
			create: {
				success: "An alert rule has been created.",
				loading: "Creating alert rule...",
				failed: "Failed to create alert rule.",
			},
			update: {
				success: "The alert rule has been updated.",
				loading: "Updating alert rule...",
				failed: "Failed to update alert rule.",
			},
			delete: {
				success: "The alert rule has been deleted.",
				loading: "Deleting alert rule...",
				failed: "Failed to delete alert rule.",
			},
		},
		alert: {
			acknowledge: {
				success: "The alert has been acknowledged.",
				loading: "Acknowledging alert...",
				failed: "Failed to acknowledge alert.",
			},
			resolve: {
				success: "The alert has been resolved.",
				loading: "Resolving alert...",
				failed: "Failed to resolve alert.",
			},
		},
		simulation: {
			create: {
				success: "A simulation has been created.",
				loading: "Creating simulation...",
				failed: "Failed to create simulation.",
			},
			update: {
				success: "The simulation has been updated.",
				loading: "Updating simulation...",
				failed: "Failed to update simulation.",
			},
			delete: {
				success: "The simulation has been deleted.",
				loading: "Deleting simulation...",
				failed: "Failed to delete simulation.",
			},
			start: {
				success: "The simulation has started.",
				loading: "Starting simulation...",
				failed: "Failed to start simulation.",
			},
			pause: {
				success: "The simulation has been paused.",
				loading: "Pausing simulation...",
				failed: "Failed to pause simulation.",
			},
			stop: {
				success: "The simulation has been stopped.",
				loading: "Stopping simulation...",
				failed: "Failed to stop simulation.",
			},
		},
		simulationScenario: {
			create: {
				success: "A simulation scenario has been created.",
				loading: "Creating simulation scenario...",
				failed: "Failed to create simulation scenario.",
			},
			update: {
				success: "The simulation scenario has been updated.",
				loading: "Updating simulation scenario...",
				failed: "Failed to update simulation scenario.",
			},
			delete: {
				success: "The simulation scenario has been deleted.",
				loading: "Deleting simulation scenario...",
				failed: "Failed to delete simulation scenario.",
			},
			trigger: {
				success: "The simulation scenario has been triggered.",
				loading: "Triggering simulation scenario...",
				failed: "Failed to trigger simulation scenario.",
			},
		},
	},
}
