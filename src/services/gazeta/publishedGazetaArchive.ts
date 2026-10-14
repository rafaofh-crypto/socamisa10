import type { GazetaEdition } from './types';
import { buildVerifiedGazetaEdition } from './editorialVerification';
import { ARCHIVED_EDITIONS_CATALOG } from './gazetaArchive';

// Freeze the editorial objects, never the application's sports data.
function freezeEdition<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeEdition);
    Object.freeze(value);
  }
  return value;
}
const VERIFIED_EDITIONS: Record<number, GazetaEdition> = {};
for (const item of ARCHIVED_EDITIONS_CATALOG) {
  const edition = buildVerifiedGazetaEdition(item.round);
  if (edition) VERIFIED_EDITIONS[item.round] = edition;
}
freezeEdition(VERIFIED_EDITIONS);

export function getPublishedGazetaEdition(round: number): GazetaEdition | null {
  return VERIFIED_EDITIONS[round] ?? null;
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
