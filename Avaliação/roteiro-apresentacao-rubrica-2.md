# Roteiro de apresentação — Rubrica 2

**Projeto:** EcoCampusIFPE  
**Duração sugerida:** 8 a 10 minutos  
**Foco:** demonstrar o que está implementado no checkpoint da etapa 2, relacionando-o aos critérios da rubrica e explicando as regras de negócio.

## Antes de apresentar

- Deixar o PostgreSQL do projeto disponível e o backend iniciado na pasta `Backend`.
- Abrir o repositório, esta rubrica e, se possível, uma ferramenta para fazer requisições HTTP.
- Usar dados de demonstração descartáveis. Evitar expor senhas reais.
- Dividir as falas entre os integrantes. Uma divisão possível é: abertura e modelo de dados; API e demonstração; regras de negócio e validação; testes, limitações e encerramento.

## 1. Abertura e objetivo — 45 segundos

**Fala sugerida**

> “O EcoCampusIFPE é um sistema para registrar e acompanhar o descarte de resíduos eletrônicos no campus. Nesta etapa, nosso foco foi construir a base funcional do backend: modelar os dados, persistir no PostgreSQL, oferecer operações de cadastro e consulta e aplicar regras para manter os registros consistentes.”

> “A rubrica 2 avalia modelo de dados, API e CRUD, validação e consultas, e organização do código. Vamos mostrar o que já está funcionando e como isso foi verificado.”

**Enfatizar:** a entrega desta etapa é principalmente o backend. A proposta completa do produto também prevê experiências de interface e recursos operacionais que ainda não fazem parte do checkpoint atual.

## 2. Modelo de dados — 1 minuto e 15 segundos

**Fala sugerida**

> “O modelo tem cinco entidades: `Usuario`, `Objeto`, `Coletor`, `Descarte` e `DescarteItem`. As quatro primeiras representam os recursos centrais da API; `DescarteItem` é a entidade de associação que registra quais objetos e quantidades compõem cada descarte.”

> “Um usuário pode estar relacionado a vários descartes. Cada descarte se relaciona com um coletor, quando disponível, e pode conter vários itens. Cada item aponta para um objeto do catálogo. Os IDs são UUIDs e o esquema do PostgreSQL é mantido por migrations, em vez de depender de sincronização automática.”

**Mostrar:** as migrations e/ou as entidades. Explicar que as regras de exclusão preservam o histórico:

- Não se exclui um usuário que tenha descartes associados (`RESTRICT`).
- Excluir um coletor mantém os descartes e deixa a referência ao coletor nula (`SET NULL`).
- Excluir um descarte remove seus itens associados (`CASCADE`).
- Não se exclui um objeto referenciado por itens de descarte (`RESTRICT`).

**Conexão com a rubrica:** cinco entidades relacionadas e políticas de integridade referencial implementadas e verificadas nos testes de integração.

## 3. API e CRUD — 1 minuto

**Fala sugerida**

> “Implementamos operações de criação, listagem, consulta por ID, atualização e remoção para usuários, objetos, coletores e descartes. Os controllers expõem as rotas HTTP e encaminham o trabalho para os services; os DTOs separam os dados de entrada do formato das respostas.”

Rotas principais para mostrar:

| Recurso | Rota |
| --- | --- |
| Usuários | `/usuarios` |
| Objetos | `/objetos` |
| Coletores | `/api/coletor` |
| Descartes | `/descarte` |

> “O cadastro de um descarte também recebe, opcionalmente, itens no formato `itens: [{ objetoId, quantidade }]`. A API persiste esse relacionamento e retorna os itens associados.”

**Conexão com a rubrica:** CRUD completo em mais de três recursos, com DTOs de entrada e resposta separados.

## 4. Demonstração de um fluxo — 2 minutos

Faça uma demonstração curta, de preferência com chamadas HTTP previamente preparadas:

1. Criar um usuário e destacar que a resposta não inclui a senha.
2. Criar um coletor, mostrando que ele começa com `volumeAtual` igual a zero.
3. Criar um objeto do catálogo.
4. Criar um descarte referenciando o usuário, o coletor e o objeto, por exemplo:

```json
{
  "tipoResiduo": "eletrônico",
  "pesoKg": 2,
  "destino": "Triagem",
  "usuarioId": "<uuid-do-usuario>",
  "coletorId": "<uuid-do-coletor>",
  "itens": [
    {
      "objetoId": "<uuid-do-objeto>",
      "quantidade": 2
    }
  ]
}
```

5. Consultar o descarte e o coletor para mostrar que o registro contém o item e que a contribuição do descarte foi contabilizada no coletor.
6. Se houver tempo, tentar uma operação inválida — por exemplo, ultrapassar a capacidade — e mostrar a resposta de erro.

**Fala sugerida**

> “Esse fluxo mostra o caminho completo da requisição: validação do DTO, regras no service, gravação no PostgreSQL e resposta HTTP. A criação do descarte e a atualização do coletor acontecem na mesma transação para manter os dados consistentes.”

**Nota para a demonstração:** hoje o campo `volumeAtual` é atualizado somando o `pesoKg` do descarte. Portanto, a capacidade é controlada pelo peso informado; a unidade e a modelagem física do recipiente devem ser alinhadas numa evolução futura se o produto precisar medir volume real.

## 5. Regras de negócio — 1 minuto e 30 segundos

Apresentar as regras como exemplos concretos do comportamento do sistema:

### Usuários

- Nome obrigatório, e-mail válido, senha com pelo menos seis caracteres e função limitada a `admin`, `usuario` ou `coletor`.
- O e-mail não pode se repetir.
- A senha é armazenada com hash e não é incluída na resposta da API.
- Um usuário com descartes associados não pode ser removido, para preservar o histórico.

### Objetos

- Nome, descrição, tipo e peso são obrigatórios; o peso deve ser positivo e ter no máximo duas casas decimais, entre `0,01` e `999,99` kg.
- Objetos inativos não podem ser associados a novos descartes.
- Um objeto já usado em um descarte não pode ser excluído.

### Coletores e descartes

- O coletor tem localização, capacidade máxima e situação ativa/inativa; começa com volume atual zero.
- Não é permitido reduzir a capacidade máxima abaixo do valor atualmente registrado.
- Não é permitido registrar descarte em coletor inativo nem ultrapassar a capacidade disponível.
- O descarte precisa apontar para um usuário e um coletor existentes.
- O peso do descarte deve estar entre `0,01` e `999,99` kg, com até duas casas decimais. Se não for informado, o status começa como `pendente`; os status aceitos são `pendente`, `processado` e `finalizado`.
- Os itens são opcionais; cada quantidade deve ser um inteiro maior ou igual a 1, os objetos precisam existir e estar ativos, e o mesmo objeto não pode aparecer duas vezes no mesmo descarte.
- Atualizar o peso ou finalizar um descarte recalcula a contribuição no coletor. Ao finalizar, essa contribuição deixa de contar como ocupação.
- Ao resetar o coletor, o sistema zera o valor registrado e finaliza os descartes ainda não finalizados ligados a ele.
- Ao excluir um coletor, os descartes são preservados e passam a ficar sem coletor associado.

> “Essas regras são aplicadas no servidor, não dependem apenas da interface. A integridade também é protegida pelas chaves estrangeiras e pelas restrições no banco.”

## 6. Validação, consultas e organização — 1 minuto

**Fala sugerida**

> “A aplicação usa validação global dos DTOs. Campos extras são rejeitados, os tipos são convertidos quando apropriado e os IDs das rotas são validados como UUID. As listagens suportam filtros próprios de cada recurso e paginação.”

- Paginação padrão: página 1, limite 20; o limite máximo é 100.
- Exemplos de filtros: nome, e-mail e função de usuário; nome, tipo e estado de objeto; localização e estado de coletor; status, tipo de resíduo, usuário e coletor em descartes.
- Os controllers cuidam das rotas, DTOs da validação da entrada e services das regras e operações de persistência.

**Conexão com a rubrica:** validação no servidor, filtros, paginação e separação de responsabilidades.

## 7. Evidências de teste e encerramento — 1 minuto

**Fala sugerida**

> “Além do CRUD, os testes de integração HTTP exercitam a API contra o PostgreSQL: verificam relações, filtros, paginação, dados inválidos, e-mail duplicado, limite de capacidade, atualização e reset do coletor e as políticas de exclusão. Também executamos testes, lint, checagem de tipos e build.”

Segundo o registro da rubrica, passaram `npm test`, `npm run test:e2e`, `npx tsc --noEmit`, `npx nest build` e `npm run lint`. A integração depende de um PostgreSQL disponível com as variáveis `DB_*` configuradas.

**Encerramento sugerido**

> “Na rubrica 2, o checkpoint está concluído: o backend tem cinco entidades relacionadas, CRUD persistente em quatro recursos, validação e consultas e responsabilidades organizadas. Como próximos passos do produto, ficam a integração do frontend e a implementação das experiências ainda previstas na visão do projeto.”

## Escopo: implementado e planejado

Para não apresentar funcionalidades planejadas como se já estivessem prontas:

**Implementado e coberto pelo checkpoint:** backend NestJS, PostgreSQL e migrations; CRUD de usuários, objetos, coletores e descartes; itens associados ao descarte; validação, filtros, paginação e regras de integridade; testes unitários e de integração.

**Ainda não demonstrado como funcionalidade entregue nesta etapa:** frontend, fluxo de QR Code, anexos de fotos, dashboard gerencial, alerta automático ao atingir 80% da capacidade e galeria de reaproveitamento. Esses itens aparecem como visão/funcionalidades do produto no README, mas não fazem parte do backend concluído descrito na rubrica 2.

**Observação de escopo:** os testes confirmam persistência e comportamento da API; não equivalem a uma validação de implantação em produção. A rubrica também recomenda revisar autenticação/autorização e credenciais antes de uma implantação pública.
