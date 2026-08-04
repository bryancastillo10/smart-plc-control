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
		signIn: "Sign In",
		notice: "Administrator-managed access only. Public sign-up is disabled.",
		adminOnly: "Admin provisioned",
		processes: "AD, AO, A2O, SBR, MBR and pilot processes",
		role: "Role-aware access",
		roleText: "Admin, operator and viewer permissions are enforced by the API.",
		control: "PLC-ready",
		controlText:
			"Designed for devices, tags, live readings, alarms and audit trails.",
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
	plantSetup: {
		wizard: {
			kicker: "First-run setup",
			title: "Plant Setup Workflow",
			description:
				"Move through the static setup shell for plant configuration before backend integration is added.",
			progress: "Step {{current}} of {{total}}",
			currentStep: "Current step",
			previous: "Previous",
			next: "Next",
		},
		steps: {
			plant: {
				title: "Plant Information",
				description:
					"Define the plant identity, location, operating status, and overall purpose.",
				details: {
					configured:
						"{{name}} has been identified as the plant for this setup. Review its location, status, and description before defining the process.",
					empty:
						"Begin with the basic plant information. Use the description to summarize the plant's purpose, production scope, treatment capacity, or main operating responsibilities.",
				},
			},
			processUnits: {
				title: "Process Units",
				description:
					"Identify the main treatment stages, production areas, and supporting units in the plant.",
				details: {
					configured_one:
						"{{count}} process unit defined. Confirm that the list represents the major stages and supporting areas needed to understand the complete process.",
					configured_other:
						"{{count}} process units defined. Confirm that the list represents the major stages and supporting areas needed to understand the complete process.",
					empty:
						"Break the plant into meaningful operating areas or unit operations, such as tanks, reactors, clarifiers, filters, pump stations, storage areas, and utility systems.",
				},
			},
			devices: {
				title: "Devices and Control Equipment",
				description:
					"Register the equipment used to monitor, control, and exchange information across the process.",
				details: {
					configured_one:
						"{{count}} device identified. Check that the equipment needed to observe and control each process area is represented.",
					configured_other:
						"{{count}} devices identified. Check that the equipment needed to observe and control each process area is represented.",
					empty:
						"Identify the PLCs, gateways, simulators, and other control equipment that collect measurements, issue commands, or connect plant areas.",
				},
			},
			tags: {
				title: "Process Measurements and Signals",
				description:
					"Define the measurements, equipment states, and control signals used during operation.",
				details: {
					configured_one:
						"{{count}} measurement or signal defined. Confirm that each item is associated with the correct device and process area.",
					configured_other:
						"{{count}} measurements or signals defined. Confirm that each item is associated with the correct device and process area.",
					empty:
						"List the values operators need to monitor or control, such as flow, level, pressure, temperature, quality, equipment status, setpoints, and commands.",
				},
			},
			diagram: {
				title: "Process Flow Arrangement",
				description:
					"Arrange the process units and show how materials or utilities move between them.",
				details: {
					configured_one:
						"{{count}} process connection defined. Review the sequence and direction of flow between units.",
					configured_other:
						"{{count}} process connections defined. Review the sequence and direction of flow between units.",
					empty:
						"Arrange the process units in their normal operating sequence, then describe how water, product, waste, chemicals, gas, or utilities pass from one unit to another.",
				},
			},
			alertRules: {
				title: "Operating Alerts",
				description:
					"Set the operating conditions that require attention and indicate their level of urgency.",
				details: {
					configured_one:
						"{{count}} operating alert defined. Review each limit, urgency, and message to ensure it supports an appropriate operator response.",
					configured_other:
						"{{count}} operating alerts defined. Review each limit, urgency, and message to ensure it supports an appropriate operator response.",
					empty:
						"Define when an operating value requires attention. Consider normal limits, warning conditions, critical conditions, equipment protection, and the action expected from the operator.",
				},
			},
			simulation: {
				title: "Process Simulation",
				description:
					"Prepare representative operating behavior for testing process conditions and responses.",
				details: {
					available:
						"A simulation source is available. Define representative values and operating changes that can be used to examine plant behavior under expected and unusual conditions.",
					unavailable:
						"Add a simulator under Devices and Control Equipment if you want to examine plant behavior using representative operating values and scenarios.",
				},
			},
			users: {
				title: "Team and Responsibilities",
				description:
					"Assign the people responsible for operating, supervising, and reviewing the plant.",
				details: {
					configured_one:
						"{{count}} team member assigned. Confirm that operating, supervisory, and review responsibilities are appropriately covered.",
					configured_other:
						"{{count}} team members assigned. Confirm that operating, supervisory, and review responsibilities are appropriately covered.",
					empty:
						"Identify who will operate the plant, supervise performance, review conditions, or maintain the setup. Assign responsibilities according to each person's role.",
				},
			},
			dashboard: {
				title: "Open Plant Overview",
				description:
					"Complete the setup and continue to the plant's operational overview.",
				details: {
					default:
						"Open the plant overview to view the current local setup values before continuing.",
				},
			},
		},
		plantInformation: {
			name: {
				label: "Plant Name",
				placeholder: "Main Production Plant",
			},
			location: {
				label: "Location",
				placeholder: "Hsinchu, Taiwan",
			},
			status: {
				label: "Initial Status",
				options: {
					active: "Active",
					inactive: "Inactive",
					maintenance: "Maintenance",
				},
			},
			description: {
				label: "Description",
				placeholder:
					"Describe the plant scope, equipment area, or operating context.",
			},
			save: "Save Plant Information",
			savedTitle: "Saved Plant Information",
			notProvided: "Not provided",
		},
		addDevice: {
			plantRequired: "Save the Plant Information step before adding devices.",
			name: {
				label: "Device Name",
				placeholder: "Main Process PLC",
			},
			typeLabel: "Device Type",
			types: {
				plc: "PLC",
				simulator: "Simulator",
				gateway: "Gateway",
				sensorGroup: "Sensor Group",
				actuatorGroup: "Actuator Group",
			},
			protocolLabel: "Communication Method",
			protocols: {
				modbusTcp: "Modbus TCP",
				opcUa: "OPC UA",
				simulator: "Simulator",
			},
			icon: {
				label: "Display Icon",
				placeholder: "Select a device icon",
			},
			icons: {
				controller: "Controller",
				server: "Server",
				gateway: "Gateway",
				instrumentGroup: "Instrument Group",
				connectedEquipment: "Connected Equipment",
			},
			host: "Host or Address",
			port: "Port",
			description: {
				label: "Description",
				placeholder:
					"Describe the device's responsibility and the process area it serves.",
			},
			enabled: "Include this device in plant operation",
			add: "Add Device",
			empty: "No devices have been added yet.",
			saved: "Saved Devices",
			internalSimulation: "Internal simulation",
			addressNotProvided: "Address not provided",
			remove: "Remove {{name}}",
			noDescription: "No description provided.",
			included: "Included",
			notIncluded: "Not included",
		},
		processUnit: {
			plantRequired:
				"Save the Plant Information step before adding process units.",
			name: {
				label: "Unit Name",
				placeholder: "Aeration Tank 1",
			},
			typeLabel: "Unit Type",
			typePlaceholder: "Select a unit type",
			types: {
				tank: "Tank",
				reactor: "Reactor",
				clarifier: "Clarifier",
				pumpStation: "Pump Station",
				filter: "Filter",
				custom: "Custom",
			},
			status: {
				label: "Initial Status",
				options: {
					active: "Active",
					inactive: "Inactive",
					maintenance: "Maintenance",
				},
			},
			icon: {
				label: "Diagram Icon",
				placeholder: "Select a diagram icon",
			},
			icons: {
				factory: "Factory",
				tank: "Tank",
				waterProcess: "Water Process",
				meteredUnit: "Metered Unit",
			},
			description: {
				label: "Description",
				placeholder: "Describe this unit's purpose in the plant process.",
			},
			add: "Add Process Unit",
			empty: "No process units have been added yet.",
			saved: "Saved Process Units",
			remove: "Remove {{name}}",
			noDescription: "No description provided.",
			connectionPorts_one: "{{count}} connection port",
			connectionPorts_other: "{{count}} connection ports",
			iconValue: "{{icon}} icon",
		},
		addTag: {
			deviceRequired:
				"Add at least one Device before defining its measurements and signals.",
			device: {
				label: "Device",
				placeholder: "Select a device",
			},
			processUnit: {
				label: "Process Unit",
				unassigned: "Not assigned to a process unit",
			},
			name: {
				label: "Tag Name",
				placeholder: "Aeration Tank Level",
			},
			address: "Device Address",
			dataTypeLabel: "Value Type",
			dataTypes: {
				boolean: "Boolean",
				integer: "Integer",
				decimal: "Decimal",
				text: "Text",
			},
			engineeringUnit: "Engineering Unit",
			description: {
				label: "Description",
				placeholder:
					"Describe what this value represents and how it is used during operation.",
			},
			enabled: "Include this measurement or signal in plant operation",
			add: "Add Tag",
			empty: "No tags have been added yet.",
			saved: "Saved Measurements and Signals",
			remove: "Remove {{name}}",
			unknownDevice: "Unknown device",
			notAssigned: "Not assigned",
			savedDetails: {
				device: "Device: {{name}}",
				address: "Address: {{address}}",
				processUnit: "Process Unit: {{name}}",
			},
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
};
