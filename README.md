Welcome to my portfolio. If for some reason you want this running locally on your machine then by all means, keep reading. Or if you are in fact myself, and have forgotten a thing or two, then I'm here for you!

# Local setup

## Requirements

- **Node.js** ≥ 20.0.0

Check versions:

```bash
node -v
npm -v
```

## Install

From the root:

```bash
npm install
cd app && npm install && cd ..
cd studio && npm install && cd ..
```

## Sanity

### 1. Accessing Sanity

- Go to [sanity.io/manage](https://sanity.io/manage)
- Note **Project ID** and **Dataset**

### 2. Studio environment

In `studio/`:

```bash
cp .env.example .env
```

Edit `studio/.env` and set:

- `SANITY_STUDIO_PROJECT_ID` – Sanity project ID
- `SANITY_STUDIO_DATASET` – e.g. `production`

### 3. App environment

In `app/`:

```bash
cp .env.example .env
```

Edit `app/.env` and set at least:

- `VITE_SANITY_PROJECT_ID` – same project ID as the studio
- `VITE_SANITY_DATASET` – same dataset (e.g. `production`)
- `VITE_SANITY_STUDIO_HOST` – host where Sanity Studio is served (e.g. `localhost:3333` for local dev)

## Run locally

From the project root:

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start the app (Vite dev server) |
| `npm run dev:studio` | Start Sanity Studio             |

Run both in separate terminals to develop with live content from Sanity.

## Build

```bash
npm run build
npm run build:studio
```

That wasn't too bad. If the above doesn't work, rewrite reality and try again
