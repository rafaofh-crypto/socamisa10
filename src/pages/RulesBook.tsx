import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, ShieldCheck, Zap, Award, Flame, 
  Crown, ChevronDown, Trophy, ShieldAlert, Sparkles 
} from "lucide-react";

interface RuleItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  content: React.ReactNode;
}

export default function RulesBook() {
  const [openSection, setOpenSection] = useState<string | null>("lei-soberana");

  const toggleSection = (id: string) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  const sections: RuleItem[] = [
    {
      id: "lei-soberana",
      title: "1. A Lei Soberana: Cartola FC ACIMA DE TUDO",
      subtitle: "A única e absoluta fonte da verdade",
      badge: "Soberano",
      content: (
        <div className="space-y-3 font-sans text-sm text-slate-300 leading-relaxed">
          <p>
            No ecossistema **Só Camisa 10**, não há espaço para chororô ou palpites subjetivos. A pontuação computada e oficializada pela API de Alta Fidelidade do **Cartola FC** é a nossa constituição dogmática. Se o Cartola deu assistência ao lateral que tocou de ombro sem querer, está decretado: é assistência e ponto final!
          </p>
          <div className="p-3.5 bg-gold/10 border border-gold/20 rounded-xl flex gap-3 items-start my-2">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-white uppercase tracking-wider">Regra de Ouro do Cartoleiro:</p>
              <p className="text-xs text-slate-400 mt-1">
                Todas as parciais e scouts são importados via processo ETL (Extract, Transform, Load) programático. Em caso de reprocessamento por parte da Globo, o sistema refaz os rankings de forma retroativa até a consagração da rodada.
              </p>
            </div>
          </div>
          <p>
            Sua escalação deve estar devidamente publicada e validada antes do fechamento do mercado oficial. Nossos servidores proxy operam no fuso UTC e sincronizam milisegundos após os dados serem consolidados.
          </p>
        </div>
      )
    },
    {
      id: "copa-m10",
      title: "2. Copa M10: O Mundo em Jogo Único (Estilo Copa do Mundo)",
      subtitle: "Da Guilhotina do Corte à Glória sob Pressão Máxima",
      badge: "Copa Clássica",
      content: (
        <div className="space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
          <p>
            A Copa M10 é inspirada no modelo mais charmoso do planeta: a Copa do Mundo. Aqui, cada passe, scout zerado ou saldo de gol surrupiado decide o seu destino imediato. O funil funciona da seguinte forma:
          </p>
          
          <div className="space-y-3 pl-2 border-l-2 border-blue-500/30">
            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">1</span>
                A Guilhotina (Rodada de Corte - R20)
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Os 50 participantes disputam uma eliminatória inicial até a Rodada 20. Os **12 primeiros colocados gerais** viram cabeças de semente protegidas (cabeças de chave intocáveis no sorteio dos Grupos A a L).
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
                O Limbo e O Esperneio (Rodada 21)
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Os times das posições 47 a 50 não se qualificam de cara. Eles são atirados no **Limbo**, encarando a impiedosa **Rodada do Esperneio** (Rodada 21). Apenas os **2 melhores pontuadores** desta rodada sobrevivem à degola e entram nas vagas 47 e 48. Os 2 piores são banidos das copas da temporada.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
                Mata-Mata Seco e Alocação
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Após misturar programaticamente os 36 s haveres via algoritmo de Fisher-Yates, as chaves de playoff do 1º ao 48º semente se encadeiam. Os mata-matas no M10 ocorrem em **partidas únicas de vida ou morte** (venceu avança, perdeu tá fora).
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-950/20 border border-blue-500/25 rounded-xl text-xs text-slate-400">
            💡 <strong>Sorteio Científico:</strong> A alocação garante que um cabeça de chave enfrente três oponentes sorteados unicamente de potes secundários no formato de Grupo de 4 times durante a Fase de Grupos primária. No mata-mata, empates absolutos são decididos por prioridades técnicas refinadas nas chaves.
          </div>
        </div>
      )
    },
    {
      id: "copa-b10",
      title: "3. Copa B10: Guerra de 180 Minutos (Agregado de Elite)",
      subtitle: "Combates de Ida e Volta onde a Resiliência Física e Mental imperam",
      badge: "Elite 180 Min",
      content: (
        <div className="space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
          <p>
            Se a Copa M10 é tiro curto e pressa, a **Copa B10 imita os grandes torneios europeus e a Copa do Brasil**: um verdadeiro teste de sobrevivência e profundidade tática jogado em confrontos de **180 minutos (Ida e Volta)** com resultado agregado!
          </p>

          <div className="space-y-3 pl-2 border-l-2 border-emerald-500/30">
            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">1</span>
                Rodada de Corte de Elite (R25)
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Com base na Rodada 25 do Cartola, os 50 clubes são fatiados em 3 categorias: **Elite** (Ranks 1-16, vaga direta na Fase 4), **Acesso** (Ranks 17-46, vão para os Play-offs) e **Esperneio** (Ranks 47-50, vão para a repescagem).
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
                O Esperneio de Jogo Único (R26)
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                A repescagem da B10 é um tiro curto de sobrevivência de **jogo único (Rodada 26)**. Os 4 lanternas disputam pontuação direta; os **2 melhores** ficam com as últimas vagas nos Play-offs e os 2 piores são eliminados.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
                Mata-Mata Integral de 180 Minutos (Play-offs até a Final)
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Dos Play-offs do Acesso (R27/R28) até a Grande Final (R37/R38), **todas as fases de mata-mata da Copa B10 ocorrem em confrontos de Ida e Volta (180 minutos)**. O placar final é a soma simples dos pontos do Cartola obtidos em ambas as partidas.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">4</span>
                A Sagrada Hierarquia de Desempates
              </h5>
              <p className="text-xs text-slate-400 mt-1 pl-7">
                Caso ocorra um empate centesimal perfeito no acumulado agregado de 180 minutos, o algoritmo avalia três barreiras intocáveis de prioridade:
              </p>
              <ol className="list-decimal text-xs text-slate-400 mt-2 ml-12 space-y-1">
                <li><strong className="text-white">Melhor Semente de Categoria (Rank de Divisão):</strong> O time que originalmente qualificou em uma prateleira ou semente melhor no corte leva a vaga.</li>
                <li><strong className="text-white">Melhor Pontuação da Rodada de Corte:</strong> Se empatados em semente, quem teve o maior desempenho na Rodada de Corte (R25) avança.</li>
                <li><strong className="text-white">Melhor Posição no Ranking Geral Acumulado:</strong> Se a igualdade persistir, recorre-se ao Ranking Geral de Estabilidade do campeonato de pontos corridos do Cartola.</li>
              </ol>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/15 border border-emerald-500/20 rounded-xl text-xs text-slate-350">
            📊 <strong>Nota da Comissão Arbitral:</strong> O saldo de gols qualificado (gol fora de casa) foi extinguido em 2026. Apenas a integridade matemática pura do score somado reflete o avanço.
          </div>
        </div>
      )
    },
    {
      id: "podio-gala",
      title: "4. O Pódio de Gala: Rodada 38 e a Blindagem de Dados",
      subtitle: "A Glória Eterna sela o destino dos Campeões",
      badge: "Bloqueio e Gala",
      content: (
        <div className="space-y-3 font-sans text-sm text-slate-300 leading-relaxed">
          <p>
            Ao alcançarmos a monumental **Rodada 38**, o sistema deixa o modo de planejamento/transição para trás e veste o seu terno de gala. É a celebração do fechamento da temporada!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase">Consagração Visual</span>
              <p className="text-xs text-slate-400 mt-2">
                A Dashboard principal se reconfigura automaticamente para priorizar as coroas oficiais: o Campeão Geral das 38 rodadas, o Campeão da Copa M10 e o Campeão da Copa B10 de elite.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase">Blindagem de Banco de Dados</span>
              <p className="text-xs text-slate-400 mt-2">
                Nenhum administrador ou usuário pode mais restaurar rodadas, rodar sincronizações adicionais ou recalibrar os parâmetros de copas passadas. Os dados são totalmente blindados e congelados na história!
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-600/10 border border-[#D4AF37]/30 rounded-xl text-xs flex gap-2.5 items-center my-1 text-slate-200">
            <Trophy className="w-5 h-5 text-gold shrink-0 animate-pulse" />
            <span>Os prêmios monetários consolidados (R$ 500, R$ 300 e R$ 300) ganham o layout de certificado oficial com exportador pronto para redes sociais!</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn" id="rules-book-view">
      
      {/* Rules Book Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/15 via-[#D4AF37]/10 to-charcoal-card border border-[#D4AF37]/30 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-52 h-52 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/25 rounded-full text-gold text-[10px] font-mono font-extrabold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 animate-pulse" />
              CÓDIGO DE ÉTICA & REGRAS OFICIAIS
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              O LIVRO DE REGRAS 📕
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Nossa cartilha técnica e jurídica explicada com linguagem divertida, mas com a precisão de um relógio suíço regulamentado. Leia e vença conscientemente!
            </p>
          </div>

          {/* Golden Badge Emblem */}
          <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-center">
            <Crown className="w-7 h-7 text-[#D4AF37]" />
            <div className="text-left font-mono">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Homologado em</p>
              <p className="text-[11px] font-black text-slate-300">TEMPORADA 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Instructions Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="rules-quick-guide">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 items-center">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold border border-gold/15">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wide">API Imparcial</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Sincronização pura do Cartola FC.</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 items-center">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/15">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-blue-400 uppercase tracking-wide">Esperneio Decisivo</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Resgate do Limbo na Rodada 21.</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 items-center">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/15">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-emerald-400 uppercase tracking-wide">Elite em 180 Min</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Mata-Mata agregado com ida/volta.</p>
          </div>
        </div>
      </div>

      {/* Accordion List Container with Glassmorphism */}
      <div 
        className="bg-charcoal-card/45 border border-[#D4AF37]/25 rounded-3xl p-4 sm:p-6 backdrop-blur-[12px] shadow-2xl relative overflow-hidden" 
        id="rules-accordion-list"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
        
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <div 
                key={section.id}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "bg-white/5 border-[#D4AF37]/35 shadow-lg" 
                    : "bg-white/2 border-white/5 hover:bg-white/4 border-white/5"
                }`}
              >
                {/* Accordion Tab Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none transition group"
                  id={`accordion-trigger-${section.id}`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display font-black text-sm sm:text-base text-white tracking-wide uppercase group-hover:text-gold transition">
                        {section.title}
                      </h4>
                      {section.badge && (
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          section.id === "lei-soberana" ? "bg-gold/10 text-gold border border-gold/15" :
                          section.id === "copa-m10" ? "bg-blue-500/15 text-blue-300 border border-blue-500/20" :
                          section.id === "copa-b10" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" :
                          "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        }`}>
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{section.subtitle}</p>
                  </div>

                  <div className={`p-1.5 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition shrink-0 ${
                    isOpen ? "rotate-180 text-gold" : "rotate-0"
                  }`}>
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  </div>
                </button>

                {/* Animated content expansion */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 border-t border-white/5 pt-4">
                        {section.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Small Legal Disclaimer */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-red-950/15 border border-red-900/20 rounded-2xl text-[10px] text-slate-400 font-mono">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
        <span>AVISO LEGAL: A comissão Só Camisa 10 reserva-se o direito de anular scouts duplicados ou bugs confirmados diretamente no site de desenvolvedores do Cartola FC. Força maior não gera indenização. Divirta-se com responsabilidade.</span>
      </div>

    </div>
  );
}
