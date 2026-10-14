import React from 'react';
import { CartolaTeam } from '../services/cartolaService';
import GazetaEditionView from '../components/GazetaEditionView';
import ErrorBoundary from '../components/ErrorBoundary';

interface GazetaC10Props {
  teams: CartolaTeam[];
  currentRound: number;
}

export default function GazetaC10({ teams = [], currentRound = 30 }: GazetaC10Props) {
  const safeRound = Number.isFinite(currentRound) ? currentRound : 30;

  return (
    <ErrorBoundary fallbackTitle="Instabilidade temporária na Gazeta Só Camisa 10">
      <GazetaEditionView teams={teams} currentRound={safeRound} />
    </ErrorBoundary>
  );
}
