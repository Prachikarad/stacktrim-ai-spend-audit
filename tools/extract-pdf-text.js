const fs = require('fs');
const zlib = require('zlib');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node tools/extract-pdf-text.js <pdf>');
  process.exit(1);
}

const bytes = fs.readFileSync(file);
const latin = bytes.toString('latin1');

function decodePdfString(value) {
  let out = '';
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (ch !== '\\') {
      out += ch;
      continue;
    }
    const next = value[++i];
    if (next === 'n') out += '\n';
    else if (next === 'r') out += '\r';
    else if (next === 't') out += '\t';
    else if (next === 'b') out += '\b';
    else if (next === 'f') out += '\f';
    else if (next === '(' || next === ')' || next === '\\') out += next;
    else if (/[0-7]/.test(next || '')) {
      let oct = next;
      for (let j = 0; j < 2 && /[0-7]/.test(value[i + 1] || ''); j += 1) {
        oct += value[++i];
      }
      out += String.fromCharCode(parseInt(oct, 8));
    } else if (next !== '\n' && next !== '\r') {
      out += next || '';
    }
  }
  return out;
}

function decodeHexString(hex) {
  const clean = hex.replace(/\s+/g, '');
  let out = '';
  for (let i = 0; i < clean.length; i += 2) {
    out += String.fromCharCode(parseInt(clean.slice(i, i + 2).padEnd(2, '0'), 16));
  }
  return out;
}

function printable(text) {
  return text
    .replace(/\u0000/g, '')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '')
    .replace(/[ \t]+/g, ' ');
}

const chunks = [];
const streamRe = /<<(?:.|\r|\n)*?>>\s*stream\r?\n/g;
let match;
while ((match = streamRe.exec(latin))) {
  const dict = match[0];
  const start = match.index + match[0].length;
  const end = latin.indexOf('endstream', start);
  if (end === -1) continue;
  const raw = bytes.subarray(start, end);
  let data = raw;
  if (/\/FlateDecode/.test(dict)) {
    try {
      data = zlib.inflateSync(raw);
    } catch {
      continue;
    }
  }
  const text = data.toString('latin1');
  chunks.push(text);
}

const extracted = [];
for (const chunk of chunks) {
  const tokenRe = /\((?:\\.|[^\\)])*\)\s*Tj|<([0-9A-Fa-f\s]+)>\s*Tj|\[(.*?)\]\s*TJ|(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+Td|T\*|'|"|ET/gms;
  let token;
  while ((token = tokenRe.exec(chunk))) {
    const value = token[0];
    if (value.endsWith('Tj')) {
      const literal = value.match(/^\((.*)\)\s*Tj$/s);
      if (literal) extracted.push(decodePdfString(literal[1]));
      else if (token[1]) extracted.push(decodeHexString(token[1]));
    } else if (value.endsWith('TJ')) {
      const array = token[2] || '';
      for (const part of array.matchAll(/\((?:\\.|[^\\)])*\)|<([0-9A-Fa-f\s]+)>/gms)) {
        if (part[0][0] === '(') extracted.push(decodePdfString(part[0].slice(1, -1)));
        else extracted.push(decodeHexString(part[1]));
      }
    } else {
      extracted.push('\n');
    }
  }
}

let output = printable(extracted.join(''));
output = output
  .replace(/\s*\n\s*/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

console.log(output || chunks.map(printable).join('\n\n').trim());
