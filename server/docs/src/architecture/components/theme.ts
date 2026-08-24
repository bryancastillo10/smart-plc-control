/** The one adapter between the map and the host Tailwind v4 design tokens. */
export const paint = {
  surface: 'var(--surface-strong)',
  border: 'var(--line)',
  structure: 'var(--sea-ink-soft)',
  inkPrimary: 'var(--sea-ink)',
  inkSecondary: 'var(--sea-ink-soft)',
  inkTertiary: 'color-mix(in oklab, var(--sea-ink-soft) 72%, transparent)',
  accent: 'var(--lagoon-deep)',
  accentWash: 'color-mix(in oklab, var(--lagoon) 22%, var(--surface-strong))',
} as const

export const type = {
  title: 'var(--font-sans)',
  body: 'var(--font-sans)',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const

export const motion = {
  ease: 'cubic-bezier(0.32, 0.72, 0, 1)',
  base: 200,
  hover: 150,
} as const

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
