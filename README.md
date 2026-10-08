# EcoCampusIFPE

Sistema web para registrar, acompanhar e gerar métricas sobre o descarte de lixo eletrônico no campus do IFPE.

## Visão geral

O EcoCampusIFPE é uma plataforma focada em otimizar a gestão de resíduos eletrônicos (insumos). Através de um Web App acessado via QR Code anexado ao coletor físico do campus, alunos e servidores podem registrar os itens descartados na hora. 

A ideia central é substituir as rondas manuais improdutivas por um monitoramento inteligente de volume, gerar dados institucionais de reciclagem e criar uma vitrine virtual para que a comunidade Maker reaproveite peças úteis antes da destinação final.

## Objetivo

Facilitar o registro de resíduos eletrônicos, evitar o descarte de itens perigosos ou patrimoniados na lixeira comum, e fornecer alertas automatizados de capacidade para a Coordenadoria de Infraestrutura (CINFRA).

## Público-alvo
O sistema atende a toda a comunidade do IFPE (alunos e servidores), bem como visitantes e público externo durante eventos no campus. Além de viabilizar o descarte correto de resíduos eletrônicos, a plataforma permite que componentes funcionais sejam mapeados e reaproveitados em novos projetos acadêmicos, de inovação e cultura maker.

## Equipe

- Eliabe Rafael
- Erik Jerônimo
- Joseildo dos Santos
- Luis Felipe

## Funcionalidades principais

- Triagem rápida de itens eletrônicos via QR Code com opção de anexo de foto.
- Bloqueio informativo para impedir o descarte irregular de equipamentos tombados (patrimônio).
- Dashboard gerencial para a CINFRA monitorar o volume acumulado do coletor.
- Alerta automático disparado quando a lixeira atinge 80% de sua capacidade.
- Galeria de itens descartados para visualização e resgate pela comunidade de projetos do campus.

## Stack sugerida

- Backend: NestJS + TypeScript
- Frontend: React + TypeScript + Vite
- Banco de dados: PostgreSQL
- Hospedagem: PaaS gratuita

## Como rodar o projeto localmente

1. Navegue até a pasta do backend: `cd Backend`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run start:dev`

## Exemplos de Uso (Testando o CRUD via CLI)

Após iniciar o servidor, você pode testar as rotas em um novo terminal:

**Listar todos os Usuários:**
> curl -X GET http://localhost:3000/usuarios

**Listar todos os Descartes registrados:**
> curl -X GET http://localhost:3000/descarte

**Listar todas as Coletas agendadas/realizadas:**
> curl -X GET http://localhost:3000/coleta

**Listar Objetos (Catálogo Maker):**
> curl -X GET http://localhost:3000/objetos

**Criar um novo coletor:**
> curl -X POST http://localhost:3000/api/coletor

**Zerar o volume do coletor (Reset):**
> curl -X POST http://localhost:3000/api/coletor/1/reset