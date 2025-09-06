module.exports = async (req, res) => {
  // Headers CORS mais permissivos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Parse da URL target
    let targetUrl = req.url.substring(1); // Remove primeira barra
    
    // Se não começar com http, assume que é inválida
    if (!targetUrl.startsWith('http')) {
      return res.status(400).json({ 
        error: 'URL inválida', 
        received: targetUrl,
        expected: 'https://...' 
      });
    }

    console.log('Target URL:', targetUrl);

    // Import dinâmico do node-fetch
    const fetch = (await import('node-fetch')).default;

    // Preparar o request
    const options = {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CORS-Proxy/1.0)',
        'Accept': '*/*',
      },
      redirect: 'follow', // Seguir redirecionamentos
      follow: 10 // Máximo 10 redirecionamentos
    };

    // Se for POST, adicionar o body
    if (req.method === 'POST' && req.body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(req.body);
    }

    console.log('Making request to:', targetUrl);
    console.log('Options:', options);

    // Fazer o request
    const response = await fetch(targetUrl, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    // Ler resposta
    const data = await response.text();
    console.log('Response data:', data);

    // Configurar resposta
    res.status(response.status);
    
    // Copiar headers relevantes
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Erro no proxy', 
      message: error.message,
      stack: error.stack
    });
  }
};
