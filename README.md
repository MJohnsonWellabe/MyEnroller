# MyEnroller Website

Professional multi-page website for MyEnroller, built in plain HTML/CSS/JavaScript — no build tools required.

## Enabling GitHub Pages

1. Push all files to your GitHub repository
2. Go to **Settings → Pages**
3. Under "Source," select **Deploy from a branch**
4. Choose `main` branch, `/ (root)` folder → click **Save**
5. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## File Structure

```
/
├── index.html                  ← Homepage
├── assets/
│   ├── css/
│   │   └── style.css           ← All styles (edit brand colors here)
│   ├── js/
│   │   ├── components-root.js  ← Nav/footer for index.html
│   │   ├── components.js       ← Nav/footer for /pages/ subpages
│   │   └── nav.js              ← Hamburger & accordion behavior
│   ├── images/                 ← Drop images here
│   │   ├── MyEnrollerSS1.jpg
│   │   ├── MyEnrollerSS2.jpg
│   │   └── MyEnrollerSS3.jpg
│   └── videos/                 ← Drop video files here (see below)
└── pages/
    ├── about.html
    ├── products.html
    ├── medicare-supplement.html
    ├── preneed.html
    ├── final-expense.html
    ├── annuity.html
    ├── ancillary-health.html
    ├── tools.html
    ├── activity-map.html
    ├── my-easy-match.html
    ├── messaging.html
    ├── incentives.html
    ├── app-scanning.html
    ├── lead-gen.html
    ├── contact.html
    └── join-the-team.html
```

## Customization Checklist

### 1. Brand / Company Name
- Search and replace `MyEnroller` with your final company name across all HTML files
- Update the `<title>` tags on each page if needed

### 2. Contact Information
- Search for `PLACEHOLDER: Add phone number` and replace with real number
- Search for `info@myenroller.com` and replace with real email
- To make the contact form send emails, sign up at [Formspree](https://formspree.io), get a form ID, and update the form action:
  ```html
  <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  ```

### 3. Videos to Upload
Upload video files to `assets/videos/` and then update the placeholder blocks:

| Page | Video File | Replace placeholder with |
|------|-----------|--------------------------|
| Medicare Supplement | `myenroller4_board_vfinal.mp4` | `<video controls ...><source src="../assets/videos/myenroller4_board_vfinal.mp4" type="video/mp4"></video>` |
| Preneed | `myenrollerupgrades_board2025_final.mp4` | Same pattern |
| Final Expense | *(pending)* | Add when available |
| Ancillary Health | *(pending)* | Add when available |
| App Scanning | *(pending)* | Add when available |

The Annuity page already embeds from YouTube — no upload needed.

### 4. Platform Advantage Graphic
- Export `Platform_Advantage.pptx` as a PNG or JPG
- Save to `assets/images/platform-advantage.png`
- On `index.html`, find the PLACEHOLDER comment and replace with:
  ```html
  <img src="assets/images/platform-advantage.png" alt="Platform Advantage" style="border-radius:8px;margin-top:1rem;max-width:100%;" />
  ```

### 5. Screenshots / Images for Tool Pages
Each tool page has a clearly marked image placeholder. Drop screenshots into `assets/images/` and replace placeholders with `<img>` tags.

### 6. Stats & Metrics
Pages for My Easy Match and Messaging have placeholder spots for utilization stats. Add real numbers when available.

### 7. Open Roles (Join the Team)
When roles open up, uncomment the sample role card in `join-the-team.html` and fill in the details. Duplicate the card block for multiple roles.

### 8. Colors
All brand colors are defined as CSS variables at the top of `assets/css/style.css`:
```css
--navy:  #0B1F4A;
--aqua:  #00B5C8;
```
Change these two values to update the entire site's color scheme.

## Editing Pages on GitHub

Every page follows the same structure — edit content between the `<div class="page-content">` tags. The nav and footer are injected automatically by the JS components files, so you only need to update them in one place (`components.js` and `components-root.js`).
