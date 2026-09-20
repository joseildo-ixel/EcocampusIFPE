import http from 'node:http';
import { URL } from 'node:url';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      resolve(body);
    });
    req.on('error', reject);
  });
}

function parseCookies(header = '') {
  const cookies = {};
  for (const pair of header.split(';')) {
    const [name, ...rest] = pair.trim().split('=');
    if (!name || rest.length === 0) continue;
    cookies[name] = rest.join('=');
  }
  return cookies;
}

const recados = [
  'Primeiro recado: visite o EcoCampusIFPE.',
  'Segundo recado: o HTTP é a interface do sistema.',
  'Terceiro recado: segurança no servidor é obrigatória.'
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method || 'GET';
  const pathname = url.pathname;

  if (method === 'GET' && pathname === '/') {
    const cookieHeader = req.headers.cookie || '';
    const cookies = parseCookies(cookieHeader);
    const visitas = Number(cookies.visitas || 0) + 1;

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `visitas=${visitas}; Path=/; HttpOnly; SameSite=Lax`,
      'X-Content-Type-Options': 'nosniff'
    });

    res.end(`
      <h1>Servidor mínimo</h1>
      <p>esta é sua ${visitas}ª visita</p>
      <ul>
        <li><a href="/obras">/obras</a></li>
        <li><a href="/recados/0">/recados/0</a></li>
        <li><a href="/recados/1">/recados/1</a></li>
      </ul>
    `);
    return;
  }

  if (method === 'GET' && pathname === '/obras') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(JSON.stringify({ obras: ['Dom Casmurro', 'Memórias Póstumas', 'A Cidade e as Serras'] }, null, 2));
    return;
  }

  if (method === 'POST' && pathname === '/eco') {
    try {
      const body = await readBody(req);
      const parsed = JSON.parse(body || '{}');
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(JSON.stringify({ recebido: parsed, ok: true }, null, 2));
      return;
    } catch (error) {
      res.writeHead(400, {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(JSON.stringify({ erro: 'JSON inválido', ok: false }, null, 2));
      return;
    }
  }

  const recadoMatch = pathname.match(/^\/recados\/(\d+)$/);
  if (method === 'GET' && recadoMatch) {
    const index = Number(recadoMatch[1]);
    const recado = recados[index];

    if (recado === undefined) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Recado não existe');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(`<h1>Recado ${index}</h1><p>${escapeHtml(recado)}</p>`);
    return;
  }

  const excluirMatch = pathname.match(/^\/recados\/(\d+)\/excluir$/);
  if (method === 'POST' && excluirMatch) {
    const index = Number(excluirMatch[1]);
    if (index >= 0 && index < recados.length) {
      recados.splice(index, 1);
      res.writeHead(303, {
        Location: '/recados/0',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end();
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Recado não existe');
    return;
  }

  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end('404 — rota não encontrada');
});

server.listen(8000, () => {
  console.log('Servidor rodando em http://localhost:8000');
});

export default server;
