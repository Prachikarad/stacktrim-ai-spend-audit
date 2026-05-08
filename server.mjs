import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fallbackSummary } from './src/audit-engine.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 5173);
const rateLimit = new Map();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function isLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 20;
  const hits = (rateLimit.get(ip) || []).filter((time) => now - time < windowMs);
  hits.push(now);
  rateLimit.set(ip, hits);
  return hits.length > max;
}

async function summarizeWithAnthropic(audit) {
  if (!process.env.ANTHROPIC_API_KEY) return fallbackSummary(audit);
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 140,
      messages: [
        {
          role: 'user',
          content: `Write a direct 100-word AI spend audit summary for a startup. Be specific, cite total monthly and annual savings, mention Credex only when credexFit is true, and do not invent facts.\n\n${JSON.stringify(audit)}`
        }
      ]
    })
  });
  if (!response.ok) throw new Error(`Anthropic ${response.status}`);
  const data = await response.json();
  return data.content?.map((part) => part.text).filter(Boolean).join('\n') || fallbackSummary(audit);
}

async function sendLeadEmail(lead) {
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_TO_EMAIL) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || 'StackTrim <audit@stacktrim.local>',
      to: [lead.email],
      bcc: [process.env.LEAD_TO_EMAIL],
      subject: `Your StackTrim AI spend audit: ${lead.audit?.monthlySavings || 0}/mo found`,
      text: `Thanks for using StackTrim.\n\nMonthly savings: $${lead.audit?.monthlySavings || 0}\nAnnual savings: $${lead.audit?.annualSavings || 0}\nCredex fit: ${lead.audit?.credexFit ? 'yes' : 'no'}\n\nCredex can help high-savings teams capture more of this opportunity.`
    })
  });
  return response.ok;
}

async function handleApi(req, res, pathname) {
  const ip = req.socket.remoteAddress || 'unknown';
  if (isLimited(ip)) return json(res, 429, { error: 'Rate limit exceeded' });

  try {
    if (pathname === '/api/summary' && req.method === 'POST') {
      const { audit } = await readJson(req);
      const summary = await summarizeWithAnthropic(audit);
      return json(res, 200, { summary });
    }

    if (pathname === '/api/leads' && req.method === 'POST') {
      const lead = await readJson(req);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email || '')) {
        return json(res, 400, { error: 'Valid email required' });
      }
      await mkdir(join(root, 'data'), { recursive: true });
      const file = join(root, 'data', 'leads.json');
      let leads = [];
      try {
        leads = JSON.parse(await readFile(file, 'utf8'));
      } catch {
        leads = [];
      }
      leads.push({ ...lead, capturedAt: new Date().toISOString() });
      await writeFile(file, JSON.stringify(leads, null, 2));
      const emailed = await sendLeadEmail(lead);
      return json(res, 200, { ok: true, emailed });
    }
  } catch (error) {
    return json(res, 500, { error: error.message });
  }

  return json(res, 404, { error: 'Not found' });
}

async function serveStatic(req, res, pathname) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  const normalized = normalize(cleanPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(root, normalized);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  } catch {
    const fallback = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'Content-Type': contentTypes['.html'] });
    res.end(fallback);
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url.pathname);
  return serveStatic(req, res, url.pathname);
}).listen(port, () => {
  console.log(`StackTrim running at http://localhost:${port}`);
});
