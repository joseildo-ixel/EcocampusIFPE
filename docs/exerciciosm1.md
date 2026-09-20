# M01 — Exercícios

## E01.1 — Classificar métodos (individual)

Para cada operação de uma biblioteca, indique o método HTTP, a URL e justifique em uma linha usando os conceitos de safe e idempotente.

| # | Operação | Método | URL | Justificativa |
|---|---|---|---|---|
| 1 | Listar todas as obras | GET | /obras/ | Leitura, sem alteração de estado; é safe e idempotente. |
| 2 | Buscar obras por título | GET | /obras/?q=... | Pesquisa é leitura; não altera estado; URL pode ser compartilhada. |
| 3 | Ver detalhes da obra 42 | GET | /obras/42/ | Consulta um recurso específico; leitura sem efeito colateral. |
| 4 | Cadastrar uma obra nova | POST | /obras/ | Cria um novo registro no servidor; altera estado. |
| 5 | Corrigir o ano de publicação da obra 42 | PATCH | /obras/42/ | Atualiza parcialmente um recurso; não é safe nem idempotente. |
| 6 | Substituir todos os dados da obra 42 | PUT | /obras/42/ | Substitui o recurso inteiro; altera estado e é idempotente. |
| 7 | Excluir a obra 42 | DELETE | /obras/42/ | Remove um recurso; altera estado, porém é idempotente. |
| 8 | Registrar empréstimo do exemplar 7 | POST | /emprestimos/ | Cria um novo empréstimo; altera estado. |
| 9 | Renovar o empréstimo 15 | POST | /emprestimos/15/renovar/ | Renovar não é idempotente; cada chamada estende o prazo. |
| 10 | Fazer login | POST | /login/ | Autentica a sessão; altera estado do servidor. |
| 11 | Fazer logout | POST | /logout/ | Destrói a sessão; altera estado no servidor. |
| 12 | Baixar o relatório mensal em PDF | GET | /relatorios/mensal.pdf | Leitura de arquivo gerado; safe e idempotente. |

> Atenção às pegadinhas: 9 e 11 costumam ser respondidas errado. Logout altera estado no servidor (destrói a sessão) — portanto não é GET.

---

## E01.2 — Ler mensagens HTTP (individual)

Identifique todos os problemas em cada mensagem e reescreva-a corretamente.

### (a)

```http
GET /conta/transferir?de=123&para=456&valor=1000&senha=minhasenha HTTP/1.1
Host: banco.exemplo.com
```

Problemas:
- Dados sensíveis na URL: histórico, logs, cache e Referer.
- Operação financeira em GET: não é safe nem segura para transações.
- Senha em query string é um risco de exposição.

Correção:

```http
POST /conta/transferir HTTP/1.1
Host: banco.exemplo.com
Content-Type: application/json
Authorization: Bearer <token>

{
  "de": 123,
  "para": 456,
  "valor": 1000
}
```

### (b)

```http
POST /api/obras HTTP/1.1
Host: biblioteca.exemplo.org
Content-Type: text/html

{"titulo": "Dom Casmurro"}
```

Problemas:
- `Content-Type` errado para JSON: deveria ser `application/json`.
- Corpo JSON enviado como texto HTML, sem cabeçalho correto.

Correção:

```http
POST /api/obras HTTP/1.1
Host: biblioteca.exemplo.org
Content-Type: application/json

{"titulo":"Dom Casmurro"}
```

### (c)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"erro": "usuario nao autenticado"}
```

Problemas:
- Status mentiroso: erro de autenticação não deve ser 200.
- Se o cliente não está autenticado, o correto é 401 (ou, em alguns casos, 403).

Correção:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"erro": "usuario nao autenticado"}
```

### (d)

```http
HTTP/1.1 301 Moved Permanently
Location: /obra/17/
Set-Cookie: sessionid=abc123
```

Problemas:
- 301 é redirecionamento permanente e pode ser cacheado pelo navegador.
- `Set-Cookie` sem outros atributos e sem contexto extra é frágil.
- A estrutura é aceitável, mas a resposta precisa deixar claro que é uma autenticação ou sessão. Idealmente, o cliente faria uma nova requisição para o recurso final.

Correção:

```http
HTTP/1.1 302 Found
Location: /obra/17/
Set-Cookie: sessionid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/
```

---

## E01.3 — Diagnóstico por status (individual)

Para cada situação, diga qual status você esperaria e o que investigaria primeiro.

1. Formulário de cadastro enviado com e-mail já usado.
   - Status esperado: 409 Conflict ou 422 Unprocessable Entity.
   - Investigar: regra de unicidade do e-mail e validação de duplicidade no servidor.

2. Usuário anônimo tenta acessar /admin/.
   - Status esperado: 401 Unauthorized se não autenticado; 403 Forbidden se autenticado mas sem permissão.
   - Investigar: middleware de autenticação e autorização.

3. Usuário logado (associado) tenta acessar /relatorios/financeiro/.
   - Status esperado: 403 Forbidden.
   - Investigar: papel do usuário, regras de permissão e nível de acesso.

4. Requisição DELETE para uma rota que só aceita GET e POST.
   - Status esperado: 405 Method Not Allowed.
   - Investigar: lista de métodos permitidos na rota e roteamento do framework.

5. Aplicação lança ZeroDivisionError dentro da view.
   - Status esperado: 500 Internal Server Error.
   - Investigar: exceção não tratada, logs da aplicação e validações de cálculo.

6. A aplicação está fora do ar e o Nginx continua respondendo.
   - Status esperado: 502 Bad Gateway ou 503 Service Unavailable.
   - Investigar: upstream da aplicação, processo em execução, proxy reverso e logs do Nginx.

7. Usuário tentou logar 50 vezes em 1 minuto.
   - Status esperado: 429 Too Many Requests.
   - Investigar: rate limiting, proteção contra brute force e mecanismo de bloqueio temporário.

8. Navegador já tem a versão atual do CSS em cache.
   - Status esperado: 304 Not Modified.
   - Investigar: headers de cache (`If-None-Match` / `If-Modified-Since`) e controle de versões do asset.

---

## E01.4 — Estender o servidor mínimo (individual) ⭐

A partir do `servidor-minimo.mjs` do roteiro prático, implemente:

1. Rota `GET /recados/<n>` que mostra apenas o recado de índice `n`, com 404 se não existir.
2. Rota `POST /recados/<n>/excluir` que remove o recado e redireciona (PRG).
3. Um contador de visitas usando cookie: leia o cabeçalho `Cookie`, incremente e devolva `Set-Cookie`. Exiba "esta é sua Nª visita".
4. Escape do conteúdo do recado com `html.escape()`. Antes de implementar, envie o recado `<script>alert('xss')</script>` e observe o que acontece. Depois, compare.

O item 4 é a primeira experiência prática com XSS — retomada no M13.

---

## E01.5 — Medir o mundo real (individual)

Escolha três sites brasileiros de perfis diferentes (um portal de notícias, um e-commerce, um site institucional/governo). Para cada um, colete no DevTools:

| Métrica | Site A | Site B | Site C |
|---|---|---|---|
| Nº de requisições da página inicial | | | |
| Peso total transferido | | | |
| Tempo até o DOMContentLoaded | | | |
| Versão do HTTP usada (coluna Protocol) | | | |
| Nº de domínios de terceiros contactados | | | |
| Usa HTTPS com HSTS? | | | |

Escreva 5 linhas comparando: o que explica a diferença de peso e de tempo?

---

## E01.6 — Debate dirigido (em grupo, 20 min)

"Se o HTTPS criptografa tudo, por que ainda importa se os dados vão por GET ou POST?"

Cada grupo defende uma posição e apresenta em 3 minutos. Pontos que a discussão precisa tocar: histórico do navegador, logs do servidor, cabeçalho Referer, cache, compartilhamento de link, e o fato de que TLS protege em trânsito, não nos extremos.

---

## Gabarito parcial

**E01.1**
- 1: `GET /obras/`
- 2: `GET /obras/?q=...`
- 5: `PATCH /obras/42/`
- 6: `PUT /obras/42/`
- 8: `POST /emprestimos/`
- 9: `POST /emprestimos/15/renovar/`
- 11: `POST /logout/`

**E01.2 (a)**
- Problema: dados financeiros em GET, visíveis em histórico, logs e cache.
- Correção: `POST /conta/transferir` com body e autenticação por sessão/token.

**E01.2 (c)**
- Status mentiroso: erro de autenticação deve ser `401` (ou `403`), não `200`.

**Observação**
- O professor costuma avaliar a justificativa por semântica: `safe`, `idempotente`, `estado`, `cache`, `histórico` e `autenticação`.

File name: README.md
Language:
# M01 — Fundamentos da web e protocolo HTTP

> **CH:** 5h (3h teóricas · 2h práticas) · **Semanas 1–2** · **Pré-requisito:** M00
> **Ementa:** *Introdução a aplicações web: Como funcionam; Protocolo HTTP: métodos POST e GET.*

Este é o módulo mais importante da disciplina. Tudo que vem depois — models, views, interfaces, segurança, deploy — é uma resposta a alguma característica do HTTP. Quem pula este módulo decora o framework; quem entende este módulo aprende a web.

> Numa arquitetura desacoplada (M02), o HTTP deixa de ser detalhe de infraestrutura e vira
> **a interface entre as duas metades do sistema**. Cada tela do React conversa com a
> o framework por requisições que você mesmo vai projetar. Cada erro de integração que a turma
> encontrar da semana 8 em diante se explica com o que está neste módulo.

## 🎯 Objetivos

1. Descrever o ciclo requisição–resposta, do clique ao pixel na tela.
2. Ler e escrever mensagens HTTP cruas (linha de requisição, cabeçalhos, corpo).
3. Escolher corretamente entre GET e POST, justificando pela semântica do protocolo.
4. Interpretar códigos de status e usar o DevTools/`curl` para diagnosticar problemas.
5. Explicar como cookies e sessões contornam a ausência de estado do HTTP.

---

## 📖 Teoria (3h)

### 1. O que acontece quando você digita uma URL (35 min)

```
https://biblioteca.exemplo.org.br/acervo/obra/42?formato=resumo#autor
└─┬──┘ └───────────┬──────────┘ └──────┬──────┘ └──────┬──────┘└─┬──┘
esquema          host              caminho         query string  fragmento
                                                                (só no cliente)
```

Sequência completa:

1. **Resolução DNS** — o navegador pergunta ao resolvedor qual o IP de
   `biblioteca.exemplo.org.br`. Resposta: `203.0.113.10`.
2. **Conexão TCP** — handshake com `203.0.113.10:443`.
3. **Handshake TLS** — o servidor apresenta o certificado; a partir daqui tudo é
   criptografado.
4. **Requisição HTTP** — o navegador envia texto (ver seção 2).
5. **Processamento no servidor** — o proxy reverso repassa ao servidor de aplicação, que
   roteia para a *view*, que consulta o banco e monta a resposta (HTML, num site
   tradicional; JSON, na API que construiremos a partir do M07).
6. **Resposta HTTP** — status, cabeçalhos e corpo (o HTML).
7. **Renderização** — o navegador constrói o DOM e, ao encontrar `<link>`, `<script>` e
   `<img>`, dispara **novas requisições** para cada recurso.
8. **Fim.** O servidor esquece tudo. A próxima requisição começa do zero.

> **Consequência prática de (8):** uma página aparentemente simples pode gerar 40
> requisições. E o servidor não sabe que são "da mesma pessoa" — a menos que haja cookie.

#### Onde roda o quê

| Camada | Executa | Exemplos |
|---|---|---|
| Cliente | Navegador | HTML, CSS, JavaScript, validação de UX |
| Rede | Infraestrutura | DNS, TLS, CDN, proxy reverso |
| Servidor | Sua aplicação | Roteamento, regras de negócio, acesso a dados, **validação de verdade** |
| Dados | Banco | Persistência, integridade, transações |

Regra que vale para o resto da vida: **validação no cliente é conveniência; validação no
servidor é segurança**. Tudo que vem do cliente pode ter sido forjado.

### 2. Anatomia de uma mensagem HTTP (35 min)

**Requisição:**

```http
GET /acervo/obra/42 HTTP/1.1
Host: biblioteca.exemplo.org.br
User-Agent: Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0
Accept: text/html,application/xhtml+xml
Accept-Language: pt-BR,pt;q=0.9
Cookie: sessionid=8f3b2a...; csrftoken=Ab3...
Connection: keep-alive

(corpo vazio — GET normalmente não tem corpo)
```

Estrutura: `MÉTODO CAMINHO VERSÃO` → cabeçalhos (um por linha) → **linha em branco** → corpo.

**Resposta:**

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 4821
Set-Cookie: sessionid=8f3b2a...; HttpOnly; Secure; SameSite=Lax
X-Frame-Options: DENY
Cache-Control: no-store

<!DOCTYPE html>
<html lang="pt-br">...
```

Estrutura: `VERSÃO STATUS RAZÃO` → cabeçalhos → **linha em branco** → corpo.

**Cabeçalhos que você usará com frequência:**

| Cabeçalho | Direção | Para quê |
|---|---|---|
| `Host` | → | Qual site, quando um IP hospeda vários |
| `Content-Type` | ↔ | Formato do corpo (`text/html`, `application/json`, `multipart/form-data`) |
| `Accept` | → | Formatos que o cliente entende |
| `Cookie` / `Set-Cookie` | ↔ | Estado entre requisições |
| `Authorization` | → | Credencial (`Bearer <token>`) |
| `Location` | ← | Destino do redirecionamento (com 3xx) |
| `Cache-Control` | ↔ | Política de cache |
| `X-Frame-Options`, `Content-Security-Policy` | ← | Segurança do navegador (M13) |

### 3. Métodos: GET e POST em profundidade (50 min)

A ementa destaca GET e POST porque são os **únicos** que um formulário HTML consegue enviar nativamente — e porque confundi-los é a origem de uma classe inteira de bugs e vulnerabilidades.

#### Duas propriedades que definem tudo

- **Seguro (*safe*)** — não altera estado no servidor.
- **Idempotente** — repetir N vezes tem o mesmo efeito de fazer 1 vez.

| Método | Seguro | Idempotente | Corpo | Uso |
|---|:---:|:---:|:---:|---|
| `GET` | ✅ | ✅ | não | Obter representação de um recurso |
| `HEAD` | ✅ | ✅ | não | Só os cabeçalhos (checar existência/tamanho) |
| `POST` | ❌ | ❌ | sim | Criar recurso / processar dados |
| `PUT` | ❌ | ✅ | sim | Substituir recurso por inteiro |
| `PATCH` | ❌ | ❌ | sim | Atualizar parcialmente |
| `DELETE` | ❌ | ✅ | opcional | Remover recurso |
| `OPTIONS` | ✅ | ✅ | não | Descobrir capacidades (usado em CORS) |

#### GET

```http
GET /acervo/busca?q=machado+de+assis&pagina=2 HTTP/1.1
Host: biblioteca.exemplo.org.br
```

Características e consequências:

| Característica | Consequência prática |
|---|---|
| Dados vão na URL | Aparecem no histórico, nos logs do servidor, no `Referer` e em prints |
| Pode ser marcado como favorito | Bom para busca, filtro, paginação — o link reproduz o estado |
| É cacheável | Navegador e CDN podem servir sem tocar no servidor |
| Limite prático de ~2.000 caracteres | Não serve para textos longos |
| É repetido livremente (F5, pré-carregamento, bot) | **Nunca** use GET para alterar dados |

> ⚠️ O caso clássico: uma aplicação usou `GET /excluir?id=42` em um link. O pré-carregador de links do navegador e o crawler de indexação seguiram todos os links da página e apagaram o banco inteiro. Não é lenda urbana — é um erro que se repete até hoje.

#### POST

```http
POST /acervo/obra/nova HTTP/1.1
Host: biblioteca.exemplo.org.br
Content-Type: application/x-www-form-urlencoded
Content-Length: 63

titulo=Dom+Casmurro&autor=1&ano=1899&csrfmiddlewaretoken=Ab3xY...
```

| Característica | Consequência prática |
|---|---|
| Dados no corpo | Não vão para o histórico nem para a URL (mas **não** são criptografados por isso — só o HTTPS criptografa) |
| Não idempotente | F5 depois de um POST reenvia o formulário → duplicação. Solução: **PRG** |
| Não cacheável por padrão | Sempre chega ao servidor |
| Sem limite prático de tamanho | Serve para upload e textos longos |
| Requer proteção CSRF | Ver M13 |

**Formatos de corpo em POST:**

| `Content-Type` | Quando |
|---|---|
| `application/x-www-form-urlencoded` | Formulário HTML comum |
| `multipart/form-data` | Formulário com upload de arquivo (`enctype`) |
| `application/json` | Chamadas de API / JavaScript |

#### O padrão Post/Redirect/Get (PRG)

```
POST /emprestimo/novo
      │
      ├─ processa, grava no banco
      │
      └─▶ 302 Found + Location: /emprestimo/17/
                │
                └─▶ GET /emprestimo/17/  ──▶ 200 OK (página de confirmação)
```

Sem PRG, o F5 do usuário cria um segundo empréstimo. Com PRG, o F5 apenas recarrega uma página de leitura. **Toda** view que processa POST com sucesso deve redirecionar.

#### Escolhendo o método: árvore de decisão

```
A requisição altera algum dado no servidor?
├── NÃO  ──▶ GET
└── SIM
     ├── Cria um recurso novo? ────────────────▶ POST
     ├── Substitui um recurso inteiro? ────────▶ PUT
     ├── Altera parte de um recurso? ──────────▶ PATCH
     └── Remove um recurso? ───────────────────▶ DELETE

Em formulário HTML puro só existem GET e POST:
    busca/filtro/paginação ─▶ GET
    qualquer alteração ────▶ POST
```

### 4. Códigos de status (20 min)

| Faixa | Significado | Principais |
|---|---|---|
| **1xx** | Informativo | `101 Switching Protocols` (WebSocket) |
| **2xx** | Sucesso | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | Redirecionamento | `301 Moved Permanently`, `302 Found`, `304 Not Modified` |
| **4xx** | Erro do **cliente** | `400`, `401`, `403`, `404`, `405`, `409`, `422`, `429` |
| **5xx** | Erro do **servidor** | `500`, `502`, `503`, `504` |

Distinções que caem em prova e em code review:

- **401 vs 403** — 401: *não sei quem você é* (não autenticado). 403: *sei quem você é e você não pode* (não autorizado).
- **301 vs 302** — 301 é permanente e fica em cache do navegador (difícil de reverter); 302/303 é temporário. Em PRG, use 302/303.
- **404 vs 403 em recurso privado** — devolver 404 para recurso que existe mas não é seu evita revelar a existência dele (ver IDOR, M13).
- **500 vs 502** — 500: sua aplicação lançou exceção. 502: o proxy não conseguiu falar com sua aplicação (ela caiu, ou não subiu).

### 5. HTTP não tem memória: cookies e sessões (30 min)

O protocolo é **stateless**: cada requisição é independente. Mas aplicações precisam saber quem está logado. Solução em duas partes:

```
1) Login:
   POST /login  (usuario, senha)
        │
        ▼
   servidor valida, cria uma sessão no seu armazenamento:
        sessionid=8f3b2a...  ->  {user_id: 17, expira: ...}
        │
        └──▶ 302 + Set-Cookie: sessionid=8f3b2a...; HttpOnly; Secure; SameSite=Lax

2) Requisições seguintes:
   GET /meus-emprestimos
   Cookie: sessionid=8f3b2a...
        │
        ▼
   servidor procura a sessão, descobre user_id=17, responde personalizado
```

**Atributos de cookie que importam para segurança:**

| Atributo | Efeito |
|---|---|
| `HttpOnly` | JavaScript não lê o cookie → mitiga roubo de sessão por XSS |
| `Secure` | Só trafega em HTTPS |
| `SameSite=Lax/Strict` | Não é enviado (ou só em navegação de topo) em requisições de outros sites → mitiga CSRF |
| `Max-Age` / `Expires` | Tempo de vida |
| `Domain` / `Path` | Escopo |

Alternativa moderna: **token** (JWT) no cabeçalho `Authorization`, comum em APIs e apps mobile. Comparação em M07.

### 6. HTTP/1.1, HTTP/2, HTTP/3 (10 min)

| Versão | Mudança principal | Impacto no seu código |
|---|---|---|
| HTTP/1.1 | Texto, uma requisição por vez na conexão | Truques como *sprite* e concatenação de CSS |
| HTTP/2 | Binário, multiplexado numa conexão | Aqueles truques deixam de ser necessários |
| HTTP/3 | Sobre QUIC/UDP, sem *head-of-line blocking* | Ganho em redes móveis |

A semântica (métodos, status, cabeçalhos) é **a mesma** nas três. Você programa contra a semântica; a versão é responsabilidade da infraestrutura.

---

## 🛠️ Roteiro prático (2h)

### Prática 1 — Inspecionar o tráfego real (40 min)

1. Abra o DevTools (F12) → aba **Network** → marque *Preserve log* e *Disable cache*.
2. Acesse um site que exija login (use uma conta de teste, nunca a sua conta real de banco).
3. Registre, numa tabela:

| Item | Sua observação |
|---|---|
| Quantas requisições a primeira página gerou? | |
| Qual o método e o status da requisição do documento HTML? | |
| Qual o `Content-Type` da resposta principal? | |
| O login usou GET ou POST? Qual o status da resposta? | |
| Houve `Set-Cookie`? Com quais atributos? | |
| Após o login, qual cabeçalho identifica você nas requisições seguintes? | |
| Alguma resposta veio com 304? O que isso significa? | |

4. Filtre por **Doc**, **XHR** e **Img** e observe a diferença de volume.

### Prática 2 — Falar HTTP na mão com `curl` (40 min)

> 🪟 **Windows (PowerShell): escreva `curl.exe`, não `curl`.** No PowerShell, `curl` é apelido de `Invoke-WebRequest`, que tem outros parâmetros — os comandos abaixo falham com erro confuso. O `curl.exe` já vem no Windows 10/11. No Git Bash e no WSL, `curl` funciona normalmente.

```bash
curl -I https://nodejs.org/
curl -v https://httpbin.org/get
curl "https://httpbin.org/get?q=nestjs&pagina=2"
curl -X POST https://httpbin.org/post -d "titulo=Dom Casmurro" -d "ano=1899"
curl -X POST https://httpbin.org/post -H "Content-Type: application/json" -d '{"titulo": "Dom Casmurro", "ano": 1899}'
curl -v -L http://httpbin.org/redirect/2
curl https://httpbin.org/headers -H "Authorization: Bearer token-de-teste"
curl -c cookies.txt https://httpbin.org/cookies/set/sessao/abc123
curl -b cookies.txt https://httpbin.org/cookies
```

Para cada comando, responda: **qual método, qual status, onde foram os dados** (URL ou corpo) e **qual `Content-Type`**.

### Prática 3 — Servidor HTTP mínimo, sem framework (40 min)

Entender o framework exige ver o que ele esconde. Este servidor faz, em ~80 linhas, o que o NestJS faz em milhares.

O código está em `../../recursos/codigo/servidor-minimo.mjs`. Copie-o para uma pasta qualquer e rode:

```bash
node servidor-minimo.mjs
```

Explore com o que você aprendeu nas práticas 1 e 2:

```bash
curl -i http://localhost:8000/
curl -i http://localhost:8000/obras
curl -i http://localhost:8000/nao-existe
curl -i -X POST http://localhost:8000/eco -d '{"titulo":"teste"}'
```

Os pontos a observar — todos comentados no arquivo:

| Trecho do código | O que o framework fará por você |
|---|---|
| `new URL(req.url, ...)` + a tabela `rotas` | **Roteamento.** No M03 vira `@Get(":id")` |
| `req.on("data", ...)` juntando pedaços | **Ler o corpo.** Vira `@Body()` |
| `JSON.parse` dentro de `try` | **Validação.** Vira o `ValidationPipe` (M07) |
| `responder(res, 404, ...)` escrito à mão | **Status HTTP.** Vira `NotFoundException` |
| `X-Content-Type-Options` digitado | **Cabeçalhos de segurança.** Vira `helmet` (M13) |

⚠️ Repare no que **não** existe aqui: nada valida a entrada, nada trata erro de forma uniforme, nada impede uma rota de derrubar o processo. Cada uma dessas ausências é uma linha de código que você escreveria — e é exatamente isso que o M03 mostra o framework fazendo.

**Experimentos obrigatórios** (anote a resposta de cada um):

1. Envie o formulário GET. Onde aparece o nome? Dê F5 — algo é reenviado?
2. Envie um recado (POST) e dê F5. O recado duplica? Por quê **não**?
3. Comente as três linhas do redirecionamento em `do_POST` e responda o POST com `self._responder(200, "ok")`. Envie um recado e dê F5. **Agora duplica?** Este é o motivo de existir o padrão PRG.
4. Acesse `/qualquer-coisa`. Qual status? Onde no código ele é definido?
5. Acesse `/recado` no navegador (que faz GET). Qual status? Por quê?
6. Compare com o NestJS: quem faz o roteamento? Quem lê a query string? Quem monta a resposta? Liste as três responsabilidades que o framework vai assumir por você.

---

## ⚠️ Erros comuns

| Erro | Por que é errado |
|---|---|
| Usar GET para excluir/alterar | Bots, pré-carregamento e cache disparam a ação sem intenção do usuário |
| "POST é seguro porque não mostra os dados" | Só o HTTPS protege; o corpo do POST trafega em texto puro em HTTP |
| Confiar em validação de JavaScript | Qualquer pessoa desabilita JS ou usa `curl` |
| Responder 200 com "erro" no corpo | Status é contrato de máquina; clientes e monitoramento leem o status |
| Usar 301 em redirecionamento temporário | Fica em cache do navegador e é difícil de desfazer |
| Guardar senha/token na query string | Vai para histórico, logs e `Referer` |

## ✅ Checklist de saída

- [ ] Sei desenhar o ciclo requisição–resposta de memória
- [ ] Sei ler uma mensagem HTTP crua e apontar linha de requisição, cabeçalhos e corpo
- [ ] Sei justificar GET vs POST por *safe* e *idempotente*, não por "aparece na URL"
- [ ] Sei explicar o padrão PRG e o problema que ele resolve
- [ ] Sei a diferença entre 401 e 403, 301 e 302, 500 e 502
- [ ] Sei explicar como o servidor "lembra" de mim entre requisições
- [ ] Rodei os 3 roteiros práticos e registrei as observações

## 📦 Entrega E0 — Relatório de inspeção HTTP

Documento (2–4 páginas) com:

1. Tabela da Prática 1 preenchida, com prints do DevTools.
2. Saída comentada de pelo menos 5 comandos `curl` da Prática 2.
3. Respostas aos 6 experimentos da Prática 3, com o código do servidor mínimo no seu repositório.
4. Um parágrafo final: *qual característica do HTTP mais influencia o modo como aplicações web são construídas, e por quê?*

**Prazo:** semana 2. **Peso:** compõe o portfólio (20%).

## 📚 Para aprofundar

- [MDN — Visão geral do HTTP (pt-BR)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview)
- [MDN — Métodos de requisição HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods)
- [MDN — Códigos de status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) (referência normativa)
- [High Performance Browser Networking](https://hpbn.co/) — Ilya Grigorik, livre online
- [httpbin.org](https://httpbin.org) — serviço de eco para testar requisições

---

## Observação final

Este arquivo foi incluído no repositório como material complementar das práticas do módulo M01. Ele pode ser usado como base para a resolução dos exercícios e para a entrega do relatório E0.

---

