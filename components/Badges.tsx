'use client';

import { CategoriaBadge, StatoBadge } from '@/lib/types';

const categoriColors: Record<CategoriaBadge, string> = {
  grossista: 'bg-blue-100 text-blue-800',
  genetica: 'bg-purple-100 text-purple-800',
  alimentazione: 'bg-green-100 text-green-800',
  consulenza: 'bg-amber-100 text-amber-800',
};

const statoColors: Record<StatoBadge, string> = {
  aperta: 'bg-yellow-100 text-yellow-800',
  conclusa: 'bg-emerald-100 text-emerald-800',
  annullata: 'bg-gray-100 text-gray-800',
};

const categoriLabels: Record<CategoriaBadge, string> = {
  grossista: 'Grossista',
  genetica: 'Genetica',
  alimentazione: 'Alimentazione',
  consulenza: 'Consulenza',
};

const statoLabels: Record<StatoBadge, string> = {
  aperta: 'Aperta',
  conclusa: 'Conclusa',
  annullata: 'Annullata',
};

export function CategoriaBadgeComponent({ categoria }: { categoria: CategoriaBadge | null | undefined }) {
  if (!categoria) return null;
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${categoriColors[categoria]}`}>
      {categoriLabels[categoria]}
    </span>
  );
}

export function StatoBadgeComponent({ stato }: { stato: StatoBadge | null | undefined }) {
  if (!stato) return null;
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statoColors[stato]}`}>
      {statoLabels[stato]}
    </span>
  );
}
