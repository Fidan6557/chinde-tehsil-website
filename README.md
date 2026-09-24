# Çində Təhsil — frontend

Premium, responsive Azerbaijani landing page for an education consultancy focused on study opportunities in China.

## Run locally

No build step or dependencies are required. Open `index.html` directly, or serve the directory with any static server:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Required production configuration

Edit `SITE_CONFIG` at the top of `script.js` and add verified company information:

- `whatsappNumber`: digits only, including country code (for example `994501234567`)
- `formEndpoint`: optional HTTPS endpoint accepting JSON form submissions
- `instagramUrl`
- `email`
- `address`

WhatsApp controls and empty footer fields stay hidden until real values are supplied. The form uses the configured endpoint first and falls back to a pre-filled WhatsApp message when a WhatsApp number is available. It never displays a false success state when neither channel is configured.

## Content to add later

- Original brand logo files (SVG preferred)
- Verified phone, social, email and office address
- Real student acceptance results or letters with publication consent
- Verified university catalog data
- Production domain for the canonical URL and absolute Open Graph image URL

## Image credit

The hero uses a real photograph of Peking University by Bangyu Wang, sourced from [Unsplash](https://unsplash.com/photos/a-man-riding-a-bike-down-a-tree-lined-street-xVxya6wkwwE) under the Unsplash License. The university is shown as an editorial campus example and is not presented as an official partner.
