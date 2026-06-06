export default async function handler(req, res) {
  // Define o slug da sua liga
  const slug = 'so-camisa-10-2026';
  
  try {
    const response = await fetch(`https://api.cartola.globo.com/liga/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API do Cartola: ${response.status}`);
    }

    const data = await response.json();

    // Headers cruciais para o navegador permitir a leitura
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao buscar dados do Cartola', details: error.message });
  }
}
