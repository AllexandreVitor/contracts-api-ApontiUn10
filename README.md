# Contratos API — DevOps

## Visão geral

Projeto acadêmico de infraestrutura DevOps desenvolvido a partir de uma API de contratos fornecida para a atividade.

A solução mantém a aplicação original e implementa recursos de containerização, automação, segurança, entrega contínua e observabilidade.

## Arquitetura

A infraestrutura local é executada com Docker Compose, utilizando os seguintes serviços:

| Serviço | Responsabilidade |
|---|---|
| API | Aplicação Node.js |
| PostgreSQL | Banco de dados relacional |
| Redis | Armazenamento em memória |
| Prometheus | Coleta e persistência de métricas |
| Grafana | Visualização de métricas |

O pipeline de CI/CD é executado pelo GitHub Actions e publica a imagem da aplicação no Docker Hub.

## Tecnologias

- Docker e Docker Compose
- PostgreSQL e Redis
- GitHub Actions
- Docker Hub
- Gitleaks
- Semgrep
- ESLint
- Trivy
- Prometheus
- Grafana

## Estrutura

```text
.
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus.yml
│   │   └── alerts.yml
│   └── grafana/
│       └── provisioning/
│           └── datasources/
│               └── prometheus.yml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Execução local
### Pré-requisitos
- Git
- Docker
- Docker Compose

### Configuração
Clone o repositório:
```bash
git clone https://github.com/AllexandreVitor/contracts-api-ApontiUn10.git
cd <NOME_DO_REPOSITORIO>
```
Crie o arquivo de ambiente a partir do modelo:
```bash
cp .env.example .env
```
No Windows PowerShell:
```bash
Copy-Item .env.example .env
```
Configure as variáveis necessárias no .env, incluindo as credenciais do banco de dados e a senha administrativa do Grafana.

### Inicialização
Construa a imagem e inicie os serviços:
```bash
docker compose up -d --build
```
Verifique o estado dos containers:
```bash
docker compose ps
```
Consulte os logs:
```bash
docker compose logs -f
```
Para encerrar os serviços:
```bash
docker compose down
```
Os volumes persistentes são mantidos ao utilizar docker compose down.

## Acesso aos serviços

| Serviço | Endereço |
|---|---|
| API | http://localhost:3000 |
| Métricas da API | http://localhost:3000/metrics |
| Prometheus | http://localhost:9090 |
| Prometheus Targets | http://localhost:9090/targets |
| Grafana | http://localhost:3001 |

O Grafana utiliza o usuário *admin*. A senha é definida pela variável **GRAFANA_ADMIN_PASSWORD**.

## Monitoramento e alertas

O Prometheus coleta as métricas da API a cada 15 segundos por meio do endpoint ```/metrics```.

A configuração está em ```monitoring/prometheus/prometheus.yml```.

O Grafana utiliza o Prometheus como datasource e disponibiliza um dashboard para acompanhamento das métricas.

Foi configurado o alerta ```ContratosApiDown```, que identifica a indisponibilidade da API quando a coleta de métricas falha por mais de um minuto.

A regra foi testada interrompendo temporariamente o container da API e confirmando o disparo do alerta.

Os dados do Prometheus e Grafana são armazenados em volumes Docker.

## CI/CD

O pipeline está definido em ```.github/workflows/ci-cd.yml``` e é executado em eventos de push e pull request para a branch ```main```.

As etapas incluem:
1. Gitleaks — detecção de segredos.
2. Semgrep — análise estática de segurança.
3. ESLint — verificação de qualidade do código.
4. Validação da configuração Docker Compose.
5. Build da imagem Docker.
6. Trivy — análise de vulnerabilidades da imagem.
7. Login no Docker Hub.
8. Publicação automatizada da imagem.

A publicação ocorre em push para a branch ```main```. Pull requests executam as verificações, mas não publicam imagens.

A autenticação no Docker Hub utiliza os GitHub Secrets:
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN

As credenciais não são armazenadas diretamente no workflow.

## Imagem Docker

A imagem da aplicação é publicada automaticamente no Docker Hub:

allexandrevitor/contratos-api-aponti-un10

São publicadas as tags latest e a identificação do commit que originou a imagem, permitindo rastreabilidade das versões.

## Justificativa arquitetural

A solução utiliza Docker para padronizar o ambiente de execução e Docker Compose para simplificar a orquestração dos serviços.

A imagem da API utiliza multi-stage build, dependências de produção e usuário não privilegiado, reduzindo a superfície de ataque do container.

PostgreSQL e Redis permanecem acessíveis pela rede interna do Docker, sem exposição direta de suas portas ao host.

Volumes persistentes preservam os dados dos serviços durante a recriação dos containers.

Prometheus e Grafana fornecem observabilidade, enquanto o alerta de disponibilidade auxilia na identificação de falhas.

O GitHub Actions automatiza as verificações de qualidade e segurança, a construção da imagem e sua publicação no Docker Hub, reduzindo tarefas manuais e tornando o processo de entrega reproduzível.

A arquitetura permite evolução futura para implantação em servidor remoto ou plataformas de orquestração, conforme a necessidade.

## Escopo atual e melhorias futuras

O projeto contempla integração contínua, análise de segurança, construção e publicação automatizada da imagem Docker, além de monitoramento da aplicação.

A implantação automática em servidor remoto ainda não faz parte do escopo implementado.

Como evoluções futuras, podem ser consideradas:
- Deploy automatizado em VPS ou ambiente de nuvem.
- HTTPS e proxy reverso.
- Centralização de logs.
- Testes automatizados da API.
- Orquestração com Kubernetes.
- Provisionamento de infraestrutura com Terraform.

