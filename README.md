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

1. Inicie o PostgreSQL pelo Docker, se ainda não estiver ativo:
   `docker run --name ecocampus-db -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=ecocampus -p 5432:5432 -d postgres`
2. Navegue até a pasta do backend: `cd Backend`
3. Instale as dependências: `npm install`
4. Configure as variáveis de conexão, se necessário. No PowerShell:
   ```powershell
   $env:DB_HOST="127.0.0.1"
   $env:DB_PORT="5432"
   $env:DB_USERNAME="postgres"
   $env:DB_PASSWORD="senha123"
   $env:DB_NAME="ecocampus"
   ```
5. Inicie o servidor: `npm run start:dev`

As migrations pendentes são executadas na inicialização. O backend usa UUIDs nos recursos e não habilita `synchronize`; alterações no esquema devem ser versionadas em migrations.

## Exemplos de Uso (Testando o CRUD via CLI)

Após iniciar o servidor, os recursos abaixo têm endpoints `POST`, `GET`, `GET /:id`, `PATCH /:id` e `DELETE /:id`:

- `http://localhost:3000/usuarios`
- `http://localhost:3000/objetos`
- `http://localhost:3000/api/coletor`
- `http://localhost:3000/descarte`

As listagens aceitam `page` e `limit` (máximo 100), além de filtros específicos por recurso. As respostas de listagem têm o formato `{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 } }`.

O cadastro de usuários valida e-mail, senha e função; as senhas são armazenadas com hash e não retornadas pela API. Um descarte exige UUIDs de usuário e coletor e atualiza o volume do coletor dentro da mesma transação. Itens de catálogo podem ser associados ao descarte por `itens: [{ "objetoId": "<uuid>", "quantidade": 1 }]`.

Exemplo para listar itens do catálogo:

```powershell
curl.exe "http://localhost:3000/objetos?page=1&limit=10&tipo=eletrônico"
```

O volume também pode ser ajustado pela rota `POST /api/coletor/:id/atualizar` com corpo `{ "volume": 1.5 }`; exceder a capacidade retorna `400`. `POST /api/coletor/:id/reset` zera o volume.

### Testes

Na pasta `Backend`:

- `npm test` executa os testes unitários.
- `npm run test:e2e` inicia a aplicação em uma porta aleatória e executa testes HTTP contra o PostgreSQL configurado em `DB_*`. O teste cria dados temporários e os remove ao final.
- `npm run lint` executa o ESLint nos fontes TypeScript.