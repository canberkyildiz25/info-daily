import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const SUPPORTED_LANGUAGES: Record<string, string> = {
  tr: 'Turkish',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
  it: 'Italian',
  ar: 'Arabic',
  ja: 'Japanese',
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'API not configured' }, { status: 500 });

  let body: { content?: string; title?: string; excerpt?: string; targetLang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { content, title, excerpt, targetLang } = body;

  if (!content || !targetLang) {
    return NextResponse.json({ error: 'content and targetLang are required' }, { status: 400 });
  }

  const langName = SUPPORTED_LANGUAGES[targetLang];
  if (!langName) {
    return NextResponse.json({ error: `Unsupported language: ${targetLang}` }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Translate the following article content from English to ${langName}.

RULES:
- Preserve ALL HTML tags exactly as they are (do not modify <h2>, <p>, <ul>, <li>, <strong>, <em>, <a> etc.)
- Only translate the text content inside the tags
- Keep proper nouns, brand names, and URLs unchanged
- Match the tone: friendly, informative, expert
- Output ONLY the translated HTML, nothing else

TITLE TO TRANSLATE: ${title || ''}
EXCERPT TO TRANSLATE: ${excerpt || ''}
CONTENT TO TRANSLATE:
${content}

Respond with a JSON object in this exact format:
{"title":"translated title","excerpt":"translated excerpt","content":"translated HTML content"}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { text: string }).text.trim();

    // Extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const translated = JSON.parse(jsonMatch[0]) as {
      title: string;
      excerpt: string;
      content: string;
    };

    return NextResponse.json(translated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Translation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
