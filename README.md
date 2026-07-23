# Story Forge.AI Frontend

This is the replacement frontend for Story Forge.AI.

## Structure

- `index.html` - application shell
- `css/` - welcome, authentication, and dashboard styling
- `js/api.js` - backend connection
- `js/welcome.js` - cinematic welcome animation
- `js/auth.js` - login and signup
- `js/dashboard.js` - dashboard navigation
- `js/app.js` - page management

## Backend

The frontend is configured to use:

`https://story-forge-ai-backend.onrender.com`

If your backend uses different route names, edit `js/api.js`.

Current expected routes:

- `POST /signup`
- `POST /login`
- `POST /forgot-password`
- `POST /verify-email`

## Deploying to Render

For a static site:

- Root Directory: leave empty if this folder is the repository root
- Build Command: leave empty
- Publish Directory: `.`
- The site entry file is `index.html`

If this frontend is inside a folder named `frontend`, set:

- Root Directory: `frontend`
- Build Command: leave empty
- Publish Directory: `.`

## Important

The CSS animation creates the cinematic welcome scene without requiring image files. The rider and futuristic bike are built from CSS shapes so the project can be uploaded directly to GitHub without missing image assets.

For a more photorealistic cinematic character later, replace the CSS rider with a properly licensed 3D model, video, or image asset.
