# Pylaex Website

## File Structure
```
/
├── index.html                    ← Homepage
├── assets/
│   ├── css/style.css             ← All styles (edit brand colors here)
│   ├── js/
│   │   ├── components-root.js    ← Nav/footer for index.html
│   │   ├── components.js         ← Nav/footer for /pages/ subpages
│   │   ├── nav.js                ← Hamburger, slideshow, FAQ, tabs
│   │   └── chatbot.js            ← Chat widget
│   ├── images/                   ← Drop images here
│   └── videos/                   ← Drop video files here
└── pages/
    ├── about.html
    ├── products.html
    ├── tools.html
    ├── medicare-supplement.html
    ├── preneed.html
    ├── final-expense.html
    ├── annuity.html
    ├── ancillary-health.html
    ├── activity-map.html
    ├── my-easy-match.html
    ├── messaging.html
    ├── incentives.html
    ├── app-scanning.html
    ├── lead-gen.html
    ├── case-study-stm.html
    ├── case-study-growth.html
    ├── case-study-qob.html
    ├── case-study-satisfaction.html
    ├── see-it-in-action.html
    ├── contact.html
    └── join-the-team.html
```

## Brand Colors (edit in assets/css/style.css)
- `--navy: #0B1C2C` — Ink (backgrounds, nav, footer)
- `--aqua: #12B5CC` — Gate cyan (accents, links)
- `--gold: #C4881A` — Spur Gold (primary CTA, highlights)

## GitHub Pages
1. Push all files to a GitHub repo
2. Settings → Pages → Deploy from branch → main / root
3. Live at https://YOUR-USERNAME.github.io/YOUR-REPO/

## Opening Locally (phone/desktop)
Open index.html directly in a browser. All CSS/JS paths are relative and will work from the filesystem without a server.
