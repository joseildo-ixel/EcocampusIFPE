# Rubrica — Etapa 1: Definição e planejamento

> **Peso:** 15% · **Entrega:** semana 10  
> Escala por critério: 4 Excelente · 3 Adequado · 2 Em desenvolvimento · 0–1 Insuficiente

**Equipe:** Eliabe Rafael, Erik Jerônimo, Joseildo dos Santos e Luis Felipe  
**Data:** 2026-09-19

## Pré-requisitos (sim/não)

| Verificação | Sim | Não | Observação |
| --- | :---: | :---: | --- |
| Organização parceira externa, com aceite por escrito (carta de anuência ou e-mail) | ☐ | ☒ | A organização foi identificada como o IFPE Campus Palmares, mas ainda falta anexar ao repositório uma evidência formal do aceite. |
| Houve ao menos uma conversa com a organização sobre o problema | ☒ | ☐ | O canvas registra uma conversa com um técnico administrativo da CINFRA sobre o monitoramento manual da lixeira. |
| Acordo de equipe com papéis e *Definition of Done* | ☐ | ☒ | A equipe está identificada, mas ainda não foi registrado um acordo com papéis e critérios de conclusão. |

Matriz de decisão, canvas e painel de problemas são **ferramentas de trabalho**. Nesta avaliação, consideramos principalmente o que já foi definido e registrado no projeto.

## Critérios

| Critério | Peso | 4 — Excelente | 3 — Adequado | 2 — Em desenvolvimento | 0–1 — Insuficiente | Nível |
| --- | ---: | --- | --- | --- | --- | :---: |
| **1. Problema e demanda** | 2,0 | Problema real formulado com quem, o quê, como é hoje e qual consequência, com evidências da conversa com a organização | Problema real, claro e validado com a organização | Formulação vaga | Descreve uma solução, não um problema | **3** |
| **2. Usuários e cenário** | 1,5 | 2–3 personas baseadas em pessoas reais, com contexto de uso; cenário principal passo a passo | Personas plausíveis e cenário principal descrito | Personas genéricas ou cenário vago | Ausentes | **3** |
| **3. Escopo e sucesso** | 2,0 | MVP com até 6 funcionalidades, lista do que fica de fora justificada, metas numéricas com forma de medir | MVP viável no prazo, com o que fica de fora e metas verificáveis | Escopo ambicioso ou metas vagas | Escopo indefinido ou inviável | **3** |
| **4. Backlog** | 1,5 | Histórias com critérios de aceite, estimadas e priorizadas (MoSCoW); MVP só com *Must* | Histórias priorizadas, com critérios de aceite | Histórias vagas | Lista de tarefas técnicas | **2** |
| **5. Desenho técnico da API** | 2,0 | Modelo de dados com relações e restrições; **rascunho do contrato** (recursos, rotas, status e erros principais); papéis × rotas; 2+ ADRs com alternativas | Modelo de dados, lista de rotas por recurso e papéis definidos; 1+ ADR | Modelo incompleto ou rotas sem relação com o modelo | Ausente | **2** |
| **6. Plano de execução** | 1,0 | Semanas 11–18 com entregas e responsáveis; 3–5 riscos específicos com plano B | Cronograma com marcos e principais riscos | Cronograma genérico | Ausente | **2** |
| **Total** | **10** | | | | | **6,4 / 10** |

**Nota** = Σ (nível × peso) ÷ 4  
**Cálculo:** (3 × 2,0 + 3 × 1,5 + 3 × 2,0 + 2 × 1,5 + 2 × 2,0 + 2 × 1,0) ÷ 4 = **6,4**

## Justificativa dos níveis

### 1. Problema e demanda — nível 3

O problema está bem direcionado para uma situação real do IFPE Campus Palmares. O projeto explica que a CINFRA acompanha o volume do lixo eletrônico por meio de rondas manuais e que não possui métricas suficientes. Também foi registrada uma fala de um técnico administrativo e o problema da falta de métricas foi relacionado à gestão da lixeira. Para chegar ao nível 4, ainda seria importante guardar no repositório a evidência formal da conversa e detalhar melhor a frequência das rondas e o impacto causado por elas.

### 2. Usuários e cenário — nível 3

Os usuários principais foram identificados: a comunidade que faz o descarte, a CINFRA e a equipe de limpeza. O servidor responsável pelo patrimônio e a comunidade Maker também aparecem como pessoas afetadas. O uso por QR Code em frente à lixeira está explicado, mas ainda falta apresentar personas mais completas e descrever o cenário inteiro passo a passo.

### 3. Escopo e sucesso — nível 3

O MVP tem quatro funcionalidades principais: formulário de descarte com foto, bloqueio relacionado à etiqueta de patrimônio, dashboard de volume e alerta de 80% de capacidade. O que fica fora do escopo também foi registrado, incluindo o aplicativo mobile nativo e a gestão completa de bens patrimoniados. Existem metas de adoção e de redução das rondas, com uma forma inicial de medição. Ainda precisamos deixar mais claro como os resultados serão acompanhados durante o desenvolvimento.

### 4. Backlog — nível 2

O repositório mostra bem o que o produto precisa fazer, mas ainda não há um backlog completo com histórias de usuário, critérios de aceite, estimativa e priorização MoSCoW. As funcionalidades estão listadas, porém ainda precisam ser transformadas em itens que possam ser acompanhados pela equipe.

### 5. Desenho técnico da API — nível 2

Os papéis do sistema e algumas funcionalidades estão definidos, e o README já indica recursos que provavelmente serão usados no backend, como usuários, descartes, coletas, objetos e coletores. Mesmo assim, ainda falta documentar o contrato da API com rotas, status de resposta e erros, além de registrar as relações do modelo e as decisões técnicas em ADRs.

### 6. Plano de execução — nível 2

O documento informa o prazo até a semana 18, a equipe e alguns riscos, como baixa adesão ao QR Code e dificuldade no envio de fotos. Também existem ideias de resposta para esses riscos. Porém, ainda não foi encontrado um cronograma detalhado das semanas 11–18 com entregas e responsáveis, e o plano B dos riscos precisa ser mais específico.

## Partes que estão em progresso

- [ ] Adicionar a carta de anuência ou o e-mail de aceite da organização parceira.
- [ ] Registrar o acordo da equipe, incluindo os papéis de cada integrante.
- [ ] Definir a *Definition of Done* do projeto.
- [ ] Criar 2 ou 3 personas com base no contexto real do campus.
- [ ] Descrever o cenário principal de uso passo a passo.
- [ ] Transformar as funcionalidades em histórias de usuário.
- [ ] Adicionar critérios de aceite para cada história.
- [ ] Estimar e priorizar o backlog usando MoSCoW.
- [ ] Documentar o contrato inicial da API, com recursos, rotas, status e erros principais.
- [ ] Fazer o modelo de dados com as relações e restrições.
- [ ] Criar pelo menos dois ADRs com as alternativas consideradas.
- [ ] Montar o cronograma das semanas 11–18 com responsáveis.
- [ ] Detalhar os riscos e os respectivos planos B.

## Sinais de alerta

- [ ] A solução foi escolhida antes de conhecer o problema.
- [ ] Ninguém da equipe falou diretamente com a organização.
- [ ] Tema idêntico ao de outra equipe.
- [ ] Local de uso sem internet ou equipamento compatível, e a equipe não percebeu.

Até o momento, o problema foi relacionado a uma situação real e houve registro de conversa com a CINFRA. Mesmo assim, ainda precisamos anexar a comprovação formal e confirmar melhor as condições de uso no local.

## Devolutiva

**Pontos fortes:**

A equipe conseguiu definir um problema concreto do IFPE Campus Palmares e relacioná-lo com uma necessidade da CINFRA. O canvas apresenta os usuários afetados, um MVP com poucas funcionalidades e algumas metas de sucesso. Também foi positivo registrar o que não será feito agora, porque isso evita aumentar demais o escopo.

**O que ajustar antes da Etapa 2:**

Antes de avançar, precisamos organizar melhor a parte de planejamento que ainda está espalhada ou apenas descrita em alto nível. As prioridades são anexar o aceite da organização, formalizar os papéis da equipe, transformar as funcionalidades em histórias com critérios de aceite e detalhar o contrato da API. Também é necessário criar um cronograma mais prático, com responsáveis e entregas semanais.

**Escopo aprovado?** ☐ Sim · ☒ Sim, com redução · ☐ Não — refazer

O escopo atual parece viável, desde que a equipe mantenha as quatro funcionalidades principais e não tente incluir o aplicativo mobile nativo ou a gestão completa de patrimônio nesta etapa.
