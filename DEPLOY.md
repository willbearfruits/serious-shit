# Deployment Checklist

The site is visually ready ("Practitioner" aesthetic) and structurally complete. 
To make it **publicly viable**, you must manually update the following private information:

## 1. Contact Information
Search for and replace these placeholders in `index.html`, `contact.html`, and `content/site.json`:
*   **WhatsApp:** `972XXXXXXXXX` -> Your real number (e.g., `972541234567`).
*   **Email:** `contact@example.com` -> Your real email (e.g., `yaniv@serious-shit.com`).

## 2. Contact Forms
The site uses **Formspree** for handling emails without a backend.
1.  Go to [formspree.io](https://formspree.io) and register (free tier is usually enough).
2.  Create a new form and get your **Form ID** (e.g., `f/xyoyqvqz`).
3.  Replace `YOUR_FORM_ID` in `contact.html` (and `index.html` / `site.json` if present) with your new ID.

## 3. Images
*   **Fuzilator:** Ensure `images/products/fuzilator.jpg` is the high-res photo you want.
*   **Gallery:** The gallery page is currently using text placeholders. To populate it:
    1.  Add photos to `images/gallery/`.
    2.  Update `content/gallery.json` with the filenames and captions.

## 4. GitHub Pages
1.  Push the code to GitHub.
2.  Go to **Settings > Pages**.
3.  Source: `Deploy from a branch` -> `main` / `root`.
4.  The site will be live at `yourusername.github.io/repo-name`.

## 5. Domain (Optional)
If you have a domain (e.g., `serious-shit.com`):
1.  Add a `CNAME` file to the root directory containing just the domain name.
2.  Configure your DNS provider.

---
**Current Status:**
*   ✅ Design: Practitioner / Technical
*   ✅ Content: Workshops & Fuzilator specs
*   ✅ Mobile: Responsive
*   ⚠️ **Action Required:** Update Phone, Email, and Form ID.
