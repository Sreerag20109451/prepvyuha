type EvalResult = {
  keywordCoveragePct: number;
  hasIntro: boolean;
  hasBodyBullets: boolean;
  hasConclusion: boolean;
  score: number;
  feedback: string[];
};

export function evaluateMainsAnswer(text: string, keywords: string[]): EvalResult {
  const normalized = text.toLowerCase();
  const lines = text.split(/\r?\n/).map((x) => x.trim());
  const intro = lines.slice(0, 3).join(" ").length > 40;
  const hasBullets = lines.some((l) => /^[-*•]/.test(l) || /^\d+\./.test(l));
  const conclusion = /in conclusion|to conclude|therefore|thus/.test(normalized);

  const covered = keywords.filter((k) =>
    normalized.includes(k.toLowerCase().trim()),
  ).length;
  const keywordCoveragePct = keywords.length
    ? Math.round((covered / keywords.length) * 100)
    : 0;

  let score = 0;
  if (intro) score += 25;
  if (hasBullets) score += 25;
  if (conclusion) score += 20;
  score += Math.round(keywordCoveragePct * 0.3);
  score = Math.min(100, score);

  const feedback: string[] = [];
  if (!intro) feedback.push("Add a 2-3 line framing introduction.");
  if (!hasBullets) feedback.push("Use bullet points in body for scanability.");
  if (!conclusion) feedback.push("End with a concise way forward.");
  if (keywordCoveragePct < 50) {
    feedback.push("Improve keyword integration from syllabus/PYQs.");
  }

  return {
    keywordCoveragePct,
    hasIntro: intro,
    hasBodyBullets: hasBullets,
    hasConclusion: conclusion,
    score,
    feedback,
  };
}
