# ADR 001 — Escolha do NestJS para o Backend

- **Status:** Aceita
- **Data:** 30/10/2026

## 1. Contexto

O EcoCampusIFPE necessita de um backend capaz de gerenciar usuários, objetos, coletores e descartes de resíduos eletrônicos.

A aplicação precisa organizar suas funcionalidades, disponibilizar endpoints HTTP, validar os dados recebidos e manter a comunicação com o banco de dados PostgreSQL.

Para atender a essas necessidades, foi adotado o NestJS com TypeScript.

## 2. Decisão

Foi escolhido o **NestJS 12** como framework para o desenvolvimento do backend do EcoCampusIFPE.

A aplicação utiliza uma arquitetura modular, separando responsabilidades entre módulos, controllers, services, DTOs e entities.

## 3. Justificativa

A escolha do NestJS foi baseada nos seguintes aspectos:

- **Organização modular:** permite separar as funcionalidades do sistema em módulos, como Usuários, Objetos, Coletores e Descartes.
- **Separação de responsabilidades:** os controllers recebem as requisições HTTP, enquanto os services concentram as regras de negócio.
- **Injeção de dependências:** facilita a comunicação entre os componentes e o acesso aos repositórios do banco de dados.
- **Validação de dados:** permite utilizar DTOs com class-validator e class-transformer para validar e transformar as informações recebidas pela API.
- **Integração com TypeORM:** permite trabalhar com entidades, repositórios e migrations para gerenciar a persistência dos dados.
- **Utilização do TypeScript:** oferece tipagem estática e ajuda na organização e manutenção do código.

## 4. Alternativas

Uma alternativa seria utilizar Express diretamente, criando manualmente a organização dos módulos, serviços, validações e mecanismos de injeção de dependências.

O NestJS foi escolhido por oferecer uma estrutura mais definida para organizar essas responsabilidades.

## 5. Consequências

### Positivas

- Código organizado por funcionalidades.
- Melhor separação entre regras de negócio e rotas HTTP.
- Padronização da estrutura do backend.
- Integração com ferramentas de validação e persistência.
- Maior facilidade para adicionar novos módulos ao sistema.

### Pontos de atenção

- É necessário conhecer os conceitos de módulos, decorators e injeção de dependências.
- A estrutura inicial exige mais organização e configuração.
- Os desenvolvedores precisam seguir os padrões estabelecidos pelo framework.

## 6. Tecnologias relacionadas

- NestJS 12
- TypeScript
- TypeORM
- class-validator
- class-transformer
- PostgreSQL