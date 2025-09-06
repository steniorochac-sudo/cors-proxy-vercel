module.exports = async (req, res) => {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extrair a URL do target da query string ou path
    const targetUrl = req.url.replace(/^\/+/, ''); // Remove barras iniciais
    
    if (!targetUrl || !targetUrl.startsWith('http')) {
      return res.status(400).json({ error: 'URL de destino inválida' });
    }

    // Preparar headers para o request
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
    };

    // Fazer o request para o target
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    
    // Retornar a resposta
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Erro no proxy: ' + error.message });
  }
};
