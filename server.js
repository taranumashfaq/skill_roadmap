require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Prefer native fetch when available (Node 18+). Fall back to node-fetch if installed.
let fetchFn = null;
if (typeof globalThis.fetch === 'function') fetchFn = globalThis.fetch;
else {
  try {
    // node-fetch v3 exports as default
    const nf = require('node-fetch');
    fetchFn = nf.default || nf;
  } catch (e) {
    fetchFn = null;
  }
}

const app = express();
const port = Number(process.env.PORT) || 3000;
// Support multiple environment variable names so users can set either
// `OPENAI_API_KEY`, `OPEN_API_KEY` or `open_api_key` (some tutorials/tools use different names).
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPEN_API_KEY || process.env.open_api_key || null;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files from the project root so the site and API run on one port
app.use(express.static(path.join(__dirname, '.')));

app.get('/health', (_req, res) => {
  res.json({
    ok: !!OPENAI_API_KEY,
    status: OPENAI_API_KEY ? 'ready' : 'missing_api_key',
    hasApiKey: !!OPENAI_API_KEY,
    port
  });
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  if (!OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OpenAI API key not set. Copy .env.example to .env and set `OPENAI_API_KEY` or `open_api_key`, then restart the server.'
    });
  }

  if (!fetchFn) {
    return res.status(500).json({ error: 'No fetch available on the server. Install node-fetch or use Node 18+' });
  }

  try {
    const r = await fetchFn('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a career roadmap and learning site.' },
          { role: 'user', content: prompt.trim() }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!r.ok) {
      const text = await r.text();
      try {
        const parsed = JSON.parse(text);
        const errorMessage = parsed && parsed.error && parsed.error.message ? parsed.error.message : 'OpenAI request failed';
        return res.status(r.status).json({
          error: errorMessage,
          details: parsed
        });
      } catch (error) {
        return res.status(r.status).json({ error: text || 'OpenAI request failed' });
      }
    }

    const j = await r.json();
    const output = (
      (j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) ||
      (j && j.choices && j.choices[0] && j.choices[0].text) ||
      ''
    );
    res.json({ output, raw: j });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected backend error' });
  }
});

app.listen(port, () => console.log(`AI proxy listening on http://localhost:${port}`));
