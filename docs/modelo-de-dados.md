# Modelo de Dados — EcoCampusIFPE

## 1. Visão geral

O banco de dados do EcoCampusIFPE utiliza PostgreSQL e possui cinco tabelas principais:

- **usuarios:** armazena os usuários que registram descartes.
- **coletores:** representa os pontos físicos de coleta de resíduos.
- **descartes:** registra as operações de descarte realizadas.
- **objetos:** mantém o cadastro dos objetos que podem ser descartados.
- **itens_descarte:** relaciona os descartes aos objetos e registra suas quantidades.

## 2. Diagrama entidade-relacionamento

```mermaid
erDiagram
    USUARIOS ||--o{ DESCARTES : registra
    COLETORES o|--o{ DESCARTES : recebe
    DESCARTES ||--o{ ITENS_DESCARTE : possui
    OBJETOS ||--o{ ITENS_DESCARTE : compoe

    USUARIOS {
        uuid id PK
        varchar nome
        varchar email UK
        varchar senha
        varchar role
        boolean ativo
        timestamp dataCriacao
    }

    COLETORES {
        uuid id PK
        varchar localizacao
        numeric capacidadeMaxima
        numeric volumeAtual
        boolean ativo
        timestamp dataCriacao
    }

    DESCARTES {
        uuid id PK
        varchar status
        timestamp dataDescarte
        numeric pesoKg
        varchar tipoResiduo
        varchar destino
        text observacoes
        timestamp dataCriacao
        uuid usuarioId FK
        uuid coletorId FK
    }

    OBJETOS {
        uuid id PK
        varchar nome
        text descricao
        varchar tipo
        decimal pesoKg
        boolean ativo
        timestamp dataCriacao
    }

    ITENS_DESCARTE {
        uuid id PK
        uuid descarteId FK
        uuid objetoId FK
        integer quantidade
    }
```

## 3. Descrição das entidades

### 3.1 Usuarios

Armazena os dados dos usuários do sistema.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único (PK) |
| nome | VARCHAR(255) | Nome do usuário |
| email | VARCHAR(255) | E-mail único |
| senha | VARCHAR(255) | Senha armazenada |
| role | VARCHAR(50) | Perfil de acesso |
| ativo | BOOLEAN | Situação do usuário |
| dataCriacao | TIMESTAMP | Data de criação |

### 3.2 Coletores

Armazena informações sobre os pontos físicos de coleta.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único (PK) |
| localizacao | VARCHAR(255) | Localização do coletor |
| capacidadeMaxima | NUMERIC(10,2) | Capacidade máxima |
| volumeAtual | NUMERIC(10,2) | Volume atual |
| ativo | BOOLEAN | Situação do coletor |
| dataCriacao | TIMESTAMP | Data de criação |

### 3.3 Descartes

Registra as operações de descarte realizadas pelos usuários.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único (PK) |
| status | VARCHAR(50) | Situação do descarte |
| dataDescarte | TIMESTAMP | Data do descarte |
| pesoKg | NUMERIC(5,2) | Peso total em quilogramas |
| tipoResiduo | VARCHAR(50) | Tipo de resíduo |
| destino | VARCHAR(100) | Destino do resíduo |
| observacoes | TEXT | Observações adicionais |
| dataCriacao | TIMESTAMP | Data de criação |
| usuarioId | UUID | Referência ao usuário (FK) |
| coletorId | UUID | Referência ao coletor (FK, opcional) |

### 3.4 Objetos

Armazena os tipos de objetos que podem ser registrados nos descartes.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único (PK) |
| nome | VARCHAR(255) | Nome do objeto |
| descricao | TEXT | Descrição do objeto |
| tipo | VARCHAR(50) | Categoria do objeto |
| pesoKg | DECIMAL(5,2) | Peso em quilogramas |
| ativo | BOOLEAN | Situação do objeto |
| dataCriacao | TIMESTAMP | Data de criação |

### 3.5 Itens de descarte

Tabela intermediária que relaciona os descartes aos objetos. Permite que um descarte contenha vários objetos e que um mesmo objeto apareça em diferentes descartes.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único (PK) |
| descarteId | UUID | Referência ao descarte (FK) |
| objetoId | UUID | Referência ao objeto (FK) |
| quantidade | INTEGER | Quantidade de objetos descartados |

## 4. Relacionamentos

- Um usuário pode registrar vários descartes.
- Cada descarte pertence a um usuário.
- Um coletor pode estar associado a vários descartes.
- Um descarte pode não possuir um coletor associado.
- Um descarte pode conter vários itens.
- Um objeto pode aparecer em vários itens de descarte.

## 5. Regras de integridade

- O e-mail do usuário deve ser único.
- A combinação de descarte e objeto deve ser única em `itens_descarte`.
- A quantidade de cada item deve ser maior que zero.
- Um usuário com descartes registrados não pode ser excluído.
- A exclusão de um coletor mantém os descartes, removendo apenas sua referência.
- A exclusão de um descarte também exclui seus itens.
- Um objeto associado a itens de descarte não pode ser excluído.

## 6. Observação sobre as migrations

A estrutura inicial da tabela `coletores` possuía outros campos, que foram posteriormente tornados opcionais. A migration seguinte acrescentou `localizacao`, `capacidadeMaxima` e `volumeAtual`.

A migration `PreserveDisposalHistory` alterou a regra de exclusão de usuários, substituindo `CASCADE` por `RESTRICT`.

Este documento representa o modelo de domínio atual, considerando as entidades e as alterações realizadas pelas migrations.
## 7. Relacionamentos e regras de exclusão

As chaves estrangeiras garantem a integridade dos relacionamentos entre as tabelas.

| Relacionamento | Regra ON DELETE | Justificativa de negócio |
|---|---|---|
| `descartes.usuarioId` → `usuarios.id` | RESTRICT | Impede excluir um usuário que possui descartes registrados, preservando o histórico e a identificação de quem realizou cada operação. |
| `descartes.coletorId` → `coletores.id` | SET NULL | Permite excluir um coletor sem apagar os descartes já registrados. O histórico permanece, mas perde a referência ao coletor excluído. |
| `itens_descarte.descarteId` → `descartes.id` | CASCADE | Os itens dependem do descarte ao qual pertencem. Ao excluir o descarte, seus itens relacionados também são excluídos. |
| `itens_descarte.objetoId` → `objetos.id` | RESTRICT | Impede excluir um objeto que já foi utilizado em itens de descarte, preservando a integridade dos registros históricos. |

## 8. Restrições e índices

### 8.1 Restrições UNIQUE

- `usuarios.email`: impede que duas contas utilizem o mesmo endereço de e-mail.
- `coletores.matricula`: definida como única na migration inicial. Posteriormente, a coluna tornou-se opcional. Assim, valores preenchidos não podem se repetir, mas podem existir registros sem matrícula.
- `itens_descarte (descarteId, objetoId)`: impede que o mesmo objeto seja cadastrado mais de uma vez no mesmo descarte. Caso seja necessário aumentar a quantidade, o registro existente pode ser atualizado.

### 8.2 Restrições NOT NULL e campos opcionais

- As chaves primárias e os campos obrigatórios das entidades devem possuir valores.
- `descartes.usuarioId` é obrigatório, pois todo descarte precisa estar associado a um usuário.
- `descartes.coletorId` é opcional, pois um descarte pode existir sem estar vinculado a um coletor.
- `descartes.observacoes` é opcional, pois o registro pode ser realizado sem observações.
- Os campos antigos `nome`, `matricula`, `email`, `telefone` e `departamento` da estrutura inicial de `coletores` foram posteriormente tornados opcionais pela migration `CompleteDomainSchema`.

### 8.3 Outras restrições

- `itens_descarte.quantidade`: possui uma restrição CHECK que exige valor maior que zero.
- As chaves primárias UUID identificam exclusivamente cada registro.
- Campos como `ativo` e `volumeAtual` possuem valores padrão definidos para facilitar a criação dos registros.

### 8.4 Índices

As chaves primárias e as restrições UNIQUE criam índices automaticamente no PostgreSQL, contribuindo para a identificação e localização dos registros.

Nas migrations analisadas, não foram identificadas definições explícitas de índices secundários adicionais.

### 8.5 Validações da aplicação

Além das restrições do banco, os DTOs utilizam validações do `class-validator`, como `IsNotEmpty`, `IsEmail`, `IsUUID`, `IsInt` e `Min`.

Essas validações verificam os dados recebidos pela API antes do processamento. Elas são diferentes das restrições diretamente aplicadas pelo PostgreSQL.

## 9. Observação sobre o ambiente do banco

Durante a análise, foi identificado que o banco PostgreSQL existente no container Docker apresenta tabelas e relacionamentos diferentes daqueles definidos nas entidades e migrations atuais do projeto.

Também não foi encontrada uma tabela de histórico de migrations nesse banco.

Por esse motivo, as regras e os relacionamentos descritos neste documento foram definidos com base no código-fonte e nas migrations versionadas no repositório, e não na estrutura antiga encontrada no container.
