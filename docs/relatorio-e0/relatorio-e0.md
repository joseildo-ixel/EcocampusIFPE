# E0 — Relatório de inspeção HTTP

> **Aluno:** Joseildo Ixel  
> **Projeto:** EcoCampusIFPE  
> **Módulo:** M01 — Fundamentos da Web e HTTP

## Objetivo

Este relatório registra as atividades práticas sobre o protocolo HTTP: inspeção de requisições no DevTools, uso do `curl` e exploração de um servidor mínimo em Node.js. A análise relaciona método, URL, cabeçalhos, corpo, status e estado da aplicação.

> **Nota sobre evidências:** os comandos abaixo estão prontos para execução. As linhas com `[inserir captura]` devem receber os prints feitos pelo aluno no navegador/terminal, pois a quantidade de requisições e os cabeçalhos podem variar conforme o site, o navegador e a rede.

---

## 1. Prática 1 — inspeção no DevTools

### Procedimento

1. Abrir o DevTools com `F12` e selecionar **Network**.
2. Marcar **Preserve log** e, durante a coleta, **Disable cache**.
3. Acessar uma página de teste que não exponha dados sensíveis.
4. Recarregar a página e observar os filtros **Doc**, **Fetch/XHR** e **Img**.
5. Selecionar a requisição principal e registrar os dados abaixo.

### Tabela de observação

| Item | Observação registrada |
|---|---|
| Total de requisições da primeira página | Preencher com o número exibido no DevTools após executar a prática. |
| Método e status do documento | Normalmente `GET` e `200 OK`; confirmar na requisição `document`. |
| `Content-Type` da resposta principal | Normalmente `text/html; charset=utf-8`; confirmar em **Headers**. |
| Requisição que enviaria um descarte | `POST /api/descartes`, com JSON ou `multipart/form-data`. |
| Cabeçalho de autenticação da área da CINFRA | `Authorization: Bearer ...` ou `Cookie: sessionid=...`, conforme a aplicação. |
| Cache ou resposta `304` | Registrar se ocorreu. `304 Not Modified` indica que o cliente pode usar a cópia em cache. |

**Captura do DevTools:**

> `[INSERIR AQUI O PRINT DO NETWORK, mostrando a requisição document, Fetch/XHR e os headers da resposta.]`

### Análise

A aba Network mostra que uma página não é uma única requisição: o documento HTML pode disparar requisições adicionais para CSS, JavaScript, fontes, imagens e APIs. O filtro **Doc** mostra o documento principal; **Fetch/XHR** mostra chamadas assíncronas; e **Img** mostra imagens e outros recursos visuais.

A operação de descarte deve usar `POST`, e não `GET`, porque altera o estado do servidor. Uma área restrita deve exigir autenticação e autorização no backend; apenas esconder um botão no frontend não protege a rota.

---

## 2. Prática 2 — falar HTTP com `curl`

Os comandos foram organizados para mostrar diferentes formas de enviar dados. Em PowerShell, usar `curl.exe` no lugar de `curl`.

### 2.1 Cabeçalhos com `HEAD`

```bash
curl -I https://httpbin.org/get
```

- Método: `HEAD`.
- Status esperado: `200 OK`.
- Dados: não há corpo de resposta.
- `Content-Type`: deve ser conferido na saída; o serviço pode variar a representação.

### 2.2 GET com query string

```bash
curl -v "https://httpbin.org/get?tipo=placa_eletronica"
```

- Método: `GET`.
- Status esperado: `200 OK`.
- Dados: na URL, em `?tipo=placa_eletronica`.
- Corpo de resposta: JSON do httpbin, normalmente com `Content-Type: application/json`.

### 2.3 POST com JSON

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"tipo":"placa_eletronica","quantidade":1,"possuiEtiquetaPatrimonio":false}'
```

- Método: `POST`.
- Status esperado: `200 OK`.
- Dados: no corpo da requisição.
- `Content-Type` enviado: `application/json`.

### 2.4 POST com `multipart/form-data`

```bash
curl -X POST https://httpbin.org/post \
  -F "tipo=placa_eletronica" \
  -F "foto=@placa.jpg"
```

- Método: `POST`.
- Status esperado: `200 OK`.
- Dados: no corpo, divididos em partes.
- `Content-Type`: `multipart/form-data; boundary=...`, gerado pelo `curl`.

### 2.5 Cabeçalho de autorização

```bash
curl https://httpbin.org/headers \
  -H "Authorization: Bearer token-de-teste"
```

- Método: `GET`.
- Status esperado: `200 OK`.
- Dados: no cabeçalho `Authorization`.
- Corpo de resposta: JSON com os cabeçalhos recebidos.

### 2.6 Cookies

```bash
curl -c cookies.txt https://httpbin.org/cookies/set/sessao/abc123
curl -b cookies.txt https://httpbin.org/cookies
```

- A opção `-c` grava os cookies recebidos em `cookies.txt`.
- A opção `-b` reenviará o conteúdo desse arquivo no cabeçalho `Cookie`.
- O primeiro comando redireciona para a rota de cookies; o segundo deve mostrar `sessao=abc123`.
- O status final esperado é `200 OK`.

**Evidências da execução:**

> `[INSERIR A SAÍDA REAL DE PELO MENOS CINCO COMANDOS, incluindo o status e os cabeçalhos.]`

### Conclusão da prática

O HTTP é definido por uma combinação de método, URL, cabeçalhos, corpo e status. A interface visual é apenas uma das formas de gerar essas mensagens; qualquer cliente, inclusive `curl`, pode enviar uma requisição diretamente. Por isso a validação e a autorização devem existir no servidor.

---

## 3. Prática 3 — servidor HTTP mínimo

O código usado nesta prática está em [`recursos/codigo/servidor-minimo.mjs`](../recursos/codigo/servidor-minimo.mjs). Para executá-lo:

```bash
node recursos/codigo/servidor-minimo.mjs
```

Em outro terminal:

```bash
curl -i http://localhost:8000/
curl -i http://localhost:8000/recados/0
curl -i http://localhost:8000/recados/99
curl -i -X POST http://localhost:8000/recado \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "texto=Recado de teste"
curl -i -c cookies.txt -b cookies.txt http://localhost:8000/
curl -i -X POST http://localhost:8000/recados/0/excluir
```

### Respostas aos seis experimentos

1. **Formulário GET e F5:** a rota `/recado` exibe o formulário usando `GET`. O nome/texto aparece como campo do formulário, e o F5 apenas repete a leitura da página; não há operação de gravação.
2. **Enviar recado e pressionar F5:** o envio usa `POST /recado`. O servidor adiciona o recado e responde com `303 See Other` e `Location` para uma rota `GET`. Ao pressionar F5, o navegador repete o `GET`, não o `POST`, portanto o recado não duplica.
3. **Remover o redirecionamento:** se o `POST` responder diretamente com `200 OK`, o navegador ficará em uma resposta originada por POST. Ao pressionar F5, ele poderá perguntar se deve reenviar os dados; confirmando, a operação será executada novamente. Esse é o problema resolvido pelo padrão PRG — **Post/Redirect/Get**.
4. **Acessar `/qualquer-coisa`:** a resposta é `404 Not Found`. O status é definido no último bloco de tratamento de rotas do servidor, que chama `res.writeHead(404, ...)`.
5. **Acessar `/recado`:** a resposta é `200 OK`, porque a rota GET foi criada para exibir o formulário de novo recado.
6. **Comparação com NestJS:** no servidor mínimo, o código compara método e caminho para fazer o roteamento, usa `new URL()` para ler a URL/query string e chama `res.writeHead()`/`res.end()` para montar a resposta. No NestJS, decorators, controllers, pipes e adapters assumem essas responsabilidades.

### Cookies e visitas

A rota `/` lê o cabeçalho `Cookie`, incrementa `visitas` e devolve `Set-Cookie`. O atributo `HttpOnly` impede que JavaScript leia o cookie, e `SameSite=Lax` reduz o envio em requisições cross-site. O cookie não transforma HTTP em um protocolo com memória: ele apenas permite que a aplicação associe requisições diferentes a um estado.

### XSS e escape

Conteúdo recebido do usuário deve ser escapado antes de ser inserido no HTML. O servidor usa `escapeHtml()` para transformar `<`, `>`, `&`, aspas e apóstrofos em entidades HTML. Assim, um texto como `<script>alert('xss')</script>` é exibido como texto, e não executado como JavaScript.

### PRG

O fluxo de criação é:

```text
POST /recado
  └── grava o recado
      └── 303 See Other + Location: /recados/<n>
          └── GET /recados/<n> → 200 OK
```

O redirecionamento separa a alteração de estado da página de leitura e evita a duplicação acidental causada por F5.

---

## 4. Contrato inicial da API do EcoCampusIFPE

| Método | Rota | Usuário | Sucesso |
|---|---|---|---|
| `POST` | `/api/descartes` | Comunidade | `201 Created` |
| `GET` | `/api/descartes` | Gestor | `200 OK` |
| `GET` | `/api/metricas/coletor/:id` | Gestor | `200 OK` |
| `POST` | `/api/coletor/:id/reset` | Gestor | `204 No Content` |

A rota de descarte deve validar no backend `tipo`, `quantidade` e `possuiEtiquetaPatrimonio`. Se o item tiver etiqueta patrimonial ou estiver tombado, o servidor deve rejeitar o descarte comum com `422 Unprocessable Entity` ou `409 Conflict`, registrar o motivo para auditoria e retornar uma mensagem clara. A validação no frontend é apenas conveniência e pode ser burlada com `curl`.

---

## 5. Resposta à pergunta final

A característica do HTTP que mais influencia a construção do EcoCampusIFPE é o fato de cada requisição ser independente e o protocolo não manter memória por conta própria. Para manter login, permissões, contadores e o estado dos descartes, a aplicação precisa usar cookies/sessões ou tokens, validar cada requisição no servidor e escolher métodos e status com semântica correta. Essa separação também explica a necessidade de PRG após operações `POST`, de autenticação/autorização em rotas protegidas e de respostas HTTP que representem fielmente sucesso ou erro.

---

## Checklist de entrega

- [x] Teoria de requisição, resposta, métodos, status e cookies registrada.
- [x] Pelo menos cinco comandos `curl` selecionados e analisados.
- [x] Servidor mínimo presente no repositório.
- [x] Rotas de recados, exclusão, cookie e escape HTML documentadas.
- [x] PRG e prevenção de duplicidade explicados.
- [ ] Inserir captura real do DevTools.
- [ ] Inserir saídas reais de pelo menos cinco comandos `curl`.
- [ ] Confirmar os valores observados na tabela após executar a prática.

As três últimas caixas precisam ser marcadas somente depois de executar os testes e anexar as evidências.
