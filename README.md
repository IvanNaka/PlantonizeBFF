# Plantonize - BFF

Este repositório contém o Backend-for-Frontend (BFF) para o projeto Plantonize.

O BFF atua como gateway entre o frontend Angular, dois microserviços (Plantões e Notas Fiscais) e uma Azure Function responsável por envio de e-mails.

Principais responsabilidades:
- Proxy/CRUD para microserviços
- Agregação de dados de múltiplas fontes para o frontend
- Chamada HTTP para Azure Function de envio de e-mail

Como rodar localmente

1. Instale dependências

```powershell
cd bff
npm install
```

2. Rodar em modo de desenvolvimento

```powershell
npm run dev
```

Endpoint principal de agregação

GET /api/agregacao/dashboard

Notas
- Use o arquivo `.env` (fornecido) para configurar as URLs dos microserviços e da Azure Function.
- O código está pronto para deploy em Azure App Service (ajustar variáveis de ambiente no portal).

Documentação (Swagger)

Depois de instalar as dependências, a documentação interativa estará disponível em:

```
GET /api-docs
```

Se preferir o JSON da especificação OpenAPI:

```
GET /src/swagger.json
```

Observação: em ambientes de produção com instalação mínima de dependências, a rota de documentação só será ativada se a dependência `swagger-ui-express` estiver instalada.
