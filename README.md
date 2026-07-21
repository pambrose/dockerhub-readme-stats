# Docker Hub Readme Stats

Dynamically generated Docker Hub stats for your GitHub READMEs — inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats).

## Features

- Docker Hub image stats card (pulls, stars, latest release version and date)
- Simple pull/star count badges
- 11 built-in themes
- Fully customizable colors
- Vercel serverless deployment — zero infrastructure
- Caching via CDN for fast responses

## Usage

### Stats Card

Add this to your README:

```md
![Docker Hub Stats](https://your-deployment.vercel.app/api?image=library/nginx)
```

#### Query Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image` | **Required.** Docker Hub image (`nginx` or `user/repo`) | — |
| `theme` | Theme name (see [themes](#themes)) | `default` |
| `label` | Text shown after the image name in the title | `Stats` |
| `title_color` | Title color (hex without `#`) | theme default |
| `text_color` | Text color (hex) | theme default |
| `icon_color` | Icon color (hex) | theme default |
| `bg_color` | Background color (hex) | theme default |
| `border_color` | Border color (hex) | theme default |
| `hide_border` | Hide the card border | `false` |
| `hide_title` | Hide the card title | `false` |
| `hide` | Comma-separated stats to hide: `pulls`, `stars`, `updated` (hides the Latest Release row) | — |
| `custom_title` | Custom card title | — |
| `border_radius` | Card corner radius | `4.5` |
| `width` | Card width in pixels | `400` |
| `cache_seconds` | Cache duration (1800–86400) | `1800` |

#### Examples

Default theme:
```md
![Docker Hub Stats](https://your-deployment.vercel.app/api?image=library/nginx)
```

Dark theme:
```md
![Docker Hub Stats](https://your-deployment.vercel.app/api?image=library/nginx&theme=dark)
```

Custom colors:
```md
![Docker Hub Stats](https://your-deployment.vercel.app/api?image=library/nginx&title_color=ff6e96&bg_color=282a36&text_color=f8f8f2&icon_color=bd93f9)
```

Hide stars and latest release:
```md
![Docker Hub Stats](https://your-deployment.vercel.app/api?image=library/nginx&hide=stars,updated)
```

Official images can use the short name (e.g., `nginx` instead of `library/nginx`).

#### Release row

The third row shows the version tag that `:latest` currently points to, alongside the date it was pushed — for example `1.31.3 Released — Jul 20, 2026`.

The version is resolved by finding the version tags that share a digest with `:latest`, so it reflects what users actually get when they pull the image. Repos with no `:latest` tag, or none tagged with a version, fall back to a plain `Latest Release` label with the date. Prerelease tags (`19beta2`, `2.0.0-rc1`) are never shown.

---

### Badge

For a simpler badge (like shields.io style):

```md
![Docker Pulls](https://your-deployment.vercel.app/api/badge?image=library/nginx)
```

#### Badge Query Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image` | **Required.** Docker Hub image | — |
| `label` | Badge label text | `Docker Pulls` |
| `type` | `pulls` or `stars` | `pulls` |
| `color` | Value background color | `#066da5` |
| `label_color` | Label background color | `#555555` |
| `style` | `flat` or `for-the-badge` | `flat` |
| `cache_seconds` | Cache duration (1800–86400) | `1800` |

---

## Themes

| Theme | |
|-------|-|
| `default` | Light background with blue accents |
| `dark` | Dark background with green accents |
| `radical` | Dark purple with pink/cyan |
| `merko` | Dark green theme |
| `gruvbox` | Retro groove colors |
| `tokyonight` | Tokyo Night color scheme |
| `onedark` | Atom One Dark theme |
| `cobalt` | Cobalt blue theme |
| `synthwave` | Synthwave aesthetic |
| `dracula` | Dracula color scheme |
| `blue_navy` | Navy blue theme |

---

## Deploy Your Own

### Deploy to Vercel

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) and create a new project
3. Import your forked repository
4. Deploy — no environment variables needed (Docker Hub API is public)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dockerhub-readme-stats)

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Local Development

Create an `express.js` for local testing:

```js
const express = require("express");
const statsHandler = require("./api/index");
const badgeHandler = require("./api/badge");

const app = express();
app.get("/api", statsHandler);
app.get("/api/badge", badgeHandler);
app.listen(9000, () => console.log("Running on http://localhost:9000"));
```

Then run `node express.js` and visit `http://localhost:9000/api?image=nginx`.

---

## How It Works

1. A Vercel serverless function receives a request with an `image` query parameter
2. It fetches stats from the [Docker Hub API](https://hub.docker.com/v2/repositories/) (public, no auth required)
3. An SVG card or badge is rendered with the stats
4. The SVG is returned with `Cache-Control` headers for CDN caching
5. GitHub renders the SVG inline in your README

---

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.
