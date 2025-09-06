const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

// Configura o proxy CORS
const corsProxy = corsAnywhere({
  originWhitelist: ['https://steniorochac-sudo.github.io'], // Permite apenas seu domínio
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
  setHeaders: {
    'Access-Control-Allow-Origin': 'https://steniorochac-sudo.github.io'
  }
});

// Usa o middleware do cors-anywhere
app.use((req, res, next) => {
  corsProxy(req, res, next);
});

// Exporta para Vercel
module.exports = app;
