# EcoCampusIFPE

Sistema web para registrar, acompanhar e gerar métricas sobre o descarte de lixo eletrônico no campus do IFPE.

## Visão geral

O EcoCampusIFPE é uma plataforma focada em otimizar a gestão de resíduos eletrônicos (insumos). Através de um Web App acessado via QR Code anexado ao coletor físico do campus, alunos e servidores podem registrar os itens descartados na hora. 

A ideia central é substituir as rondas manuais improdutivas por um monitoramento inteligente de volume, gerar dados institucionais de reciclagem e criar uma vitrine virtual para que a comunidade Maker reaproveite peças úteis antes da destinação final.

## Objetivo

Facilitar o registro de resíduos eletrônicos, evitar o descarte de itens perigosos ou patrimoniados na lixeira comum, e fornecer alertas automatizados de capacidade para a Coordenadoria de Infraestrutura (CINFRA).

## Equipe

- Eliabe Rafael
- Erik Jeronimo
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

## Estrutura do repositório

```text
EcoCampusIFPE/
├── README.md
├── .gitignore
├── docs/
│   ├── canva.md
│   └── roadmap.md
├── backend/
│   └── README.md
├── frontend/
│   └── README.md
└── .github/
    └── workflows/