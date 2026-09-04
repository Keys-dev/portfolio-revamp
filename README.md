# Muhammed Agbaje — React + Vite portfolio

A runnable React + Vite + TypeScript portfolio with actual shadcn/ui components. This is the revised light/cobalt design. It is a web project: there is no Expo or React Native runtime.

## Run on Windows / PowerShell

Install a supported Node.js release matching `package.json` (Node 22.12+; Node 24 LTS is suitable), open this folder in VS Code, and run:

```powershell
npm ci
npm run dev
```

Open the local address Vite prints. To check and build:

```powershell
npm run typecheck
npm test
npm run build
npm run test:browser
npm run preview
```

`test:browser` rebuilds the site, starts a local production preview, and uses
the installed Google Chrome with Playwright Core. It writes representative
full-page captures to `artifacts/browser/`.

Upload `dist` to a static host, or import the repository into Vercel using the included `vercel.json`. The build command is `npm run build`, and the output folder is `dist`. Client routes need the SPA fallback configured in that file. There is no backend or environment key required for this template. Copy email uses the Clipboard API and works on HTTPS or localhost; a failure shows a visible message.

## Edit these files

| Change | File |
| --- | --- |
| Name, contact URLs, resume | `src/data/profile.ts` |
| Project descriptions, order, years, screenshots | `src/data/projects.json` |
| Colors, type, layout, responsive behavior | `src/index.css` |
| Home page and routes | `src/App.tsx` |
| Project screenshot viewer | `src/components/Gallery.tsx` and `ProjectPreview.tsx` |
| About content and skills | `src/components/AboutContent.tsx` |
| Mobile navigation | `src/components/Header.tsx` |
| Contact area and copy action | `src/components/ContactBlock.tsx` |
| Existing project images | `public/images/` |

The screenshot viewer is loaded in its own chunk. All four original projects and their IDs are preserved. Pokédex's description still mentions React Native/Expo because that is how the showcased project was built; the portfolio itself is React + Vite.

## Real shadcn components

`src/components/ui/` contains the Button, Sheet, Dialog, Carousel, Accordion, and Badge components from the installed shadcn catalog, using Radix primitives. The application uses each of them. The Carousel uses Embla; copy-email feedback uses Sonner. `components.json` enables further shadcn additions. See `THIRD_PARTY_NOTICES.md` for attribution.

There are no fake contact submissions, fake project results, or fabricated project source URLs. The project descriptions are drawn from the supplied portfolio, not a full audit of the showcased application repositories. External live URLs and the resume URL are preserved from the original.

## Validation performed

- TypeScript, all five source/render checks, and the production build pass.
- Automated Chrome checks cover cold route loads, Back/Forward navigation,
  document titles, focus after navigation, mobile Sheet focus/Escape/link and
  breakpoint behavior, Accordion keyboard operation, Dialog and Carousel
  controls/state, clipboard success and failure feedback, reduced motion, and
  horizontal overflow.
- Responsive checks pass at 320, 360, 390, 430, 768, 820, 1024, 1280, 1440,
  and 1920 CSS px, a short 768 × 420 landscape viewport, and a 200% root text
  size.
- The startup network check confirms that the Gallery chunk and non-cover
  gallery screenshots are not requested with the initial home page.
- The browser check uses desktop Chrome emulation; it is not a physical-device,
  Safari, or Firefox run. Lighthouse was not available in this workspace.
- `npm audit` reports zero known vulnerabilities after updating Vite to its
  patched release.

The project-year values remain the years from the original portfolio. Some dates
visible inside the supplied screenshots do not align with that metadata; confirm
the intended years before publishing. No project source links are shown because
individual repository URLs were not supplied. The GitHub profile is linked only
as a profile, not misrepresented as a project repository.

No production URL has been assumed or added to metadata. Add canonical/social
URL metadata only after the final public domain is verified. The generated output
is a client-rendered SPA, not server-rendered HTML.

## Migration status

The Vite implementation now lives at the repository root with one package
manifest and lockfile. The handoff brief, design PDF, reference screens, design
tokens, and original project images remain in the repository. Expo, React Native,
React Navigation, and native application configuration are not part of this web
runtime. No remote push or public deployment has been performed.
