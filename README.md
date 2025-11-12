# Plantonize - BFF

Este repositório contém o Backend-for-Frontend (BFF) para o projeto Plantonize.

O BFF atua como gateway entre o frontend Angular, dois microserviços (Plantões e Notas Fiscais) e uma Azure Function responsável por envio de e-mails.

## 📋 Principais responsabilidades

- Proxy/CRUD para microserviços
- Agregação de dados de múltiplas fontes para o frontend
- Chamada HTTP para Azure Function de envio de e-mail

## 🚀 Deploy

**Para instruções completas de deploy, consulte [DEPLOY.md](./DEPLOY.md)**

O guia de deploy inclui:
- Deploy local para desenvolvimento
- Deploy com Docker
- Deploy no Azure App Service (Linux container)
- Configuração de variáveis de ambiente
- Troubleshooting comum

## 🌐 Produção

- **URL**: https://plantonize-bff.azurewebsites.net
- **Health Check**: https://plantonize-bff.azurewebsites.net/health
- **Registry**: Docker Hub (`ivannaka/plantonize-bff:latest`)

## 💻 Como rodar localmente

### 1. Instalar dependências

```powershell
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MICRO_PLANTAO_URL=http://localhost:5219
MICRO_NF_URL=http://localhost:5113/api
FUNCTION_EMAIL_URL=https://sua-function.azurewebsites.net/api/enviar-email
```

### 3. Rodar em modo de desenvolvimento

```powershell
npm run dev
```

### 4. Testar

```powershell
# Health check
curl http://localhost:3000/health

# Ou no PowerShell
Invoke-RestMethod -Uri http://localhost:3000/health
```

## 🐳 Docker

```powershell
# Build
docker build -t plantonize-bff:latest .

# Run
docker run -p 3000:3000 --env-file .env plantonize-bff:latest
```

## 📚 Documentação das APIs

- **Plantões**: [API_DOCUMENTATION_PLANTAO.md](./API_DOCUMENTATION_PLANTAO.md)
- **Notas Fiscais**: [API_DOCUMENTATION_NF.md](./API_DOCUMENTATION_NF.md)

### Swagger (em desenvolvimento)

Depois de instalar as dependências, a documentação interativa estará disponível em:

```
GET /api-docs
```

Se preferir o JSON da especificação OpenAPI:

```
GET /src/swagger.json
```

> **Nota**: Em ambientes de produção com instalação mínima de dependências, a rota de documentação só será ativada se a dependência `swagger-ui-express` estiver instalada.

## 🛠️ Tecnologias

- **Node.js** 18+ (LTS)
- **Express** - Framework web
- **Axios** - Cliente HTTP
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
bff/
├── src/
│   ├── config/          # Configurações (variáveis de ambiente)
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços para comunicação com microserviços
│   └── index.js         # Entry point
├── Dockerfile           # Container build
├── .dockerignore        # Arquivos ignorados no build Docker
├── package.json         # Dependências e scripts
└── DEPLOY.md           # Guia completo de deploy
```

## 🔧 Scripts Disponíveis

```powershell
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `MICRO_PLANTAO_URL` | URL do microserviço de Plantões | `http://localhost:5219` |
| `MICRO_NF_URL` | URL do microserviço de Notas Fiscais | `http://localhost:5113/api` |
| `FUNCTION_EMAIL_URL` | URL da Azure Function de e-mail | _(vazio)_ |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

---

**Desenvolvido para o projeto Plantonize** 🏥
