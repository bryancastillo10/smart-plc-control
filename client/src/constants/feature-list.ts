import {
  Activity,
  BadgeCheck,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const featureList = [
  {
    icon: Gauge,
    title: "Real-Time Valve Monitoring",
    description:
      "Watch valve position, pressure, and response state in one live control surface.",
  },
  {
    icon: Activity,
    title: "Sensor Trend Visibility",
    description:
      "Track key plant signals over time to spot drift before it turns into downtime.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Control Guardrails",
    description:
      "Role-based access and clear action states reduce accidental operator mistakes.",
  },
  {
    icon: Layers3,
    title: "Plant-Level Configuration",
    description:
      "Manage plant settings and sensor profiles from a single structured workspace.",
  },
  {
    icon: BadgeCheck,
    title: "Simulator-Ready Workflow",
    description:
      "Test logic with simulator endpoints before applying changes to live equipment.",
  },
  {
    icon: Sparkles,
    title: "Operator-Friendly UI",
    description:
      "Readable layouts and concise controls help teams react faster under pressure.",
  },
];