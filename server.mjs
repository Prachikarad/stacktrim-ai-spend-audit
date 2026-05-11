import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fallbackSummary } from './src/audit-engine.js';

const root = fileURLToPath(new URL('.', import.meta.url));
await loadEnvFile(join(root, '.env'));

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

async function loadEnvFile(filePath) {
  try {
    const env = await readFile(filePath, 'utf8');
    for (const line of env.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env is optional in deployed environments.
  }
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

async function storeLeadInSupabase(lead) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return false;

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      authorization: `Bearer ${supabaseKey}`,
      'content-type': 'application/json',
      prefer: 'return=minimal'
    },
    body: JSON.stringify({
      email: lead.email,
      role: lead.role || null,
      company_name: lead.companyName || null,
      team_size: Number(lead.teamSize) || null,
      monthly_savings: Number(lead.audit?.monthlySavings) || 0,
      annual_savings: Number(lead.audit?.annualSavings) || 0,
      credex_fit: Boolean(lead.audit?.credexFit),
      audit: lead.audit || {}
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${message}`);
  }
  return true;
}

async function storeLeadLocally(lead) {
  const storageRoot = process.env.VERCEL ? '/tmp' : join(root, 'data');
  await mkdir(storageRoot, { recursive: true });
  const file = join(storageRoot, 'leads.json');
  let leads = [];
  try {
    leads = JSON.parse(await readFile(file, 'utf8'));
  } catch {
    leads = [];
  }
  leads.push({ ...lead, capturedAt: new Date().toISOString() });
  await writeFile(file, JSON.stringify(leads, null, 2));
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
      let storage = 'supabase';
      try {
        const stored = await storeLeadInSupabase(lead);
        if (!stored) {
          await storeLeadLocally(lead);
          storage = 'local';
        }
      } catch {
        await storeLeadLocally(lead);
        storage = 'local';
      }
      const emailed = await sendLeadEmail(lead);
      return json(res, 200, { ok: true, emailed, storage });
    }
  } catch (error) {
    return json(res, 500, { error: error.message });
  }

  return json(res, 404, { error: 'Not found' });
}

async function serveStatic(req, res, pathname) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  // Remove leading slash to ensure relative path joining works on all platforms
  let normalized = normalize(cleanPath).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]/, '');
  const filePath = join(root, normalized);
  
  // Debug logging
  if (process.env.DEBUG) {
    console.log(`[DEBUG] pathname: ${pathname}, normalized: ${normalized}, filePath: ${filePath}, exists: ${filePath.startsWith(root)}`);
  }
  
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
  } catch (err) {
    // Only serve index.html for HTML navigation routes (no file extension)
    if (!extname(normalized)) {
      const fallback = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': contentTypes['.html'] });
      res.end(fallback);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Not found: ${filePath}`);
    }
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url.pathname);
  return serveStatic(req, res, url.pathname);
}).listen(port, () => {
  console.log(`StackTrim running at http://localhost:${port}`);
});
