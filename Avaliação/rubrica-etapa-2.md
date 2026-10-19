# Rubrica — Etapa 2: Sistema preliminar

> **Peso:** 10% da nota final · **Entrega:** semana 12  
> Escala por critério: 4 Excelente · 3 Adequado · 2 Em desenvolvimento · 0–1 Insuficiente

**Equipe:** Eliabe Rafael, Erik Jerônimo, Joseildo dos Santos e Luis Felipe  
**Avaliador:** `<...>` · **Data:** `<...>`

Checkpoint técnico atualizado após a implementação do CRUD persistente, a execução das migrations no PostgreSQL do Docker, os testes de integração HTTP e as verificações de qualidade do backend. A entidade `Coleta` continua removida; o recurso `Coletor` representa o recipiente físico, e `DescarteItem` registra os objetos associados a um descarte.

## Pré-requisitos (sim/não)

| Verificação | Sim | Não | Observação |
| --- | :---: | :---: | --- |
| Repositório acessível, com o código do backend | ☒ | ☐ | Backend NestJS e TypeScript na pasta `Backend`. |
| Modelo de dados versionado (migrações aplicadas, sem erro) | ☒ | ☐ | As três migrations foram registradas no PostgreSQL `ecocampus`; as tabelas `usuarios`, `objetos`, `coletores`, `descartes` e `itens_descarte` foram verificadas. |
| Ao menos um endpoint de API funcionando fim a fim (banco → resposta) | ☒ | ☐ | Testes HTTP criam, consultam, atualizam e removem registros usando o banco PostgreSQL real. |

## Critérios

| Critério | Peso | 4 — Excelente | 3 — Adequado | 2 — Em desenvolvimento | 0–1 — Insuficiente | Nível |
| --- | ---: | --- | --- | --- | --- | :---: |
| **1. Modelo de dados** | 3,0 | 5+ models corretos, com relações, `on_delete` justificado e restrições de integridade testadas | 5+ models corretos, com relações e restrições básicas | 3–4 models ou relações confusas | Menos de 3 models ou modelagem que não sustenta as regras | **4** |
| **2. API e CRUD** | 4,0 | CRUD completo em 3+ recursos, com DTOs de entrada e saída separados | CRUD completo em 2 recursos | CRUD parcial | Não funciona | **4** |
| **3. Validação e consultas** | 2,0 | Validação de servidor cobrindo as regras, mais filtros ou paginação | Validação de servidor cobrindo as regras principais | Validação incompleta | Sem validação de servidor | **4** |
| **4. Organização do código** | 1,0 | Código legível, lint limpo, regra de negócio fora da view/controller | Lint limpo, código compreensível | Alguns problemas de organização | Código ilegível ou duplicado | **4** |
| **Total ponderado** | **10** | | | | | **10,0 / 10 — Concluído** |

O total ponderado usa `peso × nível ÷ 4` para cada critério.

### Justificativa dos níveis

**1. Modelo de dados — nível 4**
O modelo contém cinco entidades: `Usuario`, `Objeto`, `Coletor`, `Descarte` e `DescarteItem`. As relações e integridade referencial estão versionadas em migrations. O histórico de descartes impede exclusão do usuário associado (`RESTRICT`); excluir um coletor preserva o descarte e limpa sua referência (`SET NULL`); os itens são removidos junto com o descarte (`CASCADE`); e um objeto usado em um descarte não pode ser excluído (`RESTRICT`). Os testes de integração verificam os comportamentos de restrição, preservação e cascata.

**2. API e CRUD — nível 4**
Usuários, objetos, coletores e descartes têm operações de criação, listagem, consulta por UUID, atualização e remoção com persistência no PostgreSQL. Cada recurso usa DTOs de entrada e DTOs de resposta; a resposta de usuário não expõe senha. O teste HTTP verifica o CRUD dos quatro recursos e os itens relacionados ao descarte.

**3. Validação e consultas — nível 4**
O `ValidationPipe` global rejeita campos não declarados e valida os DTOs de entrada, incluindo formatos, faixas numéricas, UUIDs, status e itens aninhados. As listagens têm filtros próprios e paginação com limite máximo. Os testes verificam dados inválidos, conflito de e-mail, capacidade do coletor, filtros e paginação.

**4. Organização do código — nível 4**
Controllers cuidam das rotas, DTOs validam entradas e os services concentram persistência e regras de negócio. O ESLint foi configurado e executado sem warnings ou erros. A compilação TypeScript, o build NestJS e as suítes de teste passaram.

## Testes e verificações executados

| Verificação | Resultado | Evidência |
| --- | --- | --- |
| `npm test` | ✅ Passou | 5 testes unitários/smoke em 5 arquivos. |
| `npm run test:e2e` | ✅ Passou | 1 teste de integração HTTP contra PostgreSQL real; verifica CRUD dos quatro recursos, hash de senha, itens, filtros, paginação, validação, chaves estrangeiras, capacidade/reset do coletor e políticas de exclusão. |
| `npx tsc --noEmit` | ✅ Passou | Sem erros de tipo no backend. |
| `npx nest build` | ✅ Passou | Aplicação NestJS compilada. |
| `npm run lint` | ✅ Passou | ESLint executado em `src` sem warnings nem erros. |
| Estado do PostgreSQL Docker | ✅ Confirmado | As três migrations e as cinco tabelas do domínio foram conferidas; as chaves estrangeiras têm as políticas de exclusão previstas. |

## Partes concluídas

- [x] Alinhar entidades, DTOs e banco de dados.
- [x] Manter `Coleta` removida e modelar o recurso `Coletor` no lugar apropriado.
- [x] Configurar TypeORM e migrations para PostgreSQL.
- [x] Implementar CRUD persistente para usuários, objetos, coletores e descartes.
- [x] Criar DTOs separados para entrada e resposta.
- [x] Hash de senha e exclusão da senha das respostas da API.
- [x] Validar dados, relações, erros e limites de capacidade.
- [x] Adicionar filtros e paginação às listagens.
- [x] Criar testes HTTP integrados ao PostgreSQL.
- [x] Configurar e executar lint, checagem de tipos e build.

## Devolutiva

**Pontos fortes:**

O backend agora persiste dados no PostgreSQL e implementa os fluxos CRUD nos quatro recursos. As migrations preservam a versão inicial já aplicada e adicionam o esquema de recipiente físico, itens do descarte e regras de integridade referencial. Os testes de integração exercitam a API com o banco, além dos testes unitários, lint, type-check e build.

**Próximos passos fora do escopo desta etapa:**

Integrar o frontend e, antes de uma implantação pública, revisar autenticação/autorização, gestão segura de credenciais e configuração de produção. Os testes de integração dependem do PostgreSQL definido pelas variáveis `DB_*` estar disponível.

**Aprovado para seguir?** ☒ Sim · ☐ Sim, com ajustes · ☐ Não — corrigir e reenviar (recuperação)
