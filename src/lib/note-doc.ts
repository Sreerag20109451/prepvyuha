/** Editor body is HTML without the note title (title lives in `Note.title`). */

export const EMPTY_EDITOR_BODY = "<p></p>";

function startsWithH1(html: string): boolean {
  return /^[\s\n]*<h1\b/i.test(html);
}

export function stripFirstH1(html: string): string {
  const stripped = html.replace(/^[\s\n]*<h1\b[^>]*>[\s\S]*?<\/h1>/i, "").trim();
  return stripped || EMPTY_EDITOR_BODY;
}

export function extractDocTitle(html: string): string {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return "";
  let inner = m[1];
  inner = inner
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "");
  return inner.replace(/\s+/g, " ").trim();
}

/**
 * Load note into editor: title field + body without leading H1.
 * Migrates older notes that stored title inside body as H1.
 */
export function migrateNoteToEditorParts(
  title: string | null | undefined,
  bodyHtml: string | null | undefined,
): { title: string; body: string } {
  const raw = (bodyHtml ?? "").trim();
  if (!raw) {
    return { title: (title ?? "").trim(), body: EMPTY_EDITOR_BODY };
  }
  if (startsWithH1(raw)) {
    const fromH1 = extractDocTitle(raw);
    return {
      title: fromH1 || (title ?? "").trim(),
      body: stripFirstH1(raw),
    };
  }
  return {
    title: (title ?? "").trim(),
    body: raw.startsWith("<") ? raw : wrapPlainAsParagraphs(raw),
  };
}

function wrapPlainAsParagraphs(raw: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  const parts = raw.split(/\n\n+/);
  const paras =
    parts.map((p) => `<p>${escape(p.replace(/\n/g, " "))}</p>`).join("") ||
    EMPTY_EDITOR_BODY;
  return paras;
}

/** Bootstrap TipTap from stored body only. */
export function normalizeEditorContent(raw: string): string {
  const t = (raw ?? "").trim();
  if (!t) return EMPTY_EDITOR_BODY;
  if (t.startsWith("<")) {
    if (startsWithH1(t)) return stripFirstH1(t);
    return raw;
  }
  return wrapPlainAsParagraphs(raw);
}

export function getNoteListTitle(note: {
  title?: string | null;
  body?: string | null;
}): string {
  const t = (note.title ?? "").trim();
  if (t) return t;
  const legacy = note.body ? extractDocTitle(note.body) : "";
  if (legacy) return legacy;
  return "Untitled";
}
