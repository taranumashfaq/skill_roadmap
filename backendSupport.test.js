const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveBackendUrl, buildBackendStatusMessage } = require('./backendSupport.js');

test('resolveBackendUrl uses same-origin when app runs on the backend port', () => {
  const url = resolveBackendUrl({ port: '3000', hostname: 'localhost' });
  assert.equal(url, '');
});

test('resolveBackendUrl falls back to localhost backend for static frontends', () => {
  const url = resolveBackendUrl({ port: '8000', hostname: 'localhost' });
  assert.equal(url, 'http://localhost:3000');
});

test('buildBackendStatusMessage explains the missing API key clearly', () => {
  const message = buildBackendStatusMessage({
    isHealthy: false,
    hasApiKey: false,
    backendUrl: 'http://localhost:3000',
    port: '3000'
  });

  assert.match(message, /OPENAI_API_KEY/i);
  assert.match(message, /\.env/i);
});
