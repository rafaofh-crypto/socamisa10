import type { GazetaEdition } from './types';
import { PUBLISHED_GAZETA_EDITIONS } from './publishedGazetaEditions';
import { ARCHIVED_EDITIONS_CATALOG } from './gazetaArchive';

// Freeze the editorial objects, never the application's sports data.
function freezeEdition<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeEdition);
    Object.freeze(value);
  }
  return value;
}
freezeEdition(PUBLISHED_GAZETA_EDITIONS);

export function getPublishedGazetaEdition(round: number): GazetaEdition | null {
  return PUBLISHED_GAZETA_EDITIONS[round] ?? null;
}

export function getAvailableGazetaEditions(_currentRound?: number) {
  // A stale/offline sports cache must not hide an already prepared edition.
  return ARCHIVED_EDITIONS_CATALOG
    .filter(item => getPublishedGazetaEdition(item.round))
    .map(item => ({ ...item, title: getPublishedGazetaEdition(item.round)!.headlineStory.headline }))
    .sort((a, b) => b.round - a.round);
}

export function getLatestGazetaEditionRound(_currentRound?: number): number | null {
  return getAvailableGazetaEditions()[0]?.round ?? null;
}
