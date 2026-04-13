interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Extracts FAQ items from article HTML.
 * A "question" is any <h2> or <h3> ending with "?".
 * The "answer" is the text content of all sibling elements until the next heading.
 */
export function extractFaqFromHtml(html: string): FaqItem[] {
  const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  const tagStripRegex = /<[^>]+>/g;

  const faqs: FaqItem[] = [];
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let lastQuestion: string | null = null;

  const allMatches: { index: number; end: number; text: string }[] = [];

  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[1].replace(tagStripRegex, '').trim();
    allMatches.push({ index: match.index, end: headingRegex.lastIndex, text });
  }

  for (let i = 0; i < allMatches.length; i++) {
    const current = allMatches[i];
    if (!current.text.endsWith('?')) continue;

    // Answer: content between this heading and the next heading
    const answerStart = current.end;
    const answerEnd = allMatches[i + 1]?.index ?? html.length;
    const answerHtml = html.slice(answerStart, answerEnd);
    const answerText = answerHtml
      .replace(tagStripRegex, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500); // cap at 500 chars for schema

    if (answerText.length > 20) {
      faqs.push({ question: current.text, answer: answerText });
    }
  }

  return faqs.slice(0, 8); // max 8 FAQ items
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
