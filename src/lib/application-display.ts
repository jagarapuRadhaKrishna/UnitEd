export interface ApplicationAnswerItem {
  question: string;
  answer: string;
}

export function normalizeApplicationAnswers(value: unknown): ApplicationAnswerItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;

      const candidate = entry as { question?: unknown; answer?: unknown };
      const question = typeof candidate.question === 'string' ? candidate.question.trim() : '';
      const answer = typeof candidate.answer === 'string' ? candidate.answer.trim() : '';

      if (!question || !answer) return null;

      return { question, answer };
    })
    .filter((entry): entry is ApplicationAnswerItem => Boolean(entry));
}

export function getRelevantExperienceText(value: unknown): string | null {
  const answers = normalizeApplicationAnswers(value);
  if (answers.length === 0) return null;

  const directMatch = answers.find((entry) => entry.question.toLowerCase().includes('experience'));
  if (directMatch) return directMatch.answer;

  return answers[0]?.answer ?? null;
}
