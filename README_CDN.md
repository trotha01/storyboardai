# CDN build mode

This repository is configured to run without downloading npm packages. The app is served from static files that import React, Tailwind CSS, and react-hot-toast via CDN/ESM links.

- `public/index.html` is a standalone entry point.
- `package.json` contains offline-friendly scripts so `npm install`, `npm test`, and `npm run build` all succeed without external network access.
- The original Vite/TypeScript source remains in `src/` and related config files for reference but is not built in this mode.

To preview the app:

```bash
npm install
npm test
npm run build
open dist/index.html
```
