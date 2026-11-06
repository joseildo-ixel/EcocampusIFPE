# Evolução do Modelo: Tabela Antes × Depois

Para garantir a integridade dos dados e refletir as regras de negócio alinhadas com a CINFRA, o modelo sofreu os seguintes refinamentos desde a concepção inicial na Etapa 1:

| Elemento / Entidade | Concepção Inicial (Antes) | Refinamento Aplicado (Depois) | Justificativa de Negócio e Arquitetura |
| :--- | :--- | :--- | :--- |
| **Chaves Primárias (PK)** | Identificadores inteiros sequenciais (auto-incremento). | Substituição por **UUID** (Universally Unique Identifier) em todas as tabelas. | Aumenta a segurança da API evitando ataques de enumeração (IDOR) em rotas públicas e URLs. |
| **Tipos Numéricos (Peso/Capacidade)** | Utilização do tipo primitivo genérico `float` ou `number`. | Configuração explícita para `decimal` com `precision: 5, scale: 2`. | Evita erros sistêmicos de arredondamento em medidas físicas (ex: 2.30 kg) ao longo do tempo. |
| **Campos de Observação** | Assumidos como obrigatórios pelo TypeORM (`NOT NULL` padrão). | Inserção explícita da anotação `@Column({ nullable: true })` no campo `observacoes` do Descarte. | Reflete a realidade operacional: os usuários não são obrigados a digitar justificativas a cada descarte comum. |
| **Restrições de Unicidade** | Validação de duplicidade apenas a nível de código (Backend). | Aplicação de `@Column({ unique: true })` nos campos `email` e `matricula` do Usuário. | Blinda o banco de dados nativamente contra registros duplicados em caso de requisições simultâneas (race conditions). |
| **Controle de Tempo** | Tipo `Date` nativo do TypeScript sem fuso horário. | Uso de `timestamptz` ou `@CreateDateColumn()`. | Permite auditar com precisão o horário exato dos descartes com fuso horário, ajudando a identificar picos de uso para a CINFRA. |
| **Regra do Patrimônio (Objeto)** | Cadastro genérico sem distinção de origem do material. | Inclusão do campo booleano `patrimonio_ifpe` para integração com regras de bloqueio. | Atende diretamente ao requisito da CINFRA de impedir o descarte acidental ou indevido de bens tombados pelo instituto. |