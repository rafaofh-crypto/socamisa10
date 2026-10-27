import type { GazetaStory, JournalisticEvent, ClubSeasonProfile } from './types';
import { buildVerifiedGazetaEdition } from './editorialVerification';

export interface ArchivedEditionSummary {
  editionNumber: number; round: number; dateStr: string; badge: string;
  badgeColor: 'gold' | 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
  title: string; subheadline: string; highlights: string[]; isCurated: boolean;
}

// Earlier preparation snapshots remain in publishedGazetaEditions.ts for audit.
// They are not proof of official results and never enter the reader's catalogue.
export const ARCHIVED_EDITIONS_CATALOG: ArchivedEditionSummary[] = [32,31,30,29,28].flatMap(round => {
  const edition=buildVerifiedGazetaEdition(round);
  return edition ? [{editionNumber:round,round,dateStr:edition.dateStr,badge:round===30?'RETIFICADA':`R${round}`,badgeColor:'gold' as const,title:edition.headlineStory.headline,subheadline:edition.subtitle,highlights:[],isCurated:true}] : [];
});

export function getEditionStories(round: number, _events: JournalisticEvent[], _profiles: ClubSeasonProfile[]): {
  headlineStory: GazetaStory; featuredStories: GazetaStory[]; crossStories: GazetaStory[];
} {
  const edition = buildVerifiedGazetaEdition(round);
  if (!edition) throw new Error('Matérias aguardando conferência editorial.');
  return { headlineStory: edition.headlineStory, featuredStories: edition.featuredStories, crossStories: edition.crossStories };
}
