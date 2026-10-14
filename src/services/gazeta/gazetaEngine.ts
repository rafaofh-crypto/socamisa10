import type { CartolaTeam } from '../cartolaService';
import type { GazetaEdition } from './types';
import { getPublishedGazetaEdition } from './publishedGazetaArchive';
export { ARCHIVED_EDITIONS_CATALOG } from './gazetaArchive';

// Sporting inputs may contain synthetic fallback history. They are not editorial
// approval. No invented profiles, ranking recalculation, cup decisions or scores.
export function buildGazetaEdition(_teams: CartolaTeam[] = [], currentRound = 30): GazetaEdition {
  const edition = getPublishedGazetaEdition(currentRound);
  if (!edition) throw new Error('Edição aguardando conferência editorial.');
  return edition;
}
