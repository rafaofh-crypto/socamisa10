import React, { useState } from 'react';

const TEAM_IDS = [13937357,8939156,14323503,111909,3744315,9271895,238006,17980715,8933548,8141559,2434533,224337,14765411,13940971,2695092,486799,510678,208464,13969770,14823936,7953525,543042,8152343,3399282,8294020,14006764,22850038,974568,49179198,211489,10511707,45320128,360073,665213,13942012,6366247,18200107,49685829,50215170,17920286,17908927,3066923,104630,8825571,656690,30273692,26652472,44786261,26308618,19731082];

export default function Admin() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to scan');
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setIsScanning(true);
    const results = [];
    for (let i = 0; i < TEAM_IDS.length; i++) {
      const id = TEAM_IDS[i];
      setStatus(`Processing team ${i + 1}/${TEAM_IDS.length}: ${id}`);
      try {
        const response = await fetch(`/api/proxy?type=time&slug=${id}`);
        const data = await response.json();
        if (data.time) {
          results.push({
            nome: data.time.nome,
            escudo: data.time.url_escudo_png,
            pontos: data.pontos
          });
        }
      } catch (e) {
        console.error(`Failed to fetch ${id}`, e);
      }
      setProgress(((i + 1) / TEAM_IDS.length) * 100);
    }
    localStorage.setItem('cartola_data', JSON.stringify(results));
    setStatus('Scan complete! Data saved.');
    setIsScanning(false);
  };

  const resetData = () => {
    localStorage.removeItem('cartola_data');
    setStatus('Storage cleared.');
  };

  return (
    <div style={{ background: '#121212', color: '#D4AF37', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '15px', border: '1px solid #D4AF37' }}>
        <h1 style={{ color: '#D4AF37' }}>Só Camisa 10 - Admin</h1>
        <div style={{ height: '20px', background: '#333', borderRadius: '10px', margin: '20px 0', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#D4AF37', transition: 'width 0.3s' }} />
        </div>
        <p>{status}</p>
        <button onClick={startScan} disabled={isScanning} style={{ background: '#D4AF37', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}>Start Scan</button>
        <button onClick={resetData} style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '10px 20px', cursor: 'pointer' }}>Reset</button>
      </div>
    </div>
  );
}
