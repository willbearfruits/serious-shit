# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

**Serious S.H.I.T.** (Super Hyper Incredible Things) - Yaniv Schonfeld's experimental electronics/circuit-bending brand. Static bilingual site deployed on GitHub Pages.

## Quick Facts

| | |
|---|---|
| **Platform** | GitHub Pages (static HTML/CSS/JS) |
| **Languages** | Bilingual: Hebrew (RTL) + English (LTR) |
| **Aesthetic** | Industrial, raw, glitch-punk. "Nothing Is Holy." |
| **Status** | Active. Workshop batch starts Feb 3rd. |

## Contact Info

| Channel | Link |
|---------|------|
| **WhatsApp** | [+972-53-926-3808](https://wa.me/972539263808) |
| **Email** | Dogme84@gmail.com |
| **Instagram** | [@shitisizers](https://www.instagram.com/shitisizers/) |

## Development Commands

```bash
# Local development server
python -m http.server 8000
# OR
npx serve

# Then visit http://localhost:8000
```

**No build process** - This is a static site with vanilla HTML/CSS/JS.

## Architecture Overview

### Bilingual System (EN/HE)
The entire site operates in two languages using a **CSS-controlled visibility system**:

1. **HTML**: All content is duplicated with `.lang-en` and `.lang-he` wrapper classes
2. **CSS**: `[data-lang="en"]` and `[data-lang="he"]` on `<html>` controls which content shows
3. **JavaScript** (`main.js`):
   - Persists language choice in `localStorage` as `sshit-lang`
   - Auto-sets `dir="rtl"` for Hebrew, `dir="ltr"` for English
   - Inline script in `<head>` prevents flash of wrong language on page load
4. **Default**: Hebrew (`he`)

**When editing content**: Always update both `.lang-en` AND `.lang-he` blocks. Missing translations will cause empty sections.

### Theme System (Light/Dark)
- Set via `data-theme="light|dark"` attribute on `<html>`
- Persisted in `localStorage` as `sshit-theme`
- Respects `prefers-color-scheme` if no saved preference
- All colors use CSS custom properties in `:root` and `[data-theme="dark"]`
- Toggle handled by `main.js`

### State Management Pattern
```javascript
// Language state lives in:
localStorage.getItem('sshit-lang')     // 'en' or 'he'
document.documentElement.dataset.lang  // Applied to <html>

// Theme state lives in:
localStorage.getItem('sshit-theme')    // 'light' or 'dark'
document.documentElement.dataset.theme // Applied to <html>
```

### Smart Booking Links
URL parameters auto-fill workshop registration forms:
- `?book=fuzz-pedal` → auto-selects "DIY Guitar Pedal" in form dropdown
- `?book=esp32-synth` → auto-selects "ESP32 Synth"
- Implemented in `main.js:handleBookingParams()`

## Page Structure & Purpose

| Page | Status | Purpose |
|------|--------|---------|
| `index.html` | **PRIMARY** | Landing page with dual-pane hero (Learn/Equip), workshop previews, Fuzilator teaser |
| `workshops.html` | **PRIMARY** | Course catalog with comparison table |
| `workshop-esp32.html` | **PRIMARY** | Full ESP32 workshop details + syllabus + Google Form embed |
| `workshop-pedal.html` | **PRIMARY** | Full pedal workshop details + syllabus + Google Form embed |
| `sales.html` | **PRIMARY** | Fuzilator product page with YouTube demo, specs, WhatsApp/email CTAs |
| `contact.html` | Active | Contact info (WhatsApp, email, Instagram) |
| `about.html` | Active | Yaniv's bio, philosophy, tech stack |
| `gallery.html` | **DEPRIORITIZED** | Shows "TBA" placeholder, ready for future image content |
| `mods.html` | **DEPRIORITIZED** | Shows "404 UNDER_CONSTRUCTION", intentionally incomplete |
| `os.html` | Easter Egg | Win95-style OS interface (Konami code activated) |

### Forms & Contact Methods

**Workshop Registration**: Google Forms embedded in workshop-*.html pages
```
Form URL: https://docs.google.com/forms/d/e/1FAIpQLSeXK0PPF8B9_xSPqBF5nfzZ-H9TAXQbMGGe5FLYCmjsn54Hsg/viewform
```

**Sales & General Contact**: Direct communication only (no forms)
- WhatsApp: [+972-53-926-3808](https://wa.me/972539263808)
- Email: Dogme84@gmail.com

## Workshop & Product Info

### Active Workshops (Feb 2026 batch)
- **ESP32 Digital Synth + AI**: 7 meetings, 2,200 NIS - Learn AI-assisted firmware coding
- **DIY Guitar Pedal / Fuzz**: 8 meetings, 2,200 NIS - Build analog fuzz pedal (Cycle 5)

**All courses include**:
- Full kit with components
- 4 hours/week open lab access (Haifa makerspace)
- Guest lecture by Anton Nota (Deaftone Audio) for pedal course

### Flagship Product: Fuzilator PukeMachine
- Dual LPB2 gain stages + feedback loop + internal piezo contact mic
- Limited run: 13 units
- Price: $333 USD / 1,100 NIS
- YouTube demo embedded on `sales.html`

## Design System & Aesthetic

**Philosophy**: "Built by engineers, not marketers" - Industrial, raw, glitch-punk aesthetic

### CSS Architecture
- **Main stylesheet**: `css/style.css` - All layout, typography, components
- **Overrides**: `css/glitch.css` - Imported by style.css for UI tweaks
- **Easter egg**: `css/os.css` - Win95 retro styling for os.html

**Color System** (CSS custom properties):
```css
:root {
  --accent: #ff3300;      /* Industrial orange-red */
  --bg: #ffffff;
  --text: #111111;
  --border: #111111;      /* Thick, solid borders everywhere */
}

[data-theme="dark"] {
  --accent: #ff4400;
  --bg: #050505;
  --text: #e0e0e0;
  --border: #444444;
}
```

**Typography Stack**:
- Headings: **Inter** 800 weight, uppercase, letter-spacing
- Body: **Inter** 400/600
- Technical text: **IBM Plex Mono** (specs, code blocks, signal paths)

### Key Components (see style.css for full definitions)
- `.split-hero` - Dual-pane hero sections with hover effects
- `.workshop-card` - Grid layout with visual + content columns
- `.tech-header` - Section headers with monospace metadata
- `.pane-cta` - Primary CTA buttons with thick borders
- `.btn-primary` - High-contrast accent buttons with hard shadow

## Content Writing Guidelines

When editing copy, maintain this tone:
- **No marketing fluff** - Direct, honest, technical language
- **Outcome-first** - Lead with what participants build/learn
- **Show specs** - Signal paths, chip names, prices visible upfront
- **Bilingual parity** - EN and HE versions must convey same info
- **Glitch aesthetic** - Embrace raw, unpolished, "defective-on-purpose" vibe
- **"Nothing Is Holy"** - Brand philosophy, appears in footer

## Deployment

**Current deployment**:
- Repository: https://github.com/willbearfruits/serious-shit
- Live site: https://willbearfruits.github.io/serious-shit/

### Deploying Updates

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

GitHub Pages automatically rebuilds within 1-2 minutes.

### Testing Before Push

1. Run local server: `python -m http.server 8000`
2. Test checklist:
   - [ ] Language toggle (EN/HE) works, no missing translations
   - [ ] Theme toggle (Light/Dark) persists on refresh
   - [ ] All WhatsApp links format correctly
   - [ ] Google Forms embed loads
   - [ ] Mobile responsive (check phone viewport)
   - [ ] Konami code Easter egg (↑↑↓↓←→←→BA)

## Easter Egg: S.H.I.T. OS

**Activation**: Konami Code (`↑↑↓↓←→←→BA`) triggers glitch effect → redirect to `os.html`

**Implementation**:
- Listener in `main.js` (lines 376-409)
- Glitch effect: CSS filter inversion before redirect
- Separate UI system (Win95-style OS interface)

**Files**:
- `os.html` - Standalone page with desktop UI
- `css/os.css` - Retro Windows 95 styling
- `js/os.js` - Window management, draggable windows, terminal emulator

**Features**:
- Boot sequence animation
- Draggable/minimizable windows
- Terminal with custom commands (`help`, `workshops`, `gear`, `matrix`, etc.)
- ESC key returns to main site

**Direct access**: Navigate to `/os.html` (not linked in nav)

---

## Known Issues & Future Work

### Recently Fixed
1. **Pedal workshop pricing** - Confirmed 2,200 NIS is correct
2. **Pedal workshop syllabus** - Now shows all 8 meetings on home page
3. **Nav link styling for Mods/Gallery** - Implemented `.coming-soon` class with line-through styling
4. **Form registration UX** - Added note about Google account requirement; WhatsApp is primary alternative
5. **ESP32 workshop AI requirement** - Added laptop + AI subscription (~$20/month) requirement to English page

### Intentional Incompleteness
- **Gallery**: Empty by design, shows "TBA" message
- **Mods**: Shows 404 page intentionally (deprioritized feature)
- **About**: Complete but low priority

### Content Placeholders
- `content/*.json` files are legacy/unused (site uses inline HTML content now)
- `.gitkeep` files in `images/` subdirectories maintain folder structure
- Only `images/products/fuzilator.jpg` contains actual media currently
