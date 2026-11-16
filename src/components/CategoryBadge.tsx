import React from 'react';
import { User, Cat, Compass, CloudSun, Ban } from 'lucide-react';
import { SorterTarget, WordCategory } from '../types/escapeRoom';
import { CATEGORY_META } from '../data/escapeData';

export function CategoryIcon({
  category,
  className = 'w-4 h-4',
}: {
  category: SorterTarget;
  className?: string;
}) {
  switch (category) {
    case 'person':
      return <User className={className} aria-hidden="true" />;
    case 'animal':
      return <Cat className={className} aria-hidden="true" />;
    case 'object':
      return <Compass className={className} aria-hidden="true" />;
    case 'other':
      return <CloudSun className={className} aria-hidden="true" />;
    case 'decoy':
      return <Ban className={className} aria-hidden="true" />;
  }
}

export function CategoryLabel({ category }: { category: WordCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${meta.textClass}`}>
      <CategoryIcon category={category} className="w-4 h-4 shrink-0" />
      <span>{meta.label}</span>
    </span>
  );
}
