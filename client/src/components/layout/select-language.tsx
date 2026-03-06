import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SelectLanguage = () => {
	const { t, i18n } = useTranslation();

	const handleChangeTranslation = (language: "en-US" | "zh-TW") => {
		i18n.changeLanguage(language);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					<Languages />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuCheckboxItem
						checked={i18n.resolvedLanguage === "en-US"}
						onCheckedChange={() => handleChangeTranslation("en-US")}
					>
						English (US)
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={i18n.resolvedLanguage === "zh-TW"}
						onCheckedChange={() => handleChangeTranslation("zh-TW")}
					>
						繁體中文
					</DropdownMenuCheckboxItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default SelectLanguage;
