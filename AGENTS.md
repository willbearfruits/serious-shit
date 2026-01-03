# Repository Guidelines

## Project Structure & Module Organization
This repository is a static site. Key paths:
- `index.html` and other root HTML pages (`workshops.html`, `sales.html`, `contact.html`, `about.html`, `mods.html`, `gallery.html`, `os.html`)
- `css/` for styles (`style.css` main, `glitch.css` overrides, `os.css` for the OS page)
- `js/` for behavior (`main.js` for language/theme/UX, `os.js` for the OS)
- `content/` for JSON content (legacy data)
- `images/` for assets (`images/products/`, `images/gallery/`, `images/workshops/`)

## Build, Test, and Development Commands
No build step; serve the root folder.
- `python -m http.server 8000` - run a local server at `http://localhost:8000`
- `npx serve` - alternative static server if Node is available

## Coding Style & Naming Conventions
- Indentation: 2 spaces in HTML, CSS, and JS.
- JavaScript: prefer single quotes and semicolons, keep functions small and readable.
- CSS: use kebab-case class names and custom properties in `:root` (for example `--accent`).
- Localization: duplicate user-facing text with `.lang-en` and `.lang-he` spans and keep both updated; language and `dir` are toggled via `data-lang` on `<html>`.

## Testing Guidelines
No automated tests are configured. For manual checks:
- Load pages via the local server and verify navigation, layout, and responsive behavior.
- Toggle language and theme, and verify correct text visibility and `dir` changes.
- Confirm forms and external links open correctly.

## Commit & Pull Request Guidelines
- No Git history is present in this copy, so there are no established conventions. Use short, imperative commit messages (for example `Add workshop syllabus section`).
- PRs should include a clear summary, list affected pages, and provide screenshots for visual changes.

## Configuration & Deployment Notes
- Update contact placeholders in `index.html`, `contact.html`, and `content/site.json`.
- Replace the Formspree form ID in `contact.html` with a real ID.
- Add gallery images to `images/gallery/` and update `content/gallery.json` as needed.
- GitHub Pages deploys from the repo root (see `DEPLOY.md`).
