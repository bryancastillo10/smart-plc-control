import type { Language, UserRole } from "@/types/enum";

export interface User {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	language: Language;
	createdAt: string;
	updatedAt: string;
}