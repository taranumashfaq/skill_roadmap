(function () {
  function resolveBackendUrl(location = {}, explicitUrl) {
    if (typeof explicitUrl === 'string' && explicitUrl.trim()) {
      return explicitUrl.trim().replace(/\/$/, '');
    }

    const currentPort = String(location.port || '');
    const currentHost = String(location.hostname || 'localhost');

    if (currentPort === '3000' || currentPort === '') {
      return '';
    }

    if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost === '0.0.0.0') {
      return 'http://localhost:3000';
    }

    return 'http://localhost:3000';
  }

  function buildBackendStatusMessage({ isHealthy, hasApiKey, backendUrl, port, errorMessage }) {
    const backendHint = backendUrl ? ` on ${backendUrl}` : ' on the local Node proxy';

    if (!isHealthy) {
      return `The AI backend is unavailable. Start the Node server with "npm start" in the project folder and confirm it is listening${backendHint}.`;
    }

    if (!hasApiKey) {
      return 'The OpenAI API key is missing. Add OPENAI_API_KEY to .env (or OPEN_API_KEY / open_api_key), then restart the Node server.';
    }

    if (errorMessage) {
      return errorMessage;
    }

    return 'The AI backend is unavailable. Please start the Node server and make sure the OpenAI API key is configured in .env.';
  }

  const api = { resolveBackendUrl, buildBackendStatusMessage };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (typeof window !== 'undefined') {
    window.backendSupport = api;
  }
})();
