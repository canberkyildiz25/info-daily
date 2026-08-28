'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ArticleEngagementProps {
  category: string;
  slug: string;
}

export default function ArticleEngagement({ category, slug }: ArticleEngagementProps) {
  useEffect(() => {
    const reached = new Set<number>();
    const milestones = [25, 50, 75, 90];

    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) return;
      const depth = Math.round((window.scrollY / height) * 100);

      for (const milestone of milestones) {
        if (depth < milestone || reached.has(milestone)) continue;
        reached.add(milestone);
        trackEvent('article_scroll', { article_category: category, article_slug: slug, percent_scrolled: milestone });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [category, slug]);

  return null;
}
