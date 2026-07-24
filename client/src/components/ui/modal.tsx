import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal";

interface ModalProps {
	children?: ReactNode;
	description?: string;
	footer?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	title: string;
}

export function Modal({
	children,
	description,
	footer,
	isOpen,
	onClose,
	title,
}: ModalProps) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen || typeof document === "undefined") {
		return null;
	}

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
			<button
				aria-label="Close modal"
				className="absolute inset-0 size-full cursor-default"
				onClick={onClose}
				type="button"
			/>
			<section
				aria-modal="true"
				className="relative w-full max-w-lg rounded-md border border-line-subtle bg-white p-5 shadow-xl"
				role="dialog"
			>
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<h2 className="text-lg font-bold text-brand-ink">{title}</h2>
						{description ? (
							<p className="text-sm leading-6 text-brand-muted">{description}</p>
						) : null}
					</div>
					<Button
						aria-label="Close modal"
						onClick={onClose}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<X className="size-4" />
					</Button>
				</div>

				{children ? <div className="mt-4">{children}</div> : null}

				{footer ? <div className="mt-5 flex justify-end gap-3">{footer}</div> : null}
			</section>
		</div>,
		document.body,
	);
}

export function GlobalModal() {
	const {
		cancelLabel,
		closeModal,
		confirmLabel,
		content,
		description,
		isOpen,
		onConfirm,
		title,
	} = useModalStore();

	const handleConfirm = () => {
		onConfirm?.();
		closeModal();
	};

	return (
		<Modal
			description={description}
			footer={
				<>
					<Button onClick={closeModal} type="button" variant="outline">
						{cancelLabel ?? "Cancel"}
					</Button>
					<Button onClick={handleConfirm} type="button">
						{confirmLabel ?? "Confirm"}
					</Button>
				</>
			}
			isOpen={isOpen}
			onClose={closeModal}
			title={title}
		>
			{content}
		</Modal>
	);
}
