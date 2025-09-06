const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();
const proxy = corsAnywhere.createServer({
  originWhitelist: ['https://steniorochac-sudo.github.io'], // Seu domínio
});

app.use('/', proxy);
app.listen(process.env.PORT || 8080, () => console.log('Proxy CORS rodando'));
