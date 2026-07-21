# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- npm

## Setup

Install project dependencies:

```bash
npm install
```

Install Express for the local server:

```bash
npm install express
```

## Running the Server

Start the local development server:

```bash
node express.js
```

The server will start on `http://localhost:9000`.

## Endpoints

### Stats Card

```
http://localhost:9000/api?image=<namespace/repository>
```

Example URLs:

```
http://localhost:9000/api?image=nginx
http://localhost:9000/api?image=library/nginx
http://localhost:9000/api?image=library/nginx&theme=dark
http://localhost:9000/api?image=library/nginx&label=Docker%20Image
http://localhost:9000/api?image=library/nginx&hide=stars,updated
http://localhost:9000/api?image=library/nginx&title_color=ff6e96&bg_color=282a36
```

Official images can use the short name (e.g., `nginx` instead of `library/nginx`).

### Badge

```
http://localhost:9000/api/badge?image=<namespace/repository>
```

Example URLs:

```
http://localhost:9000/api/badge?image=nginx
http://localhost:9000/api/badge?image=nginx&type=stars
http://localhost:9000/api/badge?image=nginx&label=Custom%20Label
http://localhost:9000/api/badge?image=nginx&style=for-the-badge
```

## Running Tests

```bash
npm test
```

With coverage report:

```bash
npm run test:coverage
```

## Notes

- The Docker Hub API is public and requires no authentication or API keys.
- Responses are SVG images. Open the URLs directly in a browser to see the rendered output.
- No environment variables are needed.
