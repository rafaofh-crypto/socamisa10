import React, { useState } from 'react';

const Admin = () => {
  const [slugs, setSlugs] = useState('');
  const [progress, setProgress] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    const slugList = slugs.split(',').map(s => s.trim()).filter(Boolean);
    setIsSyncing(true);
    const results = [];

    for (let i = 0; i < slugList.length; i++) {
      setProgress(`Sincronizando time ${i + 1} de ${slugList.length}`);
      try {
        const response = await fetch(`/api/proxy?slug=${slugList[i]}`);
        const data = await response.json();
        if (data) {
          results.push({
            nome: data.nome,
            escudo: data.url_escudo_png,
            pontuacao: data.pontuacao_total
          });
        }
      } catch (err) {
        console.error(`Erro ao sincronizar ${slugList[i]}`, err);
      }
    }

    localStorage.setItem('teams_data', JSON.stringify(results));
    setProgress('Sincronização concluída!');
    setIsSyncing(false);
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: '#D4AF37', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '15px', border: '1px solid #D4AF37' }}>
        <h1 style={{ color: '#D4AF37' }}>Painel Administrativo</h1>
        <textarea 
          value={slugs} 
          onChange={(e) => setSlugs(e.target.value)} 
          placeholder="Cole os slugs separados por vírgula..."
          style={{ width: '100%', height: '150px', background: '#1a1a1a', color: '#fff', border: '1px solid #D4AF37', padding: '10px', borderRadius: '8px' }}
        />
        <button 
          onClick={handleSync} 
          disabled={isSyncing}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#D4AF37', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSyncing ? 'Processando...' : 'Iniciar Sincronização'}
        </button>
        <p style={{ marginTop: '20px' }}>{progress}</p>
      </div>
    </div>
  );
};

export default Admin;
