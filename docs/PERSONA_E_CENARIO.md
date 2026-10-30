# Personas e Cenários de Uso — EcocampusIFPE

## Personas

### Persona 1: Lucas Oliveira (Aluno)
* **Perfil:** 20 anos, estudante do curso técnico em Informática no IFPE.
* **Necessidades:** Quer realizar o descarte correto de resíduos eletrônicos e materiais recicláveis gerados nos projetos do campus de forma rápida e intuitiva.
* **Dores:** Não sabe quais pontos de coleta aceitam determinados tipos de materiais e teme descartar algo incorretamente.

### Persona 2: Seu Severino (Agente de Limpeza / CINFRA)
* **Perfil:** 48 anos, encarregado da manutenção e limpeza das áreas comuns do campus.
* **Necessidades:** Precisa saber exatamente quais coletores estão cheios para otimizar sua rota de recolhimento sem andar o campus inteiro à toa.
* **Dores:** Perda de tempo em rondas desnecessárias verificando lixeiras vazias e picos de transbordamento nos horários de pico.

### Persona 3: Roberto Santos (Gestor de Patrimônio / TI)
* **Perfil:** 38 anos, responsável pelo controle de bens e equipamentos do IFPE.
* **Necessidades:** Garantir que equipamentos da instituição não sejam descartados sem o devido processo de baixa patrimonial.
* **Dores:** Perda de controle sobre itens sucateados e descarte indevido de materiais tombados pelo IFPE.

---

## Cenário de Uso (Passo a Passo)

### Cenário 1: Descarte de Resíduo por Estudante (Lucas)
1. Lucas chega ao ponto de coleta no campus com uma placa eletrônica defeituosa.
2. Ele acessa a aplicação, seleciona o coletor correspondente e inicia o registro do descarte.
3. O sistema solicita a identificação do objeto. Lucas insere as informações do item.
4. O sistema valida se o item possui etiqueta de patrimônio do IFPE. Se não possuir, o descarte é autorizado e registrado com sucesso.

### Cenário 2: Atendimento de Alerta de Recolhimento (Seu Severino)
1. O coletor da área do bloco acadêmico atinge 80% de sua capacidade.
2. O sistema altera o status do coletor para "Necessita Esvaziamento".
3. Seu Severino consulta o painel da CINFRA, visualiza o alerta e se desloca diretamente ao coletor indicado.
4. Após esvaziar o coletor, o status é atualizado no sistema, zerando a capacidade ocupada.