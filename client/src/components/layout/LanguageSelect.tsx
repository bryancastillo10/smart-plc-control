import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/store/language";
import { appControl } from "@/styles/recipes";
import type { Language } from "@/types/enum";

export function LanguageSelect() {
	const language = useLanguageStore((state) => state.language);
	const setLanguage = useLanguageStore((state) => state.setLanguage);

	return (
		<div className="flex items-center gap-3">
			<span className="text-sm font-semibold text-brand-muted">Language</span>
			<Select
				value={language}
				onValueChange={(value) => setLanguage(value as Language)}
			>
				<SelectTrigger
					aria-label="Language"
					className={appControl.selectCompact}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="EN">EN</SelectItem>
					<SelectItem value="ZH-TW">ZH-TW</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
