import React, { useState } from 'react';

const Admin = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    setStatus('Conectando à ponte Vercel...');
    
    try {
      // Chama a sua ponte existente
      const response = await fetch('/api/proxy');
      const data = await response.json();

      if (data.error) throw new Error(data.details);

      const times = data.times || [];
      
      if (times.length > 0) {
        // Salva os dados reais e os escudos no navegador
        localStorage.setItem('cartola_data', JSON.stringify(times));
        setStatus(`✅ SUCESSO! ${times.length} times integrados com escudos.`);
      } else {
        setStatus('⚠️ Liga encontrada, mas nenhum time retornado.');
      }
    } catch (err) {
      setStatus(`❌ Erro Real: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '40px', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #D4AF37', padding: '30px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <h1 style={{ color: '#D4AF37', marginBottom: '10px' }}>Painel Admin</h1>
        <p style={{ color: '#B0B0B0', marginBottom: '30px' }}>Sincronização via Proxy Vercel</p>
        
        <button 
          onClick={handleSync}
          disabled={loading}
          style={{ 
            width: '100%', padding: '15px', backgroundColor: loading ? '#666' : '#D4AF37', 
            color: '#121212', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'SINCRONIZANDO...' : 'EXECUTAR SINCRONIZAÇÃO REAL'}
        </button>

        {status && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid #333' }}>
            <p style={{ margin: 0, fontSize: '14px', color: status.includes('✅') ? '#4CAF50' : '#FF5252' }}>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
