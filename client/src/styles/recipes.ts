import { cva } from "@/utils/utils";

export const appLayout = {
	page: "min-h-screen px-4 py-6 text-brand-ink sm:px-6 lg:px-8",
	viewport:
		"mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center",
	splitGrid: "grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center",
	primaryColumn: "order-2 space-y-6 lg:order-1",
	secondaryColumn: "order-1 lg:order-2",
	stackSm: "space-y-2",
	stackMd: "space-y-4",
	stackLg: "space-y-5",
	responsiveGrid3: "grid gap-3 sm:grid-cols-3",
	headerRow: "mb-7 flex items-start justify-between gap-4",
	form: "space-y-5",
	field: "space-y-2",
	iconField: "relative",
} as const;

export const appTextVariants = cva("", {
	variants: {
		role: {
			pageTitle:
				"display-title max-w-2xl text-5xl font-bold leading-[1.02] tracking-normal text-brand-ink sm:text-6xl",
			subtitle: "max-w-2xl text-lg leading-8 text-brand-muted",
			sectionTitle: "text-2xl font-bold text-brand-ink",
			cardTitle: "text-sm font-bold text-brand-ink",
			body: "text-sm leading-6 text-brand-muted",
			helper: "text-sm leading-6 text-brand-muted",
			kicker:
				"island-kicker text-[0.69rem] font-bold uppercase tracking-[0.16em] text-brand-kicker",
		},
		align: {
			left: "text-left",
			center: "text-center",
			right: "text-right",
		},
		spacing: {
			none: "",
			tight: "mb-2",
		},
	},
	defaultVariants: {
		align: "left",
		spacing: "none",
	},
});

export const appIconVariants = cva("shrink-0", {
	variants: {
		size: {
			xs: "size-3",
			sm: "size-4",
			md: "size-5",
			lg: "size-6",
		},
		tone: {
			brand: "text-brand-control",
			muted: "text-brand-muted",
			ink: "text-brand-ink",
			inverse: "text-white",
		},
		placement: {
			inline: "",
			input: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
		},
	},
	defaultVariants: {
		size: "sm",
		tone: "brand",
		placement: "inline",
	},
});

export const appControl = {
	inputWithIcon: "h-11 bg-white/80 pl-10 text-brand-ink",
	selectCompact: "w-28 bg-white/70",
} as const;

export const appButtonVariants = cva("", {
	variants: {
		intent: {
			brand: "bg-brand-control text-white hover:bg-brand-ink",
		},
		width: {
			auto: "",
			full: "w-full",
		},
		size: {
			default: "",
			form: "h-11",
		},
	},
	defaultVariants: {
		intent: "brand",
		width: "auto",
		size: "default",
	},
});

export const appBadgeVariants = cva(
	"inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold shadow-sm",
	{
		variants: {
			intent: {
				brand: "border-chip-line bg-chip text-brand-control",
			},
		},
		defaultVariants: {
			intent: "brand",
		},
	},
);

export const appSurfaceVariants = cva("rounded-md", {
	variants: {
		variant: {
			panel: "island-shell mx-auto w-full max-w-md rounded-lg p-6 sm:p-8",
			card: "feature-card border border-line-subtle p-4 shadow-sm",
			iconTile:
				"mb-3 flex size-9 items-center justify-center bg-white/75 text-brand-control",
			notice:
				"border border-line-subtle bg-white/55 p-4 text-sm font-semibold text-brand-muted shadow-sm backdrop-blur",
		},
	},
});

export const appFeedbackVariants = cva(
	"rounded-md border px-3 py-2 text-sm font-medium",
	{
		variants: {
			tone: {
				error: "border-red-500/25 bg-red-50 text-red-800",
				success: "border-emerald-500/30 bg-emerald-50 text-emerald-800",
				info: "border-chip-line bg-chip text-brand-muted",
			},
		},
		defaultVariants: {
			tone: "info",
		},
	},
);
