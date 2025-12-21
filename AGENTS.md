# AGENTS

Guidelines for code agents working on this repo.

## Project facts
- Stack: Astro 5, Tailwind CSS 4, React only for specific motion components.
- Entry pages live in `src/pages/`; shared layout in `src/layouts/Layout.astro`.
- Design system tokens and global utilities are in `src/styles/global.css`.
- Site URL is configured in `astro.config.mjs`.

## Working agreements
- Keep the campaign visual language consistent; prefer editing existing components over adding new ones.
- Use Tailwind classes and the CSS variables from `@theme` in `src/styles/global.css` for colors and typography.
- Avoid adding new global CSS unless it is a reusable utility.
- Reuse existing components in `src/components/` and keep markup semantic.

## Content and data
- Copy is German; preserve meaning, tone, and line breaks.
- Events are fetched from a remote API; a local template exists in `termine-api-vorlage.json`.
- Contact form uses a Formspree ID in `src/components/Contact.astro`.

## Accessibility and UX
- Preserve skip-link, focus styles, and reduced-motion support.
- Ensure new interactive elements are keyboard-accessible and labeled.

## Assets
- Public assets go in `public/`; Astro-processed assets go in `src/assets/`.
- Do not introduce remote font or script loads; keep assets local for privacy.

## Commands
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Verification
- No automated tests; use `npm run build` to validate changes that affect layout or data loading.
