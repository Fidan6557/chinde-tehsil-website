# Çində Təhsil — frontend

Premium, responsive Azerbaijani landing page for an education consultancy focused on study opportunities in China.

## Run locally

No build step or dependencies are required. Open `index.html` directly, or serve the directory with any static server:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Required production configuration

The consultation flow and every WhatsApp CTA currently use the verified number `+994 77 389 34 81`. Edit `SITE_CONFIG` at the top of `script.js` when contact details change:

- `whatsappNumber`: digits only, including country code
- `whatsappDisplay`: human-readable phone number
- `formEndpoint`: optional HTTPS endpoint accepting JSON form submissions
- `instagramUrl`
- `email`
- `address`

WhatsApp controls and empty footer fields stay hidden until real values are supplied. The form uses the configured endpoint first and falls back to a pre-filled WhatsApp message when a WhatsApp number is available. It never displays a false success state when neither channel is configured.

## Content to add later

- Original brand logo files (SVG preferred)
- Verified social, email and office address
- Real student acceptance results or letters with publication consent
- Verified university catalog data
- Custom production domain and absolute Open Graph image URL

## Image credit

The hero uses a real photograph of Peking University's Weiming Lake and Boya Pagoda, sourced from [PxHere](https://pxhere.com/en/photo/921876) under the CC0 public-domain dedication. The university is shown as an editorial campus example and is not presented as an official partner.
