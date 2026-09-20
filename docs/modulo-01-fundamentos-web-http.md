# M01 — Fundamentos da Web e protocolo HTTP

> **CH:** 5h (3h teóricas · 2h práticas) · **Semanas 1–2** · **Pré-requisito:** M00  
> **Contexto do projeto:** EcoCampusIFPE — Gestão Inteligente de Lixo Eletrônico

Este módulo apresenta o HTTP como a interface entre a comunidade acadêmica, o frontend React e a API NestJS do EcoCampusIFPE. Ao final, a turma será capaz de projetar e diagnosticar as requisições usadas para registrar descartes, anexar fotos, consultar métricas da CINFRA e disparar alertas de capacidade.

## Conexão com o EcoCampusIFPE

No cenário levantado com a CINFRA do IFPE Campus Palmares, o acompanhamento da lixeira é feito por rondas visuais periódicas e há falta de métricas de volume. O sistema proposto substitui parte desse processo por registros feitos pela comunidade através de um QR Code instalado no coletor.

Cada registro será uma conversa HTTP entre o smartphone e a aplicação:

```text
Comunidade ── QR Code ──▶ React ── HTTP ──▶ API NestJS ──▶ PostgreSQL
                                             │
                                             ├─ calcula ocupação
                                             └─ alerta a CINFRA aos 80%
```

O módulo não implementa ainda o backend definitivo. Ele fornece o modelo mental e as práticas necessárias para que os módulos seguintes definam rotas, formulários e contratos da API sem confundir leitura com alteração de dados.

## Objetivos

Ao terminar o módulo, o estudante deverá ser capaz de:

1. Descrever o ciclo requisição–resposta, do escaneamento do QR Code ao registro no banco.
2. Ler e escrever mensagens HTTP cruas, identificando método, caminho, cabeçalhos e corpo.
3. Escolher entre GET e POST com base na semântica do protocolo.
4. Interpretar códigos de status e usar DevTools e `curl` para diagnosticar problemas.
5. Explicar como cookies e sessões mantêm a autenticação do gestor da CINFRA.
6. Esboçar as requisições do MVP do EcoCampusIFPE.

---

## 1. O ciclo requisição–resposta (35 min)

Quando uma pessoa escaneia o QR Code do coletor, o navegador acessa uma URL do frontend. Depois de DNS, TCP e TLS, o navegador envia HTTP ao servidor. No futuro, o fluxo de registro será semelhante a:

```text
1. GET /descarte/nova                 abre o formulário
2. Usuário escolhe o tipo e tira foto
3. POST /api/descartes                envia os dados e a imagem
4. API valida a entrada e consulta o banco
5. API responde 201 Created ou 422 Unprocessable Entity
6. React mostra confirmação ou os erros do formulário
```

Uma página inicial também dispara requisições adicionais para JavaScript, CSS e imagens. O servidor não sabe automaticamente que duas requisições vieram da mesma pessoa; cookies e sessões resolvem essa necessidade quando houver área autenticada da CINFRA.

### Onde cada parte executa

| Camada | Responsabilidade no EcoCampusIFPE |
|---|---|
| Cliente | React, formulário, compressão da foto e feedback de interface |
| Rede | DNS, HTTPS, proxy e hospedagem PaaS |
| Servidor | Rotas NestJS, validação, regra dos 80% e autorização |
| Dados | PostgreSQL, registros de descarte, capacidade e histórico |

> Validação no cliente melhora a experiência; validação no servidor é obrigatória. Dados enviados por um smartphone podem ser forjados com `curl`.

## 2. Anatomia de uma mensagem HTTP (35 min)

Uma futura consulta do dashboard pode ser representada por:

```http
GET /api/metricas/coletor/1 HTTP/1.1
Host: api.ecocampus-ifpe.example
Accept: application/json
Authorization: Bearer token-de-teste

```

A API poderá responder:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-store

{"coletorId":1,"ocupacaoPercentual":82,"alerta":true}
```

A estrutura é sempre: linha inicial, cabeçalhos, linha em branco e corpo opcional.

### Cabeçalhos essenciais

| Cabeçalho | Uso no projeto |
|---|---|
| `Host` | Identifica o domínio da API |
| `Content-Type` | Informa se o corpo é JSON ou `multipart/form-data` |
| `Accept` | Indica o formato que o frontend espera |
| `Authorization` | Credencial do gestor da CINFRA |
| `Cookie` / `Set-Cookie` | Sessão, caso o projeto use autenticação por cookie |
| `Location` | Recurso criado após um redirecionamento |
| `Cache-Control` | Evita cache indevido das métricas atuais |

## 3. GET e POST no MVP (50 min)

| Método | Seguro | Idempotente | Aplicação no EcoCampusIFPE |
|---|:---:|:---:|---|
| `GET` | Sim | Sim | Abrir formulário, consultar galeria e métricas |
| `POST` | Não | Não | Registrar descarte, enviar foto e disparar processamento |
| `PATCH` | Não | Não | Atualizar parcialmente um registro autorizado |
| `DELETE` | Não | Sim | Remover um registro conforme regra administrativa |

Use GET para leituras que podem ser repetidas, marcadas e compartilhadas. Nunca use GET para registrar descarte, zerar contador ou disparar um alerta. Bots, pré-carregadores e o botão de atualizar podem repetir GET sem intenção do usuário.

Para o registro com foto, o corpo normalmente será `multipart/form-data`:

```http
POST /api/descartes HTTP/1.1
Host: api.ecocampus-ifpe.example
Content-Type: multipart/form-data; boundary=eco

--eco
Content-Disposition: form-data; name="tipo"

placa_eletronica
--eco
Content-Disposition: form-data; name="foto"; filename="placa.jpg"
Content-Type: image/jpeg

...bytes da imagem...
--eco--
```

Para operações sem upload, a API pode receber JSON:

```json
{
  "tipo": "placa_eletronica",
  "quantidade": 1,
  "possuiEtiquetaPatrimonio": false
}
```

A etiqueta de patrimônio merece uma regra explícita: se o item for tombado, o servidor não deve registrá-lo como descarte comum. Deve responder com orientação ao fluxo do servidor de patrimônio.

### Post/Redirect/Get

Em uma aplicação com formulário HTML tradicional, o processamento de um POST bem-sucedido deve redirecionar para uma tela de confirmação. Assim, o F5 repete um GET em vez de reenviar o descarte. Em uma SPA React, o mesmo princípio aparece como: o POST grava uma vez e o frontend navega para a confirmação usando o identificador retornado.

## 4. Códigos de status (20 min)

| Status | Uso no EcoCampusIFPE |
|---|---|
| `200 OK` | Métricas ou galeria consultadas com sucesso |
| `201 Created` | Descarte criado |
| `204 No Content` | Operação concluída sem corpo, como zerar contador |
| `400 Bad Request` | JSON ou parâmetros malformados |
| `401 Unauthorized` | Gestor não autenticado |
| `403 Forbidden` | Usuário autenticado sem permissão de gestor |
| `404 Not Found` | Coletor ou descarte inexistente |
| `409 Conflict` | Registro incompatível com o estado atual |
| `422 Unprocessable Entity` | Dados rejeitados pela validação |
| `500 Internal Server Error` | Falha inesperada na API |
| `503 Service Unavailable` | API ou banco temporariamente indisponível |

Não responda `200` com uma mensagem de erro no corpo. O status é o contrato que o React, o monitoramento e outros clientes conseguem interpretar.

## 5. Cookies, sessões e autenticação (30 min)

O dashboard e o reset do contador são operações da CINFRA, portanto precisam de autenticação e autorização. Uma possibilidade é a sessão por cookie:

```text
POST /login
  └─▶ Set-Cookie: sessionid=...; HttpOnly; Secure; SameSite=Lax

GET /api/metricas
  Cookie: sessionid=...
  └─▶ servidor identifica o gestor e verifica sua permissão
```

`HttpOnly` dificulta o roubo por JavaScript, `Secure` exige HTTPS e `SameSite` reduz o risco de CSRF. O frontend público de registro não deve receber privilégios de gestor. A alternativa por token `Authorization: Bearer ...` será comparada em um módulo posterior.

## 6. HTTP/1.1, HTTP/2 e HTTP/3 (10 min)

As versões mudam o transporte e a eficiência, mas não mudam a semântica que será usada no projeto: métodos, status, cabeçalhos e corpos. A aplicação programa contra essa semântica; HTTPS, HTTP/2 ou HTTP/3 são responsabilidade da infraestrutura de hospedagem.

---

## Roteiro prático (2h)

### Prática 1 — Inspecionar uma requisição real (40 min)

1. Abra DevTools → **Network**, marque *Preserve log* e *Disable cache*.
2. Acesse uma página pública e, se disponível, o protótipo do formulário do EcoCampusIFPE.
3. Registre método, status, URL, `Content-Type`, tamanho e tempo da requisição principal.
4. Compare os filtros **Doc**, **Fetch/XHR** e **Img**.
5. Identifique quais requisições seriam leitura de métricas e quais alterariam o estado.

Tabela para o relatório:

| Item | Observação |
|---|---|
| Total de requisições da primeira página | |
| Método e status do documento | |
| `Content-Type` da resposta principal | |
| Requisição que enviaria um descarte | |
| Cabeçalho que protegeria a área da CINFRA | |
| Houve cache ou resposta `304`? | |

### Prática 2 — Falar HTTP com `curl` (40 min)

No Windows PowerShell, use `curl.exe` em vez de `curl`.

```bash
curl -I https://httpbin.org/get
curl -v "https://httpbin.org/get?tipo=placa_eletronica"
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"tipo":"placa_eletronica","quantidade":1,"possuiEtiquetaPatrimonio":false}'
curl -X POST https://httpbin.org/post \
  -F "tipo=placa_eletronica" -F "foto=@placa.jpg"
curl https://httpbin.org/headers \
  -H "Authorization: Bearer token-de-teste"
```

Para cada comando, anote método, status, local dos dados (URL, JSON ou multipart) e `Content-Type`. Não use dados reais de usuários ou fotos pessoais.

### Prática 3 — Desenhar o contrato da API (40 min)

Com base nos dados do Canva e nas necessidades da CINFRA, proponha uma tabela inicial:

| Método | Rota | Quem usa | Resposta de sucesso |
|---|---|---|---|
| `POST` | `/api/descartes` | Comunidade | `201 Created` |
| `GET` | `/api/descartes` | Gestor | `200 OK` |
| `GET` | `/api/metricas/coletor/:id` | Gestor | `200 OK` |
| `POST` | `/api/coletor/:id/reset` | Gestor | `204 No Content` |

Para cada rota, descreva entrada, saída, erros (`401`, `403`, `404`, `422`) e se a operação altera estado. Justifique como o alerta de 80% seria representado na resposta e qual ação não deve ser disparada duas vezes quando a requisição for repetida.

---

## Erros comuns

- Usar GET para registrar ou excluir descarte.
- Achar que POST protege dados sem HTTPS.
- Confiar somente na validação do React.
- Permitir que o cliente decida se um item patrimoniado pode ser descartado.
- Responder `200` para erros de validação.
- Expor métricas administrativas sem autenticação e autorização.
- Repetir o processamento do alerta de 80% sem controlar duplicidade no servidor.

## Entrega E0 — Relatório de inspeção HTTP

Entregue um documento de 2–4 páginas contendo:

1. Tabela da Prática 1 preenchida, com prints do DevTools.
2. Saída comentada de pelo menos cinco comandos `curl`.
3. Contrato inicial das quatro rotas da Prática 3, incluindo erros e papéis.
4. Uma explicação de como o servidor bloqueará itens com etiqueta de patrimônio.
5. Um parágrafo respondendo: **qual característica do HTTP mais influencia a construção do EcoCampusIFPE e por quê?**

**Prazo:** semana 2 · **Peso:** compõe o portfólio (20%).

## Checklist de saída

- [ ] Sei desenhar o ciclo QR Code → React → API → banco → resposta.
- [ ] Sei identificar método, cabeçalhos, corpo e status de uma mensagem HTTP.
- [ ] Sei justificar GET e POST por semântica.
- [ ] Sei explicar PRG e evitar duplicação de descartes.
- [ ] Distingo `401` de `403` e `500` de `503`.
- [ ] Sei por que a validação de patrimônio precisa ocorrer no servidor.
- [ ] Esbocei as rotas e os papéis do MVP.

## Para aprofundar

- [MDN — Visão geral do HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Overview)
- [MDN — Métodos de requisição HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods)
- [MDN — Códigos de status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [httpbin.org](https://httpbin.org)
