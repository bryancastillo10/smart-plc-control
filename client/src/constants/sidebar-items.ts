import { LayoutDashboard,  Settings, UserPlus } from "lucide-react";

export const sidebarItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
  {
    label: "Add User",
    to: "/add-user",
    icon: UserPlus,
  },
];