**Projeto:** Gestão Inteligente de Lixo Eletrônico · **Equipe:** Eduardo Artur, Eliabe Rafael, Erik Jerônimo, Joseildo dos Santos e Luis Felipe · **Data:** 2026-09-19
**Organização parceira:** IFPE Campus Palmares

---

## 1. Problema

No IFPE Campus Palmares, a Coordenadoria de Infraestrutura (CINFRA) precisa gerenciar o descarte e recolhimento do lixo eletrônico, mas hoje o monitoramento é feito apenas com rondas periódicas manuais, o que causa total falta de métricas de volume institucional e risco de descarte irregular de equipamentos tombados na lixeira comum.

**Evidências de que o problema existe** (dados, falas, observação):

* O Técnico Administrativo responsável pela CINFRA confirmou que o monitoramento atual é estritamente manual, onde "alguém passa periodicamente para olhar".
* A pesquisa institucional revelou que a "Falta de métricas de volume" é o principal problema enfrentado pela gestão da lixeira hoje.

## 2. Quem é afetado

| Quem | Quantas pessoas | Como é afetado hoje |
|---|---|---|
| CINFRA e Equipe de Limpeza | Equipe terceirizada + 1 Técnico | Não há equipe específica. Gastam tempo com rondas visuais periódicas improdutivas e não possuem relatórios de volume gerado pelo campus. |
| Servidor de Patrimônio | 1 | Corre o risco de perder o rastreio de bens públicos caso alunos descartem equipamentos tombados na lixeira comum sem dar baixa. |
| Comunidade Maker e Laboratórios | Centenas de alunos | Perdem a oportunidade de reaproveitar motores, placas e insumos, já que a triagem atual é falha e ocorre apenas de forma intermitente. |

## 3. Solução proposta

Em duas frases, sem jargão técnico:

> Um aplicativo acessado via QR Code na lixeira do campus que permite registrar o lixo eletrônico descartado e anexar fotos. O sistema calcula o volume e envia alertas para a equipe de infraestrutura recolher no momento certo.

## 4. Funcionalidades do MVP (3 a 5)

| # | Funcionalidade | Para quem | Por que é essencial |
|---|---|---|---|
| 1 | Formulário de descarte com foto via QR Code | Comunidade | Identifica o lixo e permite que peças úteis sejam visualizadas antes da reciclagem. |
| 2 | Bloqueio por Etiqueta de Patrimônio | Comunidade | Impede o descarte irregular de equipamentos públicos (tombados) na lixeira comum. |
| 3 | Dashboard gerencial e cálculo de volume | CINFRA | Fornece métricas de ocupação para substituir as rondas manuais improdutivas. |
| 4 | Alerta automático aos 80% de capacidade | CINFRA e Limpeza | Informa o momento exato de recolher, funcionalidade avaliada com nota máxima pelo setor. |

## 5. Fora do escopo

O que **não** faremos nesta versão, e por quê:

| Não faremos | Por quê |
|---|---|
| Gestão de descarte de bens patrimoniados | Existe um fluxo legal e burocrático apartado gerido por um servidor específico de patrimônio. |
| Aplicativo Mobile Nativo (Android/iOS) | Depender de aprovação em lojas de apps atrasaria a entrega da Semana 18. |

## 6. Usuários e papéis

| Papel | O que pode fazer |
|---|---|
| Descartador (Comunidade) | Acessar via QR Code, preencher o tipo de lixo, informar se é tombado e anexar foto. |
| Gestor (CINFRA) | Acessar métricas de volume, visualizar galeria de fotos de itens descartados e zerar o contador do coletor. |

## 7. Restrições

| Tipo | Restrição |
|---|---|
| Prazo | Semana 18 |
| Equipe | 4 pessoas, 8 h/semana no total |
| Técnica | TypeScript (NestJS + React), PostgreSQL, PaaS gratuita |
| Contexto de uso | Smartphones pessoais (4G/Wi-Fi) em frente à lixeira física do IFPE. |
| Orçamento | Zero |

## 8. Riscos principais

| Risco | O que faremos |
|---|---|
| Baixa adesão inicial ao QR Code | Campanha de conscientização e aviso grande na própria lixeira física. |
| Lentidão para anexar fotos no Wi-Fi do campus | Comprimir a imagem diretamente no frontend antes do envio para a API. |

## 9. Critérios de sucesso

| Objetivo | Como mediremos | Meta |
|---|---|---|
| Adoção do sistema | Comparar os registros no banco de dados com os itens físicos na lixeira | 70% dos itens descartados sendo registrados no sistema no 1º mês |
| Otimização de tempo da CINFRA | Entrevista de acompanhamento com o setor de infraestrutura | Redução das rondas manuais para verificação da lixeira a quase zero |

## 10. O que fica depois

- **Quem opera o sistema:** Setor de Infraestrutura/Manutenção (CINFRA) do IFPE Campus Palmares.
- **Quem mantém tecnicamente:** Equipe desenvolvedora (extensão de projeto) ou coordenação de ADS.
- **Custo mensal estimado:** Zero (banco e aplicação em PaaS gratuitas tipo Render/Supabase).
- **Licença do código:** MIT