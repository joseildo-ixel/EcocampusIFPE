# Comandos `curl` no PowerShell e no WSL

## Importante

No Windows PowerShell, o comando `curl` é um alias para `Invoke-WebRequest`. Para testar requisições HTTP no estilo Unix, use sempre:

```powershell
curl.exe
```

No Git Bash, WSL e Linux/macOS, o comando `curl` funciona normalmente.

---

## Exemplos básicos

### 1) Ver somente os cabeçalhos

```bash
curl -I https://nodejs.org/
```

### 2) Ver a requisição e a resposta completa

```bash
curl -v https://httpbin.org/get
```

### 3) Fazer GET com query string

```bash
curl "https://httpbin.org/get?q=nestjs&pagina=2"
```

### 4) Fazer POST com formulário

```bash
curl -X POST https://httpbin.org/post \
  -d "titulo=Dom Casmurro" \
  -d "ano=1899"
```

### 5) Fazer POST com JSON

```bash
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Dom Casmurro", "ano": 1899}'
```

### 6) Seguir redirecionamentos

```bash
curl -v -L http://httpbin.org/redirect/2
```

### 7) Enviar cabeçalho customizado

```bash
curl https://httpbin.org/headers \
  -H "Authorization: Bearer token-de-teste"
```

### 8) Guardar e reenviar cookies

```bash
curl -c cookies.txt https://httpbin.org/cookies/set/sessao/abc123
curl -b cookies.txt https://httpbin.org/cookies
```

---

## Observação

Esses comandos são úteis para validar:
- método HTTP usado
- status da resposta
- local dos dados (URL ou corpo)
- cabeçalhos enviados
- uso de cookies e autenticação

