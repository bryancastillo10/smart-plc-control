import type { Language, UserRole } from "@/types/enum";

export interface UserProfile {
	id: string;
	userName: string;
	email: string;
	role: UserRole;
	language: Language;
	createdAt: string;
	updatedAt: string;
}
