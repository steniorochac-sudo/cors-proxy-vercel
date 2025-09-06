const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

// Configura o middleware do cors-anywhere
app.use(corsAnywhere({
  originWhitelist: ['https://steniorochac-sudo.github.io'], // Permite apenas seu domínio
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}));

// Exporta para Vercel como função serverless
module.exports = app;
