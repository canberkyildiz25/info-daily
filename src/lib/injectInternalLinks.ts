import { getAllPosts } from './posts';

function buildLinkHtml(title: string, href: string): string {
  return `<div class="my-5 pl-4 border-l-4 border-blue-400 dark:border-blue-600 not-prose">
  <p class="text-xs font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">Read also</p>
  <a href="${href}" class="text-blue-700 dark:text-blue-300 hover:underline font-semibold text-sm leading-snug">${title}</a>
</div>`;
}

export function injectInternalLinks(
  html: string,
  currentSlug: string,
  currentCategory: string,
  currentTags: string[]
): string {
  const all = getAllPosts().filter(p => p.slug !== currentSlug);

  const related = all
    .map(p => ({
      post: p,
      score: (p.category === currentCategory ? 3 : 0) + p.tags.filter(t => currentTags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  if (related.length === 0) return html;

  // Insert after 3rd, 6th, 9th </p>
  const parts = html.split('</p>');
  const result: string[] = [];
  let linkIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < parts.length - 1) {
      result.push('</p>');
      if ((i + 1) % 3 === 0 && linkIndex < related.length) {
        const post = related[linkIndex++];
        result.push(buildLinkHtml(post.title, `/${post.category}/${post.slug}`));
      }
    }
  }

  return result.join('');
}
