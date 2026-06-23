import LoginPage from "@/components/auth/LoginPage"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: HomePage })

function HomePage() {
	return <LoginPage />
}