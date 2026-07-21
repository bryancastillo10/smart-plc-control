import type { ReactNode } from "react";
import { create } from "zustand";

export interface ModalPayload {
	title: string;
	description?: string;
	content?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm?: () => void;
}

interface ModalState extends ModalPayload {
	isOpen: boolean;
	closeModal: () => void;
	openModal: (payload: ModalPayload) => void;
}

const initialModalState: ModalPayload = {
	title: "",
	description: undefined,
	content: undefined,
	confirmLabel: undefined,
	cancelLabel: undefined,
	onConfirm: undefined,
};

export const useModalStore = create<ModalState>((set) => ({
	...initialModalState,
	isOpen: false,
	closeModal: () => set({ ...initialModalState, isOpen: false }),
	openModal: (payload) => set({ ...initialModalState, ...payload, isOpen: true }),
}));
