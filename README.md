# Damcraft

Production website for Damcraft, a design and technology studio from Noida.

The static pages, fonts, images, and Three.js hero live in `public/`. Next.js serves the clean page URLs and the contact endpoint.

```sh
npm ci
npm run dev
npm run build
npm start
```

Push `master` to deploy through the existing Vercel project at https://damcraft.com.

The contact page supports direct email to hello@damcraft.com. To enable server delivery, configure `RESEND_API_KEY` and `CONTACT_EMAIL` in Vercel; `CONTACT_FROM` optionally selects a verified sender. Without those settings, the form opens an email draft in the visitor’s email app.

Three.js is distributed under the MIT license in `public/assets/vendor/THREE-LICENSE.txt`. Existing artwork and font rights remain with their owners.

Accessibility implementation, repeatable audit commands, and manual review limits are documented in [ACCESSIBILITY.md](ACCESSIBILITY.md).
