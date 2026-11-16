import { config } from '../config.js';

const SYSTEM_PROMPT = `You are an expert website auditor and senior web performance engineer.

Analyze the website audit data provided to you.

Do not invent facts.
Do not claim that something exists unless it is present in the supplied data.
If a value is unavailable, explicitly say that it could not be checked.

Your job is to:
1. Explain the website's current condition.
2. Identify the most important problems.
3. Prioritize problems by severity.
4. Explain how each problem can be fixed.
5. Give practical recommendations.
6. Produce a concise professional website audit summary.

Return structured JSON only, matching exactly this shape:
{
  "summary": string,
  "overallAssessment": "Excellent" | "Good" | "Fair" | "Poor",
  "topProblems": [
    { "title": string, "severity": "high" | "medium" | "low", "explanation": string, "recommendation": string }
  ],
  "priorities": [string],
  "strengths": [string]
}`;

function languageInstruction(lang) {
  if (lang === 'tr') {
    return '\n\nWrite every free-text value (summary, topProblems[].title/explanation/recommendation, priorities, strengths) in Turkish. Keep "overallAssessment" as exactly one of the English words Excellent, Good, Fair, Poor (do not translate it), and keep "severity" as exactly one of the English words high, medium, low (do not translate it).';
  }
  return '\n\nWrite every free-text value in English. Keep "overallAssessment" as exactly one of Excellent, Good, Fair, Poor, and "severity" as exactly one of high, medium, low.';
}

async function callGroq(messages, { temperature = 0.3, jsonMode = true } = {}) {
  if (!config.groqApiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server');
  }

  const res = await fetch(config.groqApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages,
      temperature,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Groq API error (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function getAiAnalysis(auditData, lang = 'en') {
  const content = await callGroq([
    { role: 'system', content: SYSTEM_PROMPT + languageInstruction(lang) },
    { role: 'user', content: JSON.stringify(auditData) },
  ]);

  try {
    return JSON.parse(content);
  } catch {
    throw new Error('Groq returned a response that was not valid JSON');
  }
}

export async function getCodeFix({ problem, code, language = 'html', lang = 'en' }) {
  const userPrompt = `Fix this ${language} issue.\n\nProblem:\n${problem}\n\nCode:\n${code}\n\nReturn structured JSON only, matching exactly this shape:\n{ "explanation": string, "fixedCode": string }`;
  const explanationLanguage = lang === 'tr' ? 'Write the "explanation" value in Turkish.' : 'Write the "explanation" value in English.';

  const content = await callGroq([
    {
      role: 'system',
      content: `You are a senior web developer. Fix the specific issue described, making the smallest change necessary. Do not invent unrelated changes. Return structured JSON only. ${explanationLanguage} Keep "fixedCode" as real code, not translated prose.`,
    },
    { role: 'user', content: userPrompt },
  ]);

  try {
    return JSON.parse(content);
  } catch {
    throw new Error('Groq returned a response that was not valid JSON');
  }
}
