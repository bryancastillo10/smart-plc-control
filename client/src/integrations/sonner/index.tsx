import { Toaster } from "sonner";

export { useToast } from "./useToast";

export function AppToaster() {
	return <Toaster richColors closeButton position="top-right" />;
}
