# Rubrica — Etapa 2: Sistema preliminar

> **Peso:** 10% da nota final · **Entrega:** semana 12  
> Escala por critério: 4 Excelente · 3 Adequado · 2 Em desenvolvimento · 0–1 Insuficiente

**Equipe:** Eliabe Rafael, Erik Jerônimo, Joseildo dos Santos e Luis Felipe  
**Avaliador:** `<...>` · **Data:** `<...>`

Checkpoint técnico: esta etapa serve para verificar se o núcleo do backend está funcionando antes da integração com frontend, segurança e implantação. Neste momento, o projeto já tem uma estrutura inicial, mas algumas partes importantes ainda estão em desenvolvimento.

## Pré-requisitos (sim/não)

| Verificação | Sim | Não | Observação |
| --- | :---: | :---: | --- |
| Repositório acessível, com o código do backend | ☒ | ☐ | O backend está na pasta `Backend`, usando NestJS e TypeScript. |
| Modelo de dados versionado (migrações aplicadas, sem erro) | ☐ | ☒ | Ainda falta finalizar a integração com o banco, as entidades e as migrações. |
| Ao menos um endpoint de API funcionando fim a fim (banco → resposta) | ☐ | ☒ | Os endpoints já foram criados, mas os services ainda retornam respostas provisórias e não fazem persistência real. |

## Critérios

| Critério | Peso | 4 — Excelente | 3 — Adequado | 2 — Em desenvolvimento | 0–1 — Insuficiente | Nível |
| --- | ---: | --- | --- | --- | --- | :---: |
| **1. Modelo de dados** | 3,0 | 5+ models corretos, com relações, `on_delete` justificado e restrições de integridade testadas | 5+ models corretos, com relações e restrições básicas | 3–4 models ou relações confusas | Menos de 3 models ou modelagem que não sustenta as regras | **0–1** |
| **2. API e CRUD** | 4,0 | CRUD completo em 3+ recursos, com DTOs de entrada e saída separados | CRUD completo em 2 recursos | CRUD parcial | Não funciona | **2** |
| **3. Validação e consultas** | 2,0 | Validação de servidor cobrindo as regras, mais filtros ou paginação | Validação de servidor cobrindo as regras principais | Validação incompleta | Sem validação de servidor | **2** |
| **4. Organização do código** | 1,0 | Código legível, lint limpo, regra de negócio fora da view/controller | Lint limpo, código compreensível | Alguns problemas de organização | Código ilegível ou duplicado | **3** |
| **Total** | **10** | | | | | **Em andamento** |

### Justificativa dos níveis

**1. Modelo de dados — nível 0–1**  
A estrutura dos módulos já está separada, mas ainda não foi encontrada uma implementação final de entidades, relacionamentos, banco de dados ou migrações. Por isso, ainda não dá para considerar que o modelo de dados esteja funcionando.

**2. API e CRUD — nível 2**  
Já existem controllers e rotas para usuários, objetos, coleta, coletor e descarte. Alguns recursos possuem as rotas de CRUD montadas e existem DTOs de criação e atualização. Porém, os services ainda retornam textos provisórios, sem salvar ou consultar dados de verdade. O CRUD está parcialmente pronto.

**3. Validação e consultas — nível 2**  
Já existem algumas validações nos DTOs, como campos obrigatórios, datas, números e valores mínimos. Mesmo assim, ainda faltam validações específicas das regras do sistema, tratamento de erros, consultas reais, filtros e paginação.

**4. Organização do código — nível 3**  
A divisão em módulos, controllers, services, DTOs e entities deixa o projeto relativamente fácil de entender. A equipe ainda precisa revisar o lint e continuar tirando a lógica provisória dos services, mas a organização inicial está adequada.

## Partes que estão em progresso

- [ ] Criar e finalizar as entidades do banco de dados.
- [ ] Definir os relacionamentos entre usuários, descartes, coletas, coletores e objetos.
- [ ] Configurar a conexão com o banco de dados.
- [ ] Criar e aplicar as migrações.
- [ ] Trocar as respostas provisórias dos services pela lógica real do sistema.
- [ ] Implementar o CRUD completo com persistência.
- [ ] Melhorar as validações de acordo com as regras do EcoCampusIFPE.
- [ ] Adicionar tratamento de erros para registros inexistentes e dados inválidos.
- [ ] Criar consultas, filtros e, se necessário, paginação.
- [ ] Fazer testes dos endpoints usando o banco de dados.
- [ ] Revisar o lint e os testes antes da integração com o frontend.

## Devolutiva

**Pontos fortes:**

A equipe conseguiu montar a base do backend em NestJS e separar o código por módulos relacionados ao problema do projeto. Os principais recursos já foram identificados e há uma primeira versão dos controllers, services e DTOs. Também já começamos a colocar validações nos dados de entrada.

**O que ajustar antes da Etapa 3 (sistema final):**

O principal ajuste é transformar a estrutura atual em um backend realmente funcional. No estado atual, várias rotas ainda devolvem mensagens provisórias e não fazem operações reais no banco. Precisamos priorizar a modelagem dos dados, a integração com o banco, as migrações e a implementação dos services. Depois disso, será necessário testar os fluxos completos e melhorar as validações.

**Aprovado para seguir?** ☐ Sim · ☒ Sim, com ajustes · ☐ Não — corrigir e reenviar (recuperação)
