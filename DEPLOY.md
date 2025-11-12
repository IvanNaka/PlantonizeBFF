# Guia de Deploy - Plantonize BFF

Este documento contém instruções completas para fazer deploy do BFF em diferentes ambientes.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy Local (Desenvolvimento)](#deploy-local-desenvolvimento)
3. [Deploy com Docker](#deploy-com-docker)
4. [Deploy no Azure App Service](#deploy-no-azure-app-service)
5. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
6. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Ferramentas Necessárias

- **Node.js** 18+ (LTS recomendado)
- **npm** (vem com Node.js)
- **Docker** (para deploy containerizado)
- **Azure CLI** (para deploy no Azure)

### Verificar Instalação

```powershell
# Node.js
node --version  # deve retornar v18.x.x ou superior

# npm
npm --version

# Docker
docker --version

# Azure CLI
az --version
```

---

## Deploy Local (Desenvolvimento)

### 1. Instalar Dependências

```powershell
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do servidor (opcional, padrão: 3000)
PORT=3000

# URLs dos microserviços
MICRO_PLANTAO_URL=http://localhost:5219
MICRO_NF_URL=http://localhost:5113/api

# Azure Function para envio de e-mails (opcional)
FUNCTION_EMAIL_URL=https://sua-function.azurewebsites.net/api/enviar-email
```

### 3. Executar em Modo Desenvolvimento

```powershell
# Com hot-reload (nodemon)
npm run dev

# Ou modo produção local
npm start
```

### 4. Testar

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:3000/health

# Ou usando curl
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "service": "plantonize-bff"
}
```

---

## Deploy com Docker

### 1. Build da Imagem

```powershell
# Build local
docker build -t plantonize-bff:latest .

# Build com tag para Docker Hub (substitua SEU_USUARIO)
docker build -t SEU_USUARIO/plantonize-bff:latest .
```

### 2. Executar Container Localmente

```powershell
# Executar com variáveis de ambiente inline
docker run -d \
  -p 3000:3000 \
  -e MICRO_PLANTAO_URL=http://host.docker.internal:5219 \
  -e MICRO_NF_URL=http://host.docker.internal:5113/api \
  --name plantonize-bff \
  plantonize-bff:latest

# Ou usando arquivo .env
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name plantonize-bff \
  plantonize-bff:latest
```

> **💡 Dica**: Use `host.docker.internal` para acessar serviços rodando no host quando executar no Docker Desktop (Windows/Mac).

### 3. Verificar Logs

```powershell
docker logs plantonize-bff

# Ou acompanhar logs em tempo real
docker logs -f plantonize-bff
```

### 4. Parar e Remover Container

```powershell
docker stop plantonize-bff
docker rm plantonize-bff
```

### 5. Publicar no Docker Hub

```powershell
# Login no Docker Hub
docker login

# Push da imagem (substitua SEU_USUARIO)
docker push SEU_USUARIO/plantonize-bff:latest
```

---

## Deploy no Azure App Service

### Arquitetura Atual

- **App Service Plan**: `ASP-Plantonize-Linux` (Linux, Free tier)
- **Web App**: `plantonize-bff` (Container Linux)
- **Resource Group**: `Plantonize`
- **Registry**: Docker Hub (`ivannaka/plantonize-bff:latest`)

### Método 1: Via Docker Hub (Recomendado)

#### 1. Build e Push da Imagem

```powershell
# Build com tag do Docker Hub
docker build -t SEU_USUARIO/plantonize-bff:latest .

# Login no Docker Hub
docker login

# Push
docker push SEU_USUARIO/plantonize-bff:latest
```

#### 2. Login no Azure

```powershell
az login
```

#### 3. Criar/Atualizar Web App

**Primeira vez (criar infraestrutura)**:

```powershell
# Criar App Service Plan Linux (se não existir)
az appservice plan create \
  --name ASP-Plantonize-Linux \
  --resource-group Plantonize \
  --is-linux \
  --sku F1

# Criar Web App com container
az webapp create \
  --name plantonize-bff \
  --resource-group Plantonize \
  --plan ASP-Plantonize-Linux \
  --deployment-container-image-name docker.io/SEU_USUARIO/plantonize-bff:latest
```

**Atualizar imagem existente**:

```powershell
# Configurar nova imagem
az webapp config container set \
  --name plantonize-bff \
  --resource-group Plantonize \
  --container-image-name docker.io/SEU_USUARIO/plantonize-bff:latest \
  --container-registry-url https://index.docker.io

# Reiniciar para aplicar mudanças
az webapp restart \
  --name plantonize-bff \
  --resource-group Plantonize
```

#### 4. Configurar Variáveis de Ambiente

```powershell
az webapp config appsettings set \
  --name plantonize-bff \
  --resource-group Plantonize \
  --settings \
    MICRO_PLANTAO_URL="https://seu-microservico-plantao.azurewebsites.net" \
    MICRO_NF_URL="https://seu-microservico-nf.azurewebsites.net/api" \
    FUNCTION_EMAIL_URL="https://sua-function.azurewebsites.net/api/enviar-email"
```

#### 5. Verificar Deploy

```powershell
# Testar health check
Invoke-RestMethod -Uri https://plantonize-bff.azurewebsites.net/health

# Ver logs em tempo real
az webapp log tail \
  --name plantonize-bff \
  --resource-group Plantonize
```

### Método 2: Via Azure Container Registry (Alternativo)

> **⚠️ Nota**: Requer que o namespace `Microsoft.ContainerRegistry` esteja registrado na subscription.

```powershell
# Criar ACR
az acr create \
  --resource-group Plantonize \
  --name plantonizeacr \
  --sku Basic \
  --admin-enabled true

# Login no ACR
az acr login --name plantonizeacr

# Build e push (Azure faz o build remotamente)
az acr build \
  --registry plantonizeacr \
  --image plantonize-bff:latest \
  --file Dockerfile \
  .

# Configurar Web App para usar ACR
az webapp config container set \
  --name plantonize-bff \
  --resource-group Plantonize \
  --container-image-name plantonizeacr.azurecr.io/plantonize-bff:latest \
  --container-registry-url https://plantonizeacr.azurecr.io \
  --container-registry-user plantonizeacr \
  --container-registry-password $(az acr credential show --name plantonizeacr --query passwords[0].value -o tsv)
```

---

## Configuração de Variáveis de Ambiente

### Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor (Azure define automaticamente) | `8080` |

### Variáveis Opcionais (URLs dos Microserviços)

| Variável | Descrição | Padrão | Exemplo |
|----------|-----------|--------|---------|
| `MICRO_PLANTAO_URL` | URL do microserviço de Plantões | `http://localhost:5219` | `https://plantoes-api.azurewebsites.net` |
| `MICRO_NF_URL` | URL do microserviço de Notas Fiscais | `http://localhost:5113/api` | `https://notasfiscais-api.azurewebsites.net/api` |
| `FUNCTION_EMAIL_URL` | URL da Azure Function de e-mail | _(vazio)_ | `https://email-function.azurewebsites.net/api/enviar` |

### Como Definir no Azure

```powershell
# Adicionar/atualizar variáveis
az webapp config appsettings set \
  --name plantonize-bff \
  --resource-group Plantonize \
  --settings \
    VARIAVEL1="valor1" \
    VARIAVEL2="valor2"

# Listar variáveis configuradas
az webapp config appsettings list \
  --name plantonize-bff \
  --resource-group Plantonize \
  --output table

# Deletar variável
az webapp config appsettings delete \
  --name plantonize-bff \
  --resource-group Plantonize \
  --setting-names VARIAVEL1
```

---

## Troubleshooting

### Problema: Container não inicia no Azure

**Sintomas**: App retorna erro 503 ou timeout

**Soluções**:

1. **Verificar logs**:
```powershell
az webapp log tail --name plantonize-bff --resource-group Plantonize
```

2. **Habilitar logging de container**:
```powershell
az webapp log config \
  --name plantonize-bff \
  --resource-group Plantonize \
  --docker-container-logging filesystem
```

3. **Verificar se a porta está correta**: O app deve escutar em `process.env.PORT` (geralmente 8080 no Azure)

4. **Reiniciar o app**:
```powershell
az webapp restart --name plantonize-bff --resource-group Plantonize
```

### Problema: "Cannot find module 'express'"

**Causa**: `node_modules` não foi incluído ou instalado

**Solução**: Garantir que o Dockerfile está copiando e instalando dependências:

```dockerfile
# No Dockerfile, deve ter:
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production
```

### Problema: CORS errors no frontend

**Causa**: BFF não está configurado para aceitar requisições de determinada origem

**Solução**: O BFF já usa `cors()` middleware. Se precisar restringir origens:

```javascript
// src/index.js
app.use(cors({
  origin: ['https://seu-frontend.com', 'http://localhost:4200'],
  credentials: true
}));
```

### Problema: Timeout ao chamar microserviços

**Sintomas**: Erro `ECONNREFUSED` ou `timeout` nos logs

**Soluções**:

1. **Verificar URLs dos microserviços**:
```powershell
az webapp config appsettings list \
  --name plantonize-bff \
  --resource-group Plantonize \
  --query "[?name=='MICRO_PLANTAO_URL' || name=='MICRO_NF_URL']"
```

2. **Testar conectividade dos microserviços** (via console do Azure ou localmente)

3. **Ajustar timeout no código** se necessário (arquivo `src/services/*.service.js`):
```javascript
const api = axios.create({
  baseURL: env.MICRO_PLANTAO_URL,
  timeout: 15000, // aumentar para 15s se necessário
});
```

### Problema: App fica lento ou com out of memory

**Causa**: Free tier tem limitações de recursos (1GB RAM, CPU compartilhada)

**Soluções**:

1. **Upgrade do tier**:
```powershell
# Trocar para Basic tier (mais recursos)
az appservice plan update \
  --name ASP-Plantonize-Linux \
  --resource-group Plantonize \
  --sku B1
```

2. **Habilitar Application Insights** para monitorar performance

3. **Otimizar código** (cache, conexões HTTP keep-alive, etc.)

---

## Comandos Úteis

### Azure CLI

```powershell
# Ver detalhes do Web App
az webapp show \
  --name plantonize-bff \
  --resource-group Plantonize

# Ver URL pública
az webapp show \
  --name plantonize-bff \
  --resource-group Plantonize \
  --query defaultHostName \
  --output tsv

# Baixar logs
az webapp log download \
  --name plantonize-bff \
  --resource-group Plantonize \
  --log-file logs.zip

# Habilitar HTTPS obrigatório
az webapp update \
  --name plantonize-bff \
  --resource-group Plantonize \
  --https-only true

# Escalar verticalmente (mudar tier)
az appservice plan update \
  --name ASP-Plantonize-Linux \
  --resource-group Plantonize \
  --sku B1

# Escalar horizontalmente (adicionar instâncias)
az appservice plan update \
  --name ASP-Plantonize-Linux \
  --resource-group Plantonize \
  --number-of-workers 2
```

### Docker

```powershell
# Build otimizado (multi-stage)
docker build --no-cache -t plantonize-bff:latest .

# Ver logs de build
docker build -t plantonize-bff:latest . --progress=plain

# Entrar no container em execução
docker exec -it plantonize-bff sh

# Ver uso de recursos
docker stats plantonize-bff

# Remover imagens antigas
docker image prune -a
```

---

## Checklist de Deploy

### Antes do Deploy

- [ ] Código testado localmente
- [ ] Build do Docker funciona sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] URLs dos microserviços estão corretas
- [ ] `.env` não foi commitado (está no `.gitignore`)
- [ ] Imagem publicada no Docker Hub/ACR

### Durante o Deploy

- [ ] Build da imagem concluído
- [ ] Push para registry bem-sucedido
- [ ] Web App configurado com imagem correta
- [ ] Variáveis de ambiente configuradas no Azure
- [ ] App reiniciado para aplicar mudanças

### Após o Deploy

- [ ] Health check retorna status 200
- [ ] Logs não mostram erros críticos
- [ ] Endpoints principais funcionando
- [ ] HTTPS habilitado
- [ ] Monitoramento configurado (opcional)

---

## URLs de Produção

- **BFF**: https://plantonize-bff.azurewebsites.net
- **Health Check**: https://plantonize-bff.azurewebsites.net/health
- **Documentação das Rotas**: Ver `API_DOCUMENTATION_*.md`

---

## Suporte e Contribuição

Para reportar problemas ou sugerir melhorias:

1. Abra uma issue no repositório
2. Entre em contato com a equipe de DevOps
3. Consulte a documentação do Azure: https://docs.microsoft.com/azure/app-service/

---

**Última atualização**: Novembro 2025
