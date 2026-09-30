# Generative AI integration (local)

This workspace includes a small AI assistant widget in `index.html` and an optional Node proxy to call the OpenAI API.

Files added:
- `server.js` — small Express proxy that forwards prompts to the OpenAI API. The server accepts `OPENAI_API_KEY`, `OPEN_API_KEY`, or `open_api_key` environment variables.
- `package.json` — lists dependencies and `start` script.

Quick start (without OpenAI key — offline demo):

1. Serve the static site (already available via Python server):

```bash
cd "c:\Users\Admin\Documents\frontend web C1\web class1"
python -m http.server 8000
# open http://localhost:8000 in your browser
```

2. Use the AI widget in the bottom-right. Without the proxy running, it shows an offline/demo response.

To enable real generative responses (requires OpenAI API key):

1. Install dependencies and start the proxy:

```bash
cd "c:\Users\Admin\Documents\frontend web C1\web class1"
npm install
set OPENAI_API_KEY=your_key_here    # Windows Command Prompt
# or in PowerShell: $env:OPENAI_API_KEY = 'your_key_here'
npm start
```

2. Open the site at http://localhost:3000 and use the AI widget — the server serves both the static site and the API at the same origin.

Security note: Do not commit your API key. This proxy is intentionally minimal for local development only.

Using a .env file (recommended):

1. Copy `.env.example` to `.env` in the project root and set your key:

```bash
cd "c:\Users\Admin\Documents\frontend web C1\web class1"
copy .env.example .env    # Windows Command Prompt
# or in PowerShell:
Copy-Item .env.example .env
```

2. Edit `.env` and replace the placeholder with your OpenAI API key:

```
OPENAI_API_KEY=sk-...your key...
```

3. Start the proxy (dotenv is already included in `package.json`):

```bash
npm install
npm start
```

If you prefer not to use a `.env` file, you can set the environment variable directly before starting the proxy. The server accepts any of these names:

- `OPENAI_API_KEY`
- `OPEN_API_KEY`
- `open_api_key`

Set one of them and start the proxy:

```bash
set OPENAI_API_KEY=your_key_here    # Windows cmd
# PowerShell:
$env:OPENAI_API_KEY = 'your_key_here'
npm start
```

