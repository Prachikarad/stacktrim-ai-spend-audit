const STORAGE_KEY = 'stacktrim-audit-v1';

export function saveDraft(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function encodeReport(payload) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function decodeReport(encoded) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}
