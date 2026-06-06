import React, { useState } from 'react';

interface Team {
  nome: string;
  dono: string;
  escudo: string;
  pontos: number;
}

const Admin: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const syncData = async () => {
    try {
      setStatus('Iniciando sincronização...');
      const response = await fetch('/api/proxy?url=' + encodeURIComponent('https://api.cartola.globo.com/liga/so-camisa-10-2026'));
      const data = await response.json();
      const times = data.times || [];
      const processed: Team[] = [];

      for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const teamData: Team = {
          nome: t.nome,
          dono: t.nome_cartola,
          escudo: t.url_escudo_png,
          pontos: t.pontos_campeonato || 0
        };
        processed.push(teamData);
        
        setLogs(prev => [`Sincronizando ${t.nome}...`, ...prev]);
        setProgress(((i + 1) / times.length) * 100);
      }

      localStorage.setItem('cartola_rankings', JSON.stringify(processed));
      setStatus(`Auditoria Concluída: ${processed.length} times integrados com escudos.`);
    } catch (error) {
      setStatus('Erro ao sincronizar dados.');
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: '#D4AF37', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid #D4AF37', padding: '20px', borderRadius: '15px' }}>
        <h1 style={{ color: '#D4AF37' }}>Painel Administrativo</h1>
        <button onClick={syncData} style={{ background: '#D4AF37', color: '#121212', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Sincronizar Liga</button>
        <div style={{ width: '100%', height: '10px', background: '#333', marginTop: '20px', borderRadius: '5px' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#D4AF37', transition: 'width 0.3s' }} />
        </div>
        <p>{status}</p>
        <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
          {logs.slice(0, 5).map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>
    </div>
  );
};

export default Admin;
