# EcoCampusIFPE

Sistema web para registrar, acompanhar e gerar métricas sobre o descarte de lixo eletrônico no campus do IFPE.

## Visão geral

O EcoCampusIFPE é uma plataforma focada em otimizar a gestão de resíduos eletrônicos (insumos). Através de um Web App acessado via QR Code anexado ao coletor físico do campus, alunos e servidores podem registrar os itens descartados na hora. 

A ideia central é substituir as rondas manuais improdutivas por um monitoramento inteligente de volume, gerar dados institucionais de reciclagem e criar uma vitrine virtual para que a comunidade Maker reaproveite peças úteis antes da destinação final.

## Objetivo

Facilitar o registro de resíduos eletrônicos, evitar o descarte de itens perigosos ou patrimoniados na lixeira comum, e fornecer alertas automatizados de capacidade para a Coordenadoria de Infraestrutura (CINFRA).

## Público-alvo
O sistema atende a toda a comunidade do IFPE (alunos e servidores), bem como visitantes e público externo durante eventos no campus. Além de viabilizar o descarte correto de resíduos eletrônicos, a plataforma permite que componentes funcionais sejam mapeados e reaproveitados em novos projetos acadêmicos, de inovação e cultura maker.

## Equipe

- Eliabe Rafael
- Erik Jerônimo
- Joseildo dos Santos
- Luis Felipe

## Funcionalidades principais

- Triagem rápida de itens eletrônicos via QR Code com opção de anexo de foto.
- Bloqueio informativo para impedir o descarte irregular de equipamentos tombados (patrimônio).
- Dashboard gerencial para a CINFRA monitorar o volume acumulado do coletor.
- Alerta automático disparado quando a lixeira atinge 80% de sua capacidade.
- Galeria de itens descartados para visualização e resgate pela comunidade de projetos do campus.

## Stack sugerida

- Backend: NestJS + TypeScript
- Frontend: React + TypeScript + Vite
- Banco de dados: PostgreSQL
- Hospedagem: PaaS gratuita

## Como rodar o projeto localmente

1. Inicie o PostgreSQL pelo Docker, se ainda não estiver ativo:
   `docker run --name ecocampus-db -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=ecocampus -p 5432:5432 -d postgres`
2. Navegue até a pasta do backend: `cd Backend`
3. Instale as dependências: `npm install`
4. Configure as variáveis de conexão, se necessário. No PowerShell:
   ```powershell
   $env:DB_HOST="127.0.0.1"
   $env:DB_PORT="5432"
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="senha123"
   $env:DB_NAME="ecocampus"
   ```
5. Inicie o servidor: `npm run start:dev`

As migrations pendentes são executadas na inicialização. O backend usa UUIDs nos recursos e não habilita `synchronize`; alterações no esquema devem ser versionadas em migrations.

## Exemplos de Uso (Testando o CRUD via CLI)

Após iniciar o servidor, os recursos abaixo têm endpoints `POST`, `GET`, `GET /:id`, `PATCH /:id` e `DELETE /:id`:

- `http://localhost:3000/usuarios`
- `http://localhost:3000/objetos`
- `http://localhost:3000/api/coletor`
- `http://localhost:3000/descarte`

As listagens aceitam `page` e `limit` (máximo 100), além de filtros específicos por recurso. As respostas de listagem têm o formato `{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 } }`.

O cadastro de usuários valida e-mail, senha e função; as senhas são armazenadas com hash e não retornadas pela API. Um descarte exige UUIDs de usuário e coletor e atualiza o volume do coletor dentro da mesma transação. Itens de catálogo podem ser associados ao descarte por `itens: [{ "objetoId": "<uuid>", "quantidade": 1 }]`.

Exemplo para listar itens do catálogo:

```powershell
curl.exe "http://localhost:3000/objetos?page=1&limit=10&tipo=eletrônico"
```

O volume também pode ser ajustado pela rota `POST /api/coletor/:id/atualizar` com corpo `{ "volume": 1.5 }`; exceder a capacidade retorna `400`. `POST /api/coletor/:id/reset` zera o volume.

## Contrato da API

A API do EcoCampusIFPE foi desenvolvida com NestJS e disponibiliza operações para usuários, coletores, descartes e objetos.

### 1. Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usuarios` | Cadastrar usuário |
| GET | `/usuarios` | Listar usuários |
| GET | `/usuarios/:id` | Consultar usuário |
| PATCH | `/usuarios/:id` | Atualizar usuário |
| DELETE | `/usuarios/:id` | Excluir usuário |

**Exemplo de cadastro:**

```json
{
  "nome": "Maria Silva",
  "email": "maria@ifpe.edu.br",
  "senha": "senha123",
  "role": "usuario",
  "ativo": true
}
```

O campo `role` aceita os valores `admin`, `usuario` e `coletor`. A senha deve possuir pelo menos seis caracteres e é armazenada com hash. Ela não é incluída nas respostas da API.

**Filtros da listagem:** `nome`, `email`, `role` e `ativo`.

### 2. Coletores

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/coletor` | Cadastrar coletor |
| GET | `/api/coletor` | Listar coletores |
| GET | `/api/coletor/:id` | Consultar coletor |
| PATCH | `/api/coletor/:id` | Atualizar coletor |
| DELETE | `/api/coletor/:id` | Excluir coletor |
| POST | `/api/coletor/:id/atualizar` | Adicionar volume |
| POST | `/api/coletor/:id/reset` | Zerar volume |

**Exemplo de cadastro:**

```json
{
  "localizacao": "Bloco A - Entrada",
  "capacidadeMaxima": 100,
  "ativo": true
}
```

**Exemplo de atualização do volume:**

```json
{
  "volume": 1.5
}
```

A capacidade máxima deve ser maior que zero. O volume adicionado também deve ser positivo e não pode ultrapassar a capacidade disponível.

A operação de reset zera o volume atual e altera para `finalizado` o status dos descartes associados ao coletor que ainda não estejam finalizados.

**Filtros da listagem:** `localizacao` e `ativo`.

### 3. Descartes

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/descarte` | Registrar descarte |
| GET | `/descarte` | Listar descartes |
| GET | `/descarte/:id` | Consultar descarte |
| PATCH | `/descarte/:id` | Atualizar descarte |
| DELETE | `/descarte/:id` | Excluir descarte |

**Exemplo de cadastro:**

```json
{
  "tipoResiduo": "eletronico",
  "pesoKg": 2.5,
  "status": "pendente",
  "dataDescarte": "2026-10-30T10:00:00.000Z",
  "destino": "Coletor do Bloco A",
  "observacoes": "Equipamentos eletrônicos sem uso",
  "usuarioId": "UUID_DO_USUARIO",
  "coletorId": "UUID_DO_COLETOR",
  "itens": [
    {
      "objetoId": "UUID_DO_OBJETO",
      "quantidade": 2
    }
  ]
}
```

O cadastro exige `tipoResiduo`, `pesoKg`, `destino`, `usuarioId` e `coletorId`. A lista `itens` é opcional.

O peso deve estar entre `0.01` e `999.99` kg. Os status aceitos são `pendente`, `processado` e `finalizado`. Quando não informado, o status recebe o valor `pendente`.

Cada item deve possuir um `objetoId` válido e uma quantidade inteira maior que zero. Um mesmo objeto não pode aparecer repetidamente na lista de itens do mesmo descarte.

O sistema verifica se o usuário, o coletor e os objetos informados existem. Também verifica se o coletor está ativo e possui capacidade disponível.

**Filtros da listagem:** `status`, `tipoResiduo`, `usuarioId` e `coletorId`.

Na atualização (`PATCH`), os campos são opcionais, mas não é permitido alterar `usuarioId`, `coletorId` ou a lista de itens por essa rota.

### 4. Objetos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/objetos` | Cadastrar objeto |
| GET | `/objetos` | Listar objetos |
| GET | `/objetos/:id` | Consultar objeto |
| PATCH | `/objetos/:id` | Atualizar objeto |
| DELETE | `/objetos/:id` | Excluir objeto |

**Exemplo de cadastro:**

```json
{
  "nome": "Monitor",
  "descricao": "Monitor de computador sem funcionamento",
  "tipo": "eletronico",
  "pesoKg": 3.5,
  "ativo": true
}
```

O nome, a descrição, o tipo e o peso são obrigatórios. O peso deve estar entre `0.01` e `999.99` kg.

**Filtros da listagem:** `nome`, `tipo` e `ativo`.

Um objeto associado a itens de descarte não pode ser excluído.

### 5. Paginação

Todas as rotas de listagem aceitam os parâmetros:

| Parâmetro | Descrição | Padrão |
|---|---|---|
| `page` | Número da página | 1 |
| `limit` | Quantidade de registros por página | 20 |

O limite máximo permitido é de 100 registros por página.

**Exemplo:**

```http
GET /objetos?page=1&limit=10&tipo=eletronico
```

As respostas das listagens seguem o formato:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### 6. Respostas HTTP

A API utiliza os códigos HTTP padrão do NestJS para as operações implementadas:

| Código | Significado | Situação |
|---|---|---|
| 200 | OK | Consulta, atualização ou exclusão realizada |
| 201 | Created | Cadastro ou operação POST realizada |
| 400 | Bad Request | Dados inválidos ou regra de negócio não atendida |
| 404 | Not Found | Registro ou referência não encontrada |
| 409 | Conflict | Conflito com dados ou restrições do banco |

Exemplos de situações de erro:

- E-mail já cadastrado.
- Identificador UUID inválido.
- Usuário, coletor ou objeto não encontrado.
- Tentativa de ultrapassar a capacidade do coletor.
- Tentativa de excluir usuário com descartes associados.
- Tentativa de excluir objeto associado a um descarte.

### 7. Validação das requisições

O backend utiliza `ValidationPipe` global para validar os dados recebidos.

- Campos que não pertencem ao DTO são rejeitados.
- Os tipos de alguns valores são convertidos automaticamente.
- Campos obrigatórios e formatos são validados antes do processamento.
- Identificadores das rotas são validados como UUID.

As atualizações utilizam `PATCH` e permitem enviar somente os campos que serão modificados.

### Testes

Na pasta `Backend`:

- `npm test` executa os testes unitários.
- `npm run test:e2e` inicia a aplicação em uma porta aleatória e executa testes HTTP contra o PostgreSQL configurado em `DB_*`. O teste cria dados temporários e os remove ao final.
- `npm run lint` executa o ESLint nos fontes TypeScript.
