# PFG Website

Static multi-page website for Pro Football Gridiron.

## Files used for hosting

- `index.html`
- `standings.html`
- `stats.html`
- `schedule.html`
- `rulebook.html`
- `admin.html`
- `styles.css`
- `site.js`
- `admin.js`
- `focus.png`

## Free hosting recommendation

Use Netlify for the easiest setup.

## Netlify deploy steps

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the whole folder contents for this site into Netlify
3. Wait for the deploy to finish
4. Open the generated `netlify.app` URL

## Important note

This site uses `localStorage` and `sessionStorage` for admin data and login state.
That means:

- admin data is saved per browser
- admin login is browser-side only
- if you switch devices or browsers, the saved admin content will not follow automatically

## Admin logins

- `Slary` / `Noob1234`
- `Uhji` / `noob1234`
