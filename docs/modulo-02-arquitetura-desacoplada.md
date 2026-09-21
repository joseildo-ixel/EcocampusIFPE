# M02 — Arquitetura desacoplada e contrato de API

## Sobre o módulo

Este módulo apresenta os conceitos de arquitetura desacoplada e contrato de API, aplicados ao desenvolvimento do EcoCampusIFPE.

A proposta é entender como o frontend e o backend do sistema podem trabalhar de forma independente, utilizando uma API HTTP como meio de comunicação.

---

## Arquitetura do EcoCampusIFPE

O projeto será dividido em três partes principais:

```text
React + TypeScript
       │
       │ HTTP / JSON
       ▼
NestJS + TypeScript
       │
       ▼
PostgreSQL
```

### Frontend

O frontend será desenvolvido com React e TypeScript.

Ele será responsável pela interface utilizada pelos usuários e pela apresentação das informações do sistema.

Entre suas funções estão:

- cadastro e visualização de equipamentos;
- acompanhamento dos descartes;
- visualização de informações;
- apresentação de métricas;
- interação com os recursos do sistema.

### Backend

O backend será desenvolvido com NestJS e TypeScript.

Ele será responsável por:

- receber as requisições do frontend;
- validar os dados;
- aplicar as regras da aplicação;
- acessar o banco de dados;
- retornar as respostas para o frontend.

### Banco de dados

O PostgreSQL será utilizado para armazenar os dados do sistema.

---

## MPA e SPA

Durante o módulo, foram estudadas as diferenças entre aplicações MPA e SPA.

### MPA

Em uma aplicação MPA (Multi-Page Application), cada navegação pode resultar no carregamento de uma nova página pelo servidor.

### SPA

Em uma aplicação SPA (Single-Page Application), a interface pode ser atualizada sem que toda a página seja carregada novamente a cada interação.

Para o EcoCampusIFPE, será utilizada uma abordagem SPA com React no frontend.

Essa escolha está relacionada à necessidade de uma interface que interaja com diferentes recursos da API sem depender do carregamento completo de novas páginas.

---

## Arquitetura desacoplada

No EcoCampusIFPE, frontend e backend terão responsabilidades diferentes.

```text
┌─────────────────────────────┐
│     React + TypeScript      │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               │
┌──────────────▼──────────────┐
│     NestJS + TypeScript     │
│           Backend           │
└──────────────┬──────────────┘
               │
               │
┌──────────────▼──────────────┐
│         PostgreSQL          │
│        Banco de dados       │
└─────────────────────────────┘
```

O frontend não acessará diretamente o banco de dados.

A comunicação será realizada por meio da API disponibilizada pelo backend.

Essa separação permite organizar melhor as responsabilidades de cada parte do sistema.

---

## Comunicação entre frontend e backend

A comunicação entre o React e o NestJS será realizada por meio de requisições HTTP.

Por exemplo:

```text
Frontend
   │
   │ GET /api/v1/equipamentos
   ▼
Backend
   │
   │ consulta ao banco
   ▼
PostgreSQL
   │
   │ dados
   ▼
Backend
   │
   │ resposta JSON
   ▼
Frontend
```

Dessa forma, o frontend solicita os dados por meio da API e o backend realiza o processamento necessário.

---

## Contrato da API

O contrato da API define como o frontend e o backend irão se comunicar.

Ele estabelece informações como:

- recursos disponíveis;
- URLs;
- métodos HTTP;
- formato das requisições;
- formato das respostas;
- códigos de status;
- formato dos erros;
- filtros;
- paginação.

A definição do contrato ajuda a manter frontend e backend alinhados durante o desenvolvimento.

---

## Recursos da API

As URLs da API representarão recursos do sistema.

Alguns recursos inicialmente identificados para o EcoCampusIFPE são:

```text
/equipamentos
/descartes
/pontos-descarte
/itens-reutilizacao
```

Os nomes das rotas representam recursos e não ações.

Por exemplo:

```text
POST /api/v1/equipamentos
```

é utilizado para criar um equipamento.

A ideia é evitar rotas como:

```text
POST /api/v1/cadastrarEquipamento
```

O método HTTP já indica a operação que será realizada.

---

## Métodos HTTP

Os principais métodos utilizados pela API serão:

| Método | Utilização |
|---|---|
| GET | Consultar dados |
| POST | Criar um recurso |
| PATCH | Atualizar parte de um recurso |
| DELETE | Remover um recurso |

Exemplos:

```text
GET    /api/v1/equipamentos
POST   /api/v1/equipamentos
PATCH  /api/v1/equipamentos/1
DELETE /api/v1/equipamentos/1
```

---

## Códigos de resposta

A API utilizará códigos de status HTTP para indicar o resultado das requisições.

Alguns exemplos:

```text
200 — requisição realizada com sucesso
201 — recurso criado
400 — dados inválidos
404 — recurso não encontrado
500 — erro interno do servidor
```

Essas respostas permitem que o frontend saiba como tratar cada situação.

---

## Formato dos dados

A comunicação entre frontend e backend utilizará JSON.

Exemplo de resposta:

```json
{
  "id": 1,
  "descricao": "Monitor",
  "status": "triagem"
}
```

Os nomes dos campos seguirão uma convenção consistente.

No projeto, será utilizado `camelCase`.

Exemplo:

```json
{
  "nomeEquipamento": "Monitor",
  "dataCadastro": "2026-09-20"
}
```

---

## Filtros e paginação

A API poderá utilizar parâmetros para filtrar os dados.

Exemplo:

```text
GET /api/v1/equipamentos?status=triagem
```

Também poderá ser utilizada paginação para evitar que uma grande quantidade de registros seja retornada de uma única vez.

Exemplo:

```text
GET /api/v1/equipamentos?page=1&limit=10
```

Essas definições fazem parte do contrato da API.

---

## Estados da interface

O frontend deverá considerar diferentes estados ao realizar uma requisição para a API.

### Carregando

```text
Carregando equipamentos...
```

### Sucesso

```text
Equipamentos encontrados.
```

### Lista vazia

```text
Nenhum equipamento encontrado.
```

### Erro

```text
Não foi possível carregar os equipamentos.
```

Esses estados permitem que o usuário receba uma resposta clara durante a utilização do sistema.

---

## Versionamento da API

A API poderá utilizar versionamento nas rotas.

Exemplo:

```text
/api/v1/equipamentos
```

A utilização de uma versão permite organizar futuras alterações no contrato da API.

---

## Documentação da API

O contrato deverá ser documentado para que as pessoas responsáveis pelo frontend e pelo backend tenham uma referência em comum.

A documentação deverá apresentar informações como:

- endpoints;
- métodos HTTP;
- parâmetros;
- dados enviados;
- respostas;
- códigos de status;
- possíveis erros.

O projeto também poderá utilizar OpenAPI para organizar essa documentação.

---

## Aplicação no EcoCampusIFPE

Os conceitos estudados neste módulo serão utilizados para estruturar a comunicação entre o React e o NestJS.

A divisão das responsabilidades ficará inicialmente da seguinte forma:

```text
React
↓
Interface e interação com o usuário

NestJS
↓
API, regras e validações

PostgreSQL
↓
Armazenamento dos dados
```

Essa organização permite que cada parte do sistema tenha uma responsabilidade definida.

---

## Resultado esperado

Ao finalizar este módulo, o projeto deverá possuir uma definição inicial de como o frontend e o backend irão se comunicar.

O contrato da API servirá como referência para a implementação das funcionalidades do EcoCampusIFPE.

---

## Checklist

- [ ] Definir os principais recursos da API
- [ ] Definir as rotas
- [ ] Definir os métodos HTTP
- [ ] Definir o formato dos dados
- [ ] Definir os códigos de resposta
- [ ] Definir o tratamento de erros
- [ ] Definir filtros e paginação
- [ ] Definir o versionamento da API
- [ ] Documentar o contrato
- [ ] Manter frontend e backend alinhados