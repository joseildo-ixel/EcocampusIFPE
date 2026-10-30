# Backlog do Produto (Histórias de Usuário — MVP)

## US01 — Autenticação e Cadastro de Usuários
* **Como** usuário do sistema (Aluno, CINFRA, Servidor),  
* **Eu quero** me cadastrar e realizar login com e-mail e senha,  
* **Para que** eu possa acessar as funcionalidades restritas do sistema com segurança.  

**Critérios de Aceite:**
* O sistema deve validar e-mails no formato padrão.
* A senha deve ser armazenada utilizando hash criptográfico seguro (bcrypt).
* Tentativas de login com credenciais inválidas devem retornar status HTTP 401.

---

## US02 — Gerenciamento de Coletores
* **Como** agente da CINFRA,  
* **Eu quero** cadastrar, listar e atualizar o status e localização dos coletores do campus,  
* **Para que** seja possível monitorar a capacidade de armazenamento de cada ponto.  

**Critérios de Aceite:**
* Cada coletor deve possuir localização, capacidade máxima e nível de preenchimento atual.
* O sistema deve alterar o status do coletor para "Atenção" assim que a capacidade atingir 80%.

---

## US03 — Registro de Descarte
* **Como** aluno ou servidor,  
* **Eu quero** registrar o descarte de um objeto em um determinado coletor,  
* **Para que** o volume ocupado no coletor seja atualizado e o histórico de descartes registrado.  

**Critérios de Aceite:**
* O descarte deve atualizar automaticamente a porcentagem ocupada do coletor correspondente.
* Cada descarte deve ser vinculado ao usuário que o realizou.

---

## US04 — Restrição de Descarte de Patrimônio do IFPE
* **Como** gestor do campus / patrimônio,  
* **Eu quero** que o sistema impeça o registro de descartes de objetos identificados como patrimônio do IFPE,  
* **Para que** itens públicos não sejam descartados de forma irregular.  

**Critérios de Aceite:**
* Ao tentar cadastrar um objeto marcado com patrimônio = `true` (ou número de tombo válido), o sistema deve negar a operação.
* A API deve retornar um erro claro (`HTTP 400 Bad Request` ou `HTTP 422 Unprocessable Entity`) com a mensagem: *"Objetos tombados como patrimônio do IFPE não podem ser descartados pelo sistema."*S