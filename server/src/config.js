import 'dotenv/config';

function int(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: int(process.env.PORT, 8787),
  clientOrigin: process.env.CLIENT_ORIGIN || '*',

  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions',

  audit: {
    maxBodyBytes: int(process.env.AUDIT_MAX_BODY_BYTES, 3 * 1024 * 1024),
    requestTimeoutMs: int(process.env.AUDIT_REQUEST_TIMEOUT_MS, 12000),
    maxRedirects: 5,
  },

  rateLimit: {
    windowMs: int(process.env.AUDIT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: int(process.env.AUDIT_RATE_LIMIT_MAX, 10),
  },
};

if (!config.groqApiKey) {
  console.warn('[config] GROQ_API_KEY is not set — AI analysis and code-fix endpoints will fail until it is configured in server/.env');
}
