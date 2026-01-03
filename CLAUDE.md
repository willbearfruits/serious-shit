# CLAUDE.md

Project guide for **Serious S.H.I.T.** (Super Hyper Incredible Things) - Yaniv Schonfeld's experimental electronics/circuit-bending brand.

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

## File Structure

```
├── index.html           # Landing page - dual-pane hero (Learn / Equip)
├── workshops.html       # Full course catalog + booking forms
├── sales.html           # Fuzilator product page with order form
├── contact.html         # Contact form
├── about.html           # About page (deprioritized)
├── mods.html            # Mods page (deprioritized, strikethrough in nav)
├── gallery.html         # Gallery (deprioritized)
│
├── css/
│   ├── style.css        # Main styles (IBM Plex Mono + Inter)
│   └── glitch.css       # Button/UI overrides, high-contrast fixes
│
├── js/
│   └── main.js          # Lang toggle, theme toggle, lightbox, booking params
│
├── content/             # JSON data (legacy, mostly unused now)
│   ├── workshops.json
│   ├── products.json
│   ├── gallery.json
│   └── mods.json
│
├── images/
│   ├── products/        # Product photos (fuzilator.jpg)
│   ├── workshops/
│   ├── gallery/
│   └── about/
│
└── DEPLOY.md            # Deployment notes
```

## Core Systems

### Bilingual Toggle
- **HTML**: Content duplicated with `.lang-en` / `.lang-he` classes
- **CSS**: `body[data-lang="en"]` / `body[data-lang="he"]` controls visibility
- **JS**: `localStorage` persistence, auto-sets `dir="rtl"` for Hebrew
- **Default**: Hebrew (`he`)

### Theme System
- Toggle via `data-theme="light|dark"` on `<html>`
- Respects `prefers-color-scheme`, stored in localStorage
- Colors defined as CSS custom properties in `:root`

### Forms & Contact

**Workshops** - Google Form embedded:
```
https://docs.google.com/forms/d/e/1FAIpQLSeXK0PPF8B9_xSPqBF5nfzZ-H9TAXQbMGGe5FLYCmjsn54Hsg/viewform?embedded=true
```

**Sales (Fuzilator)** - WhatsApp + Email only (no form)

**Contact** - WhatsApp + Email only (no form)

### Smart Booking Links
- URL param `?book=fuzz-pedal` auto-selects workshop and scrolls to form
- Handled by `handleBookingParams()` in main.js

## Current Priorities

### 1. Workshops (PRIMARY)
Three courses offered:
- **ESP32 Digital Synth + AI** (7 meetings, 2,200 NIS) - NEW
- **DIY Guitar Pedal / Fuzz** (8 meetings, 2,700 NIS) - Cycle 5
- **1-Bit Synth & Drone Machines** (5 meetings)

Features:
- Full syllabus with meeting breakdowns
- 4h/week open lab access (Haifa makerspace)
- Guest lecture by Anton Nota (Deaftone Audio)
- Components included

### 2. The Fuzilator PukeMachine (FLAGSHIP)
- Dual LPB2 gain stages + feedback loop + internal piezo
- Limited run: 13 units
- Price: $333 / 1,100 NIS
- Dedicated page: `sales.html`

### 3. Everything Else (DEPRIORITIZED)
- Mods, Gallery, About are "under destruction"
- Mods link has `text-decoration: line-through` in nav

## Design System

### Colors
```css
--accent: #ff3300;        /* Industrial orange-red */
--bg: #ffffff;            /* Light mode */
--surface: #f4f4f4;
--text: #111111;
--border: #111111;        /* Thick, solid borders */
```

### Typography
- **Headings**: Inter, 800 weight, uppercase
- **Body**: Inter, 400/600
- **Mono**: IBM Plex Mono (specs, code, technical info)

### Components
- `.split-hero` - Dual-pane clickable hero sections
- `.workshop-card` - Card with visual + content columns
- `.tech-header` - Section header with meta info
- `.pane-cta` - Bordered call-to-action buttons
- `.lab-info-box` - Monospace info boxes
- `.btn-primary` - High-contrast accent buttons with hard shadow

## Dev Commands

```bash
# Local server
python -m http.server 8000
# or
npx serve
```

## Content Guidelines

- **No marketing fluff** - Direct, honest copy
- **Bilingual everything** - EN + HE for all user-facing text
- **Outcome-first** - Lead with what participants build/learn
- **Technical specs visible** - Show signal paths, chip names, prices upfront
- **Glitch aesthetic** - Embrace the raw, unpolished, "defective-on-purpose" vibe

## GitHub Pages Deployment Checklist

### Before Deploying

1. **Google Forms**: Already configured and embedded in all pages

2. **Add images** (optional):
   - Gallery images to `images/gallery/`
   - Workshop photos to `images/workshops/`

3. **Test locally**:
   ```bash
   python -m http.server 8000
   ```
   Then visit http://localhost:8000

### Deploy to GitHub Pages

1. Create a new repo on GitHub
2. Push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to repo **Settings** → **Pages**
4. Set source to **main** branch, root folder
5. Site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Post-Deploy

- Test all forms work (Google Forms receive submissions)
- Test WhatsApp links open correctly
- Test language toggle (EN/HE)
- Test theme toggle (Light/Dark)
- Check mobile responsiveness

## Easter Egg: S.H.I.T. OS

Hidden experimental Win95-style interface accessible via **Konami Code**:

```
Up Up Down Down Left Right Left Right B A
```

### Files
- `os.html` - Main OS interface
- `css/os.css` - Retro Windows 95 styling
- `js/os.js` - Window management, terminal, boot sequence

### Features
- **Boot sequence** with loading animation
- **Draggable windows** with minimize/maximize/close
- **Desktop icons** that open windows on double-click
- **Start menu** with program list
- **Taskbar** with open windows and clock
- **Terminal** with commands: `help`, `workshops`, `gear`, `contact`, `exit`, `clear`, `matrix`
- **ESC** key to exit back to normal site

### Direct Access
You can also access directly via `os.html` (not linked from main site)
