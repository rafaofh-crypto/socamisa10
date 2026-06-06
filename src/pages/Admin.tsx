import React, { useState } from 'react';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const syncData = async () => {
    setLoading(true);
    setStatus('Iniciando sincronização...');
    const tournamentData = {};

    try {
      for (let i = 1; i <= 17; i++) {
        setStatus(`Buscando rodada ${i}/17...`);
        const response = await fetch(`https://api.cartola.globo.com/liga/so-camisa-10-2026/pontuacao/${i}`);
        if (response.ok) {
          const data = await response.json();
          tournamentData[i] = data;
        }
      }
      localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
      setStatus('Sincronização concluída com sucesso!');
    } catch (error) {
      setStatus('Erro ao sincronizar. Verifique a conexão ou o endpoint.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Painel Administrativo</h1>
        <p style={styles.text}>Gerenciamento de dados do Cartola FC</p>
        <button 
          onClick={syncData} 
          disabled={loading} 
          style={styles.button}
        >
          {loading ? 'Sincronizando...' : 'Sincronizar Rodadas 1-17'}
        </button>
        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#121212',
    padding: '20px'
  },
  card: {
    background: 'rgba(30, 30, 30, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #D4AF37',
    borderRadius: '15px',
    padding: '40px',
    textAlign: 'center',
    color: '#fff',
    maxWidth: '400px',
    width: '100%'
  },
  title: { color: '#D4AF37', marginBottom: '20px' },
  text: { marginBottom: '30px', opacity: 0.8 },
  button: {
    background: '#D4AF37',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#000'
  },
  status: { marginTop: '20px', fontSize: '0.9rem', color: '#D4AF37' }
};

export default Admin;
