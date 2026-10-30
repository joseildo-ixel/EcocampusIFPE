# ADR 002 — Escolha do PostgreSQL e uso do Docker

- **Status:** Aceita
- **Data:** 30/10/2026

## 1. Contexto

O EcoCampusIFPE precisa armazenar informações sobre usuários, coletores, descartes e objetos, mantendo os relacionamentos entre essas entidades.

O sistema também precisa garantir a integridade dos dados durante operações como o registro de descartes e a atualização do volume dos coletores.

Para atender a essas necessidades, foi adotado o PostgreSQL como sistema gerenciador de banco de dados e o Docker para executar o banco em um container durante o desenvolvimento local.

## 2. Decisão

Foi escolhido o **PostgreSQL** como banco de dados relacional do EcoCampusIFPE.

O banco é integrado ao backend por meio do TypeORM e do driver `pg`.

Para o ambiente de desenvolvimento, o PostgreSQL é executado em um container Docker, disponibilizando a porta 5432 para a aplicação.

## 3. Justificativa

### PostgreSQL

A escolha do PostgreSQL foi baseada nos seguintes aspectos:

- **Banco de dados relacional:** permite representar as relações entre usuários, coletores, descartes e objetos.
- **Integridade referencial:** possibilita utilizar chaves estrangeiras para manter a consistência entre as tabelas.
- **Transações:** permite executar operações relacionadas de forma conjunta, como registrar um descarte e atualizar o volume do coletor.
- **Restrições de dados:** oferece suporte a regras como e-mail único, combinações únicas de itens e quantidade maior que zero.
- **Precisão numérica:** permite armazenar valores de peso, capacidade e volume com precisão decimal.
- **Integração com TypeORM:** possibilita utilizar entidades, repositórios e migrations para organizar a persistência dos dados.

### Docker

O Docker foi escolhido para facilitar a execução do PostgreSQL no ambiente de desenvolvimento.

Entre suas vantagens estão:

- **Isolamento:** o banco é executado em um container, separado da instalação principal do sistema operacional.
- **Facilidade de configuração:** permite iniciar o banco por meio de um comando, sem precisar instalar o PostgreSQL diretamente na máquina.
- **Padronização do ambiente:** facilita a reprodução da configuração por outros integrantes da equipe.
- **Configuração de conexão:** permite disponibilizar a porta do banco e definir variáveis de ambiente para a conexão com o backend.

## 4. Configuração utilizada

A inicialização do PostgreSQL está documentada no README por meio do comando `docker run`.

A aplicação utiliza as seguintes variáveis de ambiente:

- `DB_HOST`: endereço do servidor do banco.
- `DB_PORT`: porta de conexão.
- `DB_USERNAME`: usuário do banco.
- `DB_PASSWORD`: senha de acesso.
- `DB_NAME`: nome do banco de dados.

A integração com o TypeORM utiliza o driver PostgreSQL (`pg`).

As migrations são executadas automaticamente pela configuração `migrationsRun: true`, enquanto `synchronize: false` mantém desativada a sincronização automática do esquema.

## 5. Consequências

### Positivas

- Maior organização dos dados e de seus relacionamentos.
- Integridade referencial entre as entidades.
- Operações transacionais para preservar a consistência dos registros.
- Ambiente de desenvolvimento mais fácil de reproduzir.
- Controle das alterações no banco por meio de migrations.

### Pontos de atenção

- É necessário ter o Docker instalado e em execução na máquina de desenvolvimento.
- A porta 5432 precisa estar disponível para a conexão local.
- As credenciais do banco devem ser configuradas corretamente.
- A equipe precisa acompanhar a execução do container e a aplicação das migrations.
- Em ambientes de produção, as credenciais e os dados do banco precisam de configurações próprias de segurança e persistência.

## 6. Tecnologias relacionadas

- PostgreSQL
- Docker
- TypeORM
- Driver `pg`
- NestJS
- Migrations