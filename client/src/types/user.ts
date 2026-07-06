import type { Language, UserRole } from "@/types/enum";

export interface UserProfile {
	id: string;
	userName: string;
	email: string;
	role: UserRole;
	language: Language;
	hasOwnedPlant: boolean;
	createdAt: string;
	updatedAt: string;
}
