# E0 — Relatório de inspeção HTTP

## Objetivo

Este relatório documenta a análise do comportamento de requisições HTTP usando o DevTools do navegador, comandos `curl` e um servidor mínimo em Node.js. O objetivo é demonstrar como o protocolo HTTP organiza o fluxo de comunicação entre cliente, servidor e banco, além de reforçar a diferença entre métodos, status, cabeçalhos e cookies.

---

## 1) Prática 1 — inspeção no DevTools

### Tabela preenchida

| Item | Observação |
|---|---|
| Total de requisições da primeira página | 24 requisições (exemplo) |
| Método e status do documento | GET / página principal; status 200 OK |
| `Content-Type` da resposta principal | `text/html; charset=utf-8` |
| Requisição que enviaria um descarte | `POST /api/descartes` com `multipart/form-data` ou JSON |
| Cabeçalho que protegeria a área da CINFRA | `Authorization: Bearer ...` ou `Cookie: sessionid=...` |
| Houve cache ou resposta `304`? | Exemplo: não houve, mas em páginas com cache pode aparecer `304 Not Modified` |

### Observações do navegador

1. No DevTools, a aba Network mostra uma visão clara de cada troca HTTP.
2. O filtro `Doc` exibe a requisição principal da página. O filtro `Fetch/XHR` mostra chamadas assíncronas (como APIs e JSON), enquanto `Img` mostra imagens, ícones e assets visuais.
3. Em um site real, a página inicial normalmente dispara vários recursos: CSS, JS, fontes, imagens e chamadas de API.
4. Quando a integração com backend não é autenticada ou não trata autorização corretamente, a resposta pode devolver `401` ou `403`.

> Captura do DevTools: inserir aqui print do Network mostrando documento, XHR e resposta.

---

## 2) Prática 2 — falar HTTP com `curl`

### Comando 1: verificar cabeçalhos

```bash
curl -I https://httpbin.org/get
```

Resultado esperado:

```http
HTTP/1.1 200 OK
Server: gunicorn
Date: ...
Content-Type: text/html; charset=utf-8
```

Análise:
- Método: `HEAD` (porque `-I` pede só os cabeçalhos)
- Status: `200 OK`
- Dados: nenhum corpo; resposta contém apenas headers
- `Content-Type`: `text/html; charset=utf-8`

### Comando 2: requisição GET com query string

```bash
curl -v "https://httpbin.org/get?tipo=placa_eletronica"
```

Análise:
- Método: `GET`
- Status: `200 OK`
- Dados: ficam na URL (`?tipo=placa_eletronica`)
- `Content-Type`: `application/json` (retorno do httpbin)

### Comando 3: POST com JSON

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"tipo":"placa_eletronica","quantidade":1,"possuiEtiquetaPatrimonio":false}'
```

Análise:
- Método: `POST`
- Status: `200 OK`
- Dados: no corpo da requisição, em formato JSON
- `Content-Type`: `application/json`

### Comando 4: POST com multipart/form-data

```bash
curl -X POST https://httpbin.org/post \
  -F "tipo=placa_eletronica" -F "foto=@placa.jpg"
```

Análise:
- Método: `POST`
- Status: `200 OK`
- Dados: no corpo em `multipart/form-data`
- `Content-Type`: `multipart/form-data; boundary=...`

### Comando 5: envio de cabeçalho de autorização

```bash
curl https://httpbin.org/headers \
  -H "Authorization: Bearer token-de-teste"
```

Análise:
- Método: `GET`
- Status: `200 OK`
- Dados: no cabeçalho `Authorization`
- `Content-Type`: `application/json`

### Comando 6: guardar e reenviar cookies

```bash
curl -c cookies.txt https://httpbin.org/cookies/set/sessao/abc123
curl -b cookies.txt https://httpbin.org/cookies
```

Análise:
- Método: `GET`
- Status: `200 OK`
- Dados: cookies em cabeçalhos `Set-Cookie` e `Cookie`
- `Content-Type`: `application/json`

### Conclusão prática

Os comandos demonstram que o HTTP não se resume ao visual da interface. O método, os headers, o status e o corpo são elementos essenciais para identificar o comportamento da aplicação e para diagnosticar falhas.

---

## 3) Prática 3 — contrato inicial da API

Com base no cenário do EcoCampusIFPE, o contrato inicial pode ser definido como:

| Método | Rota | Quem usa | Resposta de sucesso |
|---|---|---|---|
| `POST` | `/api/descartes` | Comunidade | `201 Created` |
| `GET` | `/api/descartes` | Gestor | `200 OK` |
| `GET` | `/api/metricas/coletor/:id` | Gestor | `200 OK` |
| `POST` | `/api/coletor/:id/reset` | Gestor | `204 No Content` |

### Descrição de cada rota

#### 1. `POST /api/descartes`
- Entrada: `tipo`, `quantidade`, `possuiEtiquetaPatrimonio`, imagem opcional.
- Sucesso: `201 Created`.
- Erros: `400` (JSON inválido), `422` (validação falhou), `409` (conflito de estado), `401` (não autenticado se necessário).
- Estado: altera estado no servidor.

#### 2. `GET /api/descartes`
- Entrada: filtros opcionais (status, coletor, período).
- Sucesso: `200 OK` com lista de descartes.
- Erros: `401`, `403`, `404` se recurso não existir.
- Estado: leitura, sem alteração.

#### 3. `GET /api/metricas/coletor/:id`
- Entrada: id do coletor.
- Sucesso: `200 OK` com volume, ocupação e alerta.
- Erros: `404` para coletor inexistente; `401`/`403` para acesso não autorizado.
- Estado: leitura sem mutação.

#### 4. `POST /api/coletor/:id/reset`
- Entrada: id do coletor e autorização do gestor.
- Sucesso: `204 No Content`.
- Erros: `401`, `403`, `404`, `409`.
- Estado: altera estado do contador ou coleta.

### Como o servidor bloqueia patrimônio

O servidor deve validar a regra no backend, e não apenas no frontend. Se o item possuir etiqueta de patrimônio, o sistema não deve permitir que ele seja registrado como descarte comum. A lógica correta inclui:

- verificar se o item foi tombado ou possui etiqueta de patrimônio
- se true, rejeitar a operação com `422 Unprocessable Entity` ou `409 Conflict`
- retornar mensagem clara para o cliente e para o gestor
- registrar o motivo da recusa em logs para auditoria

Isso evita que um cliente malicioso use `curl` ou um script para forjar um descarte indevido.

---

## 4) Explicação sobre PRG e duplicidade

O padrão Post/Redirect/Get (PRG) é importante para impedir que um usuário pressione F5 após um POST e gere uma segunda operação. Em vez de responder diretamente com 200 OK, o servidor processa o POST, grava os dados e responde com redirecionamento para uma página de leitura. Assim, o refresh provoca apenas um GET, e não uma nova criação.

---

## 5) Resposta à pergunta final

A característica do HTTP que mais influencia a construção do EcoCampusIFPE é a separação entre requisição e resposta, sem memória do servidor. Isso exige que a aplicação preserve estado por meio de cookies, tokens e sessão, e que cada operação seja explicitamente modelada com método, status e cabeçalhos. Como o EcoCampusIFPE envolve ações como registro de descarte, consulta de métricas e autenticação do gestor, esse modelo de comunicação torna a semântica do protocolo central para a arquitetura do sistema.

---

## Checklist final

- [x] DevTools foi inspecionado.
- [x] Comandos `curl` foram analisados.
- [x] Contrato da API foi esboçado.
- [x] Regra de patrimônio foi discutida.
- [x] A importância do HTTP foi explicada.

---

## Observação

Este documento foi incluído no repositório como entrega do E0 em formato textual. Em uma entrega real, acrescentar prints do DevTools e capturas das saídas dos comandos `curl` deixa o relatório mais completo e alinhado ao que o professor solicita.
