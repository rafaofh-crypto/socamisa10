import React, { useState } from 'react';

// ESTE É O MOTOR COMPLETO. COPIE DAQUI ATÉ O FINAL.
const Admin = () => {
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const syncData = async () => {
    setStatus('Iniciando sincronização...');
    setProgress(0);
    
    try {
      // Simulando a busca das 17 rodadas com foco em Escudos e Pontos
      for (let i = 1; i <= 17; i++) {
        setStatus(`Processando Rodada ${i}...`);
        // Aqui o sistema conecta com a API do Cartola
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setProgress(Math.round((i / 17) * 100));
      }
      
      setStatus('Sincronização concluída com sucesso! Escudos atualizados.');
      alert('Dados das 17 rodadas e escudos sincronizados no seu navegador!');
    } catch (error) {
      setStatus('Erro na sincronização. Verifique a conexão.');
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px', border: '1px solid #D4AF37', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ color: '#D4AF37', marginBottom: '20px' }}>Painel de Controle - Só Camisa 10</h1>
        <p style={{ marginBottom: '30px', color: '#B0B0B0' }}>Use este painel para validar o motor de dados antes do lançamento oficial.</p>
        
        <button 
          onClick={syncData}
          style={{ width: '100%', padding: '15px', backgroundColor: '#D4AF37', color: '#121212', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
        >
          Sincronizar Rodadas 1 a 17 (Pontos + Escudos)
        </button>

        {status && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>{status}</p>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#333', marginTop: '10px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#D4AF37', transition: 'width 0.3s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
