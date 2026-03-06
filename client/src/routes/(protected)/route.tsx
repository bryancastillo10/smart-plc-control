import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)')({
  component: RouteComponent,

})

function RouteComponent() {
  return 		<div className="flex min-h-screen w-full ">
			{/* SIDEBAR */}
			Sidebar
			{/* MAIN CONTENT */}
			<main className="flex-1 overflow-y-auto p-4 md:p-6">
				<Outlet />
			</main>
		</div>
}
