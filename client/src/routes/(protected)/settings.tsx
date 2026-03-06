import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
		<h1>Settings Page</h1>
	</div>
}
