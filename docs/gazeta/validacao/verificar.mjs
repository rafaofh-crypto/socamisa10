// Material de apoio manual: sem imports do produto, rede, sincronizacao ou escrita.
// Confere metadados ficticios; nao calcula resultados nem certifica homologacao real.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const pacote = JSON.parse(readFileSync(new URL('./casos.json', import.meta.url), 'utf8'));
assert.equal(pacote.escopo, 'FICTICIO_ISOLADO_NAO_PUBLICAR');
const original = JSON.stringify(pacote);
const texto = value => typeof value === 'string' && value.trim().length > 0;
const evidencias = values => Array.isArray(values) && values.length > 0 && values.every(texto);

function conferirRegistro(entrada) {
  const erros = [];
  if (!Array.isArray(entrada.clubes) || !entrada.clubes.length ||
      !entrada.clubes.every(texto) || new Set(entrada.clubes).size !== entrada.clubes.length) erros.push('identidade');
  if (!texto(entrada.competicao) || !texto(entrada.momento)) erros.push('contexto');
  if (typeof entrada.disponivel !== 'boolean') erros.push('disponibilidade');
  if (entrada.disponivel === false && entrada.valor !== null) erros.push('valor-ausente');
  if (entrada.disponivel === true && (typeof entrada.valor !== 'number' || !Number.isFinite(entrada.valor))) erros.push('valor-numerico');
  if (!['parcial', 'confirmado', 'nao-verificavel'].includes(entrada.situacao)) erros.push('situacao');
  if (typeof entrada.afirmacaoDefinitiva !== 'boolean') erros.push('afirmacao');
  if (entrada.afirmacaoDefinitiva && (entrada.situacao !== 'confirmado' || !entrada.disponivel)) erros.push('confirmacao');
  if (entrada.situacao === 'confirmado' || entrada.afirmacaoDefinitiva) {
    if (!texto(entrada.fonte)) erros.push('fonte');
    if (!evidencias(entrada.evidencias)) erros.push('evidencia');
  }
  return erros;
}

function conferirCruzamento(eventos) {
  if (!Array.isArray(eventos) || eventos.length < 2) return false;
  return eventos.every(e => texto(e.clube) && texto(e.competicao) && texto(e.momento) && evidencias(e.evidencias)) &&
    new Set(eventos.map(e => e.clube)).size === 1 &&
    new Set(eventos.map(e => e.momento)).size === 1 &&
    new Set(eventos.map(e => e.competicao)).size >= 2;
}

function congelar(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(congelar);
    Object.freeze(value);
  }
  return value;
}

assert.equal(new Set([...pacote.casos, ...pacote.historiasCruzadas].map(c => c.id)).size,
  pacote.casos.length + pacote.historiasCruzadas.length, 'IDs dos casos devem ser unicos');
congelar(pacote);
for (const caso of pacote.casos) {
  assert.deepEqual(conferirRegistro(caso.entrada).sort(), [...caso.errosEsperados].sort(), caso.id);
}
for (const caso of pacote.historiasCruzadas) {
  assert.equal(conferirCruzamento(caso.eventos), caso.valida, caso.id);
}
assert.equal(JSON.stringify(pacote), original, 'Nenhuma entrada deve ser modificada');
console.log(`${pacote.casos.length} registros e ${pacote.historiasCruzadas.length} historias cruzadas ficticias verificados; entradas preservadas.`);
