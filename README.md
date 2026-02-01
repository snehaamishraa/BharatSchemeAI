# BharatSchemeAI

A Vite-powered web app for browsing Indian government schemes with quick search and multilingual UI support.

## Features

- Search and explore schemes from a local data set
- Clean, responsive interface
- Multilingual text via translations configuration
- Static hosting ready (Vercel)

## Tech Stack

- Vite
- Vanilla JavaScript
- HTML/CSS

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
public/
  schemes.json
app.js
index.html
main.js
styles.css
translations.js
```

## Usage

1. Start the dev server.
2. Open the local URL shown in the terminal.
3. Use the search input to find schemes and switch languages if available.

### Update Scheme Data

- Edit `public/schemes.json` and refresh the page.

## Data

- Scheme data is stored in `public/schemes.json`.

## Deployment

- Optimized for Vercel. A `vercel.json` is included.

## License

MIT
