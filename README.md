# Serious S.H.I.T. Static Site

Static HTML/CSS/JS site for workshops, gear, and contact.

## Structure

- `index.html` and other root pages (`workshops.html`, `sales.html`, `contact.html`, `about.html`, `mods.html`, `gallery.html`, `os.html`)
- `css/` for styles (`style.css` main, `glitch.css` overrides, `os.css` for the OS page)
- `js/` for behavior (`main.js` for language/theme/UX, `os.js` for the OS)
- `content/` for JSON content (legacy data)
- `images/` for assets (`images/products/`, `images/gallery/`, `images/workshops/`)

## Local Development

Serve the repo root with any static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Forms (FormSubmit)

Forms post to FormSubmit via `https://formsubmit.co/<email>`.

- `_next` redirects to `thank-you.html` after submission. Use a full URL in production if needed.
- `_replyto` is set client-side from the email field so replies go to the submitter.
- `data-form-name` on each form provides a stable analytics label.

## Form Analytics Hook

`js/main.js` emits a `form_submit` event when a FormSubmit form is submitted. The event is sent to whichever analytics client is present:

- `gtag` (GA4)
- `plausible`
- `umami`
- `dataLayer` (GTM)

No analytics script is included by default. Add your provider snippet and keep the event name `form_submit` if you want these hooks to fire.

## Thank-You Page

`thank-you.html` provides a confirmation screen and a small back link that uses browser history (with a fallback to `contact.html`).

## Deployment Notes

See `DEPLOY.md` for launch checklist items like updating contact details and form settings.
