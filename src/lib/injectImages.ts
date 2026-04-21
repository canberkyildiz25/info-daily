import { getPexelsImage, getUnsplashFallback } from './pexels';

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function imageHtml(src: string, alt: string): string {
  return `<figure class="my-8 rounded-2xl overflow-hidden not-prose">
  <img src="${src}" alt="${alt}" loading="lazy" class="w-full object-cover max-h-80 rounded-2xl" />
</figure>`;
}

export async function injectInlineImages(html: string, articleTitle: string, category?: string): Promise<string> {
  // Split on <h2 boundaries (keep the delimiter)
  const parts = html.split(/(?=<h2[\s>])/);

  if (parts.length < 3) return html; // Not enough sections to inject

  const result: string[] = [parts[0]];

  for (let i = 1; i < parts.length; i++) {
    result.push(parts[i]);

    // Inject after every 2nd h2 (i.e. i === 2, 4, 6...)
    if (i % 2 === 0) {
      // Extract heading text for Pexels query
      const h2Match = parts[i].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (!h2Match) continue;

      const headingText = stripTags(h2Match[1]);
      const query = `${category ? category + ' ' : ''}${headingText}`.slice(0, 60);

      const imageUrl =
        (await getPexelsImage(query, headingText)) ??
        getUnsplashFallback(query, headingText);

      // Find the end of the first paragraph after the h2
      const pEnd = parts[i].indexOf('</p>');
      if (pEnd === -1) continue;

      const insertAt = parts[i].indexOf('</p>') + '</p>'.length;
      const img = imageHtml(imageUrl, headingText);

      result[result.length - 1] =
        parts[i].slice(0, insertAt) + '\n' + img + '\n' + parts[i].slice(insertAt);
    }
  }

  return result.join('');
}
