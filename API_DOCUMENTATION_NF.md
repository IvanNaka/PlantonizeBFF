# Plantonize NotasFiscais API Documentation

## Base Information

**Base URL:** `https://localhost:{port}/api`  
**API Version:** v1  
**Authentication:** Bearer Token (JWT) via Azure AD  
**Content-Type:** `application/json`

---

## Authentication

All endpoints require authentication using JWT Bearer tokens.

### Headers Required
```http
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

### Authentication Flow
1. Authenticate with Azure AD to obtain a JWT token
2. Include the token in the `Authorization` header for all requests
3. Token is configured in `appsettings.json` under `AzureAd` section

---

## 1. Notas Fiscais Endpoints

Base path: `/api/notasfiscais`

### 1.1 Get All Notas Fiscais

Retrieves all notas fiscais in the system.

**Endpoint:** `GET /api/notasfiscais`

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "numeroNota": "NF-2025-001",
    "dataEmissao": "2025-01-15T10:30:00Z",
    "valorTotal": 5000.00,
    "status": "Emitida",
    "municipioPrestacao": "3550308",
    "issRetido": false,
    "medico": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "nome": "Dr. João Silva",
      "cpf": "123.456.789-00",
      "inscricaoMunicipal": "12345678",
      "email": "joao.silva@email.com"
    },
    "tomador": {
      "razaoSocial": "Hospital São Lucas",
      "cnpj": "12.345.678/0001-90",
      "endereco": "Rua das Flores, 123",
      "municipio": "São Paulo",
      "uf": "SP"
    },
    "servicos": [
      {
        "descricao": "Consulta médica",
        "quantidade": 10,
        "valorUnitario": 500.00,
        "valorTotal": 5000.00
      }
    ],
    "enviadoEmail": true,
    "dataEnvioEmail": "2025-01-15T11:00:00Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 1.2 Get Nota Fiscal by ID

Retrieves a specific nota fiscal by its ID.

**Endpoint:** `GET /api/notasfiscais/{id}`

**Path Parameters:**
- `id` (UUID, required): The nota fiscal ID

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numeroNota": "NF-2025-001",
  "dataEmissao": "2025-01-15T10:30:00Z",
  "valorTotal": 5000.00,
  "status": "Emitida",
  "municipioPrestacao": "3550308",
  "issRetido": false,
  "medico": { /* ... */ },
  "tomador": { /* ... */ },
  "servicos": [ /* ... */ ],
  "enviadoEmail": true,
  "dataEnvioEmail": "2025-01-15T11:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Nota fiscal not found
- `500 Internal Server Error`: Server error

---

### 1.3 Get Notas Fiscais by Medico

Retrieves all notas fiscais for a specific medico.

**Endpoint:** `GET /api/notasfiscais/medico/{medicoId}`

**Path Parameters:**
- `medicoId` (UUID, required): The medico ID

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "numeroNota": "NF-2025-001",
    /* ... full nota fiscal object ... */
  }
]
```

**Error Responses:**
- `400 Bad Request`: Invalid medico ID
- `500 Internal Server Error`: Server error

---

### 1.4 Create Nota Fiscal

Creates a new nota fiscal.

**Endpoint:** `POST /api/notasfiscais`

**Request Body:**
```json
{
  "numeroNota": "NF-2025-001",
  "valorTotal": 5000.00,
  "status": "Emitida",
  "municipioPrestacao": "3550308",
  "issRetido": false,
  "medico": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Dr. João Silva",
    "cpf": "123.456.789-00",
    "inscricaoMunicipal": "12345678",
    "email": "joao.silva@email.com",
    "telefone": "(11) 98765-4321"
  },
  "tomador": {
    "razaoSocial": "Hospital São Lucas",
    "cnpj": "12.345.678/0001-90",
    "inscricaoMunicipal": "87654321",
    "endereco": "Rua das Flores, 123",
    "numero": "123",
    "complemento": "Sala 101",
    "bairro": "Centro",
    "municipio": "São Paulo",
    "uf": "SP",
    "cep": "01234-567",
    "email": "contato@hospital.com",
    "telefone": "(11) 3456-7890"
  },
  "servicos": [
    {
      "descricao": "Consulta médica especializada",
      "quantidade": 10,
      "valorUnitario": 500.00,
      "valorTotal": 5000.00,
      "aliquotaISS": 5.0
    }
  ]
}
```

**Response: 201 Created**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numeroNota": "NF-2025-001",
  "dataEmissao": "2025-01-15T10:30:00Z",
  /* ... complete nota fiscal object ... */
}
```

**Validation Rules:**
- `valorTotal` must be greater than zero
- `medico` is required
- `tomador` is required
- `servicos` must contain at least one service

**Error Responses:**
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

---

### 1.5 Update Nota Fiscal

Updates an existing nota fiscal.

**Endpoint:** `PUT /api/notasfiscais/{id}`

**Path Parameters:**
- `id` (UUID, required): The nota fiscal ID

**Request Body:** Same as Create (section 1.4)

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  /* ... updated nota fiscal object ... */
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch or validation error
- `404 Not Found`: Nota fiscal not found
- `500 Internal Server Error`: Server error

---

### 1.6 Delete Nota Fiscal

Deletes a nota fiscal.

**Endpoint:** `DELETE /api/notasfiscais/{id}`

**Path Parameters:**
- `id` (UUID, required): The nota fiscal ID

**Response: 204 No Content**

**Error Responses:**
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Nota fiscal not found
- `500 Internal Server Error`: Server error

---

### 1.7 Check Nota Fiscal Exists

Checks if a nota fiscal exists.

**Endpoint:** `GET /api/notasfiscais/{id}/exists`

**Path Parameters:**
- `id` (UUID, required): The nota fiscal ID

**Response: 200 OK**
```json
true
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

## 2. Faturas Endpoints

Base path: `/api/faturas`

### 2.1 Get All Faturas

Retrieves all faturas in the system.

**Endpoint:** `GET /api/faturas`

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "numeroFatura": "FAT-2025-001",
    "dataEmissao": "2025-01-15T10:00:00Z",
    "dataVencimento": "2025-02-15T23:59:59Z",
    "valorTotal": 15000.00,
    "status": "Pendente",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medico": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "nome": "Dr. João Silva",
      "cpf": "123.456.789-00"
    },
    "notasFiscais": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "numeroNota": "NF-2025-001",
        "valorTotal": 5000.00
      }
    ],
    "dataPagamento": null,
    "observacoes": "Fatura referente a consultas de janeiro"
  }
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 2.2 Get Fatura by ID

Retrieves a specific fatura by its ID.

**Endpoint:** `GET /api/faturas/{id}`

**Path Parameters:**
- `id` (UUID, required): The fatura ID

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numeroFatura": "FAT-2025-001",
  "dataEmissao": "2025-01-15T10:00:00Z",
  "dataVencimento": "2025-02-15T23:59:59Z",
  "valorTotal": 15000.00,
  "status": "Pendente",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medico": { /* ... */ },
  "notasFiscais": [ /* ... */ ],
  "dataPagamento": null,
  "observacoes": "Fatura referente a consultas de janeiro"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Fatura not found
- `500 Internal Server Error`: Server error

---

### 2.3 Get Faturas by Medico

Retrieves all faturas for a specific medico.

**Endpoint:** `GET /api/faturas/medico/{medicoId}`

**Path Parameters:**
- `medicoId` (UUID, required): The medico ID

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "numeroFatura": "FAT-2025-001",
    /* ... full fatura object ... */
  }
]
```

**Error Responses:**
- `400 Bad Request`: Invalid medico ID
- `500 Internal Server Error`: Server error

---

### 2.4 Create Fatura

Creates a new fatura.

**Endpoint:** `POST /api/faturas`

**Request Body:**
```json
{
  "numeroFatura": "FAT-2025-001",
  "dataVencimento": "2025-02-15T23:59:59Z",
  "valorTotal": 15000.00,
  "status": "Pendente",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "observacoes": "Fatura referente a consultas de janeiro"
}
```

**Response: 201 Created**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "numeroFatura": "FAT-2025-001",
  "dataEmissao": "2025-01-15T10:00:00Z",
  "dataVencimento": "2025-02-15T23:59:59Z",
  "valorTotal": 15000.00,
  "status": "Pendente",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "dataPagamento": null,
  "observacoes": "Fatura referente a consultas de janeiro"
}
```

**Validation Rules:**
- `medicoId` is required
- `valorTotal` cannot be negative
- `dataVencimento` cannot be before `dataEmissao`
- If `status` is "Paga", `dataPagamento` is required

**Status Values:**
- `Pendente`: Awaiting payment
- `Paga`: Paid
- `Cancelada`: Cancelled
- `Vencida`: Overdue

**Error Responses:**
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Server error

---

### 2.5 Update Fatura

Updates an existing fatura.

**Endpoint:** `PUT /api/faturas/{id}`

**Path Parameters:**
- `id` (UUID, required): The fatura ID

**Request Body:** Same as Create (section 2.4)

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  /* ... updated fatura object ... */
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch or validation error
- `404 Not Found`: Fatura not found
- `500 Internal Server Error`: Server error

---

### 2.6 Delete Fatura

Deletes a fatura.

**Endpoint:** `DELETE /api/faturas/{id}`

**Path Parameters:**
- `id` (UUID, required): The fatura ID

**Response: 204 No Content**

**Error Responses:**
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Fatura not found
- `500 Internal Server Error`: Server error

---

### 2.7 Check Fatura Exists

Checks if a fatura exists.

**Endpoint:** `GET /api/faturas/{id}/exists`

**Path Parameters:**
- `id` (UUID, required): The fatura ID

**Response: 200 OK**
```json
true
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 2.8 Calculate Fatura Total Value

Calculates the total value of a fatura based on its associated notas fiscais.

**Endpoint:** `GET /api/faturas/{id}/total`

**Path Parameters:**
- `id` (UUID, required): The fatura ID

**Response: 200 OK**
```json
15000.00
```

**Error Responses:**
- `404 Not Found`: Fatura not found
- `500 Internal Server Error`: Server error

---

## 3. Municipios Aliquota Endpoints

Base path: `/api/municipiosaliquota`

### 3.1 Get All Municipios Aliquota

Retrieves all municipios with their tax rates.

**Endpoint:** `GET /api/municipiosaliquota`

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "codigoMunicipio": "3550308",
    "nomeMunicipio": "São Paulo",
    "uf": "SP",
    "aliquotaISS": 5.0,
    "aliquotaIRPJ": 4.8,
    "aliquotaCSLL": 2.88,
    "aliquotaPIS": 0.65,
    "aliquotaCOFINS": 3.0,
    "aliquotaINSS": 11.0,
    "dataAtualizacao": "2025-01-15T10:00:00Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 3.2 Get Municipio Aliquota by ID

Retrieves a specific municipio aliquota by its ID.

**Endpoint:** `GET /api/municipiosaliquota/{id}`

**Path Parameters:**
- `id` (UUID, required): The municipio aliquota ID

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "codigoMunicipio": "3550308",
  "nomeMunicipio": "São Paulo",
  "uf": "SP",
  "aliquotaISS": 5.0,
  "aliquotaIRPJ": 4.8,
  "aliquotaCSLL": 2.88,
  "aliquotaPIS": 0.65,
  "aliquotaCOFINS": 3.0,
  "aliquotaINSS": 11.0,
  "dataAtualizacao": "2025-01-15T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Municipio aliquota not found
- `500 Internal Server Error`: Server error

---

### 3.3 Get Municipio Aliquota by Codigo

Retrieves a municipio aliquota by its IBGE code.

**Endpoint:** `GET /api/municipiosaliquota/codigo/{codigoMunicipio}`

**Path Parameters:**
- `codigoMunicipio` (string, required): The IBGE municipio code (e.g., "3550308")

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "codigoMunicipio": "3550308",
  "nomeMunicipio": "São Paulo",
  "uf": "SP",
  "aliquotaISS": 5.0,
  "aliquotaIRPJ": 4.8,
  "aliquotaCSLL": 2.88,
  "aliquotaPIS": 0.65,
  "aliquotaCOFINS": 3.0,
  "aliquotaINSS": 11.0,
  "dataAtualizacao": "2025-01-15T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid codigo municipio
- `404 Not Found`: Municipio not found
- `500 Internal Server Error`: Server error

---

### 3.4 Create Municipio Aliquota

Creates a new municipio aliquota.

**Endpoint:** `POST /api/municipiosaliquota`

**Request Body:**
```json
{
  "codigoMunicipio": "3550308",
  "nomeMunicipio": "São Paulo",
  "uf": "SP",
  "aliquotaISS": 5.0,
  "aliquotaIRPJ": 4.8,
  "aliquotaCSLL": 2.88,
  "aliquotaPIS": 0.65,
  "aliquotaCOFINS": 3.0,
  "aliquotaINSS": 11.0
}
```

**Response: 201 Created**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "codigoMunicipio": "3550308",
  "nomeMunicipio": "São Paulo",
  "uf": "SP",
  "aliquotaISS": 5.0,
  "aliquotaIRPJ": 4.8,
  "aliquotaCSLL": 2.88,
  "aliquotaPIS": 0.65,
  "aliquotaCOFINS": 3.0,
  "aliquotaINSS": 11.0,
  "dataAtualizacao": "2025-01-15T10:00:00Z"
}
```

**Validation Rules:**
- `codigoMunicipio` is required and must be unique
- `nomeMunicipio` is required
- `uf` is required (2 characters)
- All aliquota values must be between 0 and 100

**Tax Types:**
- **ISS** (Imposto Sobre Serviços): Service tax
- **IRPJ** (Imposto de Renda Pessoa Jurídica): Corporate income tax
- **CSLL** (Contribuição Social sobre o Lucro Líquido): Social contribution on net profit
- **PIS** (Programa de Integração Social): Social integration program
- **COFINS** (Contribuição para Financiamento da Seguridade Social): Social security financing contribution
- **INSS** (Instituto Nacional do Seguro Social): Social security

**Error Responses:**
- `400 Bad Request`: Validation error
- `409 Conflict`: Codigo municipio already exists
- `500 Internal Server Error`: Server error

---

### 3.5 Update Municipio Aliquota

Updates an existing municipio aliquota.

**Endpoint:** `PUT /api/municipiosaliquota/{id}`

**Path Parameters:**
- `id` (UUID, required): The municipio aliquota ID

**Request Body:** Same as Create (section 3.4)

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  /* ... updated municipio aliquota object ... */
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch or validation error
- `404 Not Found`: Municipio aliquota not found
- `409 Conflict`: Codigo municipio already exists
- `500 Internal Server Error`: Server error

---

### 3.6 Delete Municipio Aliquota

Deletes a municipio aliquota.

**Endpoint:** `DELETE /api/municipiosaliquota/{id}`

**Path Parameters:**
- `id` (UUID, required): The municipio aliquota ID

**Response: 204 No Content**

**Error Responses:**
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Municipio aliquota not found
- `500 Internal Server Error`: Server error

---

### 3.7 Check Municipio Aliquota Exists by ID

Checks if a municipio aliquota exists by ID.

**Endpoint:** `GET /api/municipiosaliquota/{id}/exists`

**Path Parameters:**
- `id` (UUID, required): The municipio aliquota ID

**Response: 200 OK**
```json
true
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 3.8 Check Municipio Aliquota Exists by Codigo

Checks if a municipio aliquota exists by codigo.

**Endpoint:** `GET /api/municipiosaliquota/codigo/{codigoMunicipio}/exists`

**Path Parameters:**
- `codigoMunicipio` (string, required): The IBGE municipio code

**Response: 200 OK**
```json
true
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

## 4. Impostos Resumo Endpoints

Base path: `/api/impostosresumo`

### 4.1 Get All Impostos Resumo

Retrieves all tax summaries in the system.

**Endpoint:** `GET /api/impostosresumo`

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mes": 1,
    "ano": 2025,
    "totalReceitaBruta": 50000.00,
    "totalISS": 2500.00,
    "totalIRPJ": 2400.00,
    "totalCSLL": 1440.00,
    "totalPIS": 325.00,
    "totalCOFINS": 1500.00,
    "totalINSS": 5500.00,
    "totalImpostos": 13665.00,
    "receitaLiquida": 36335.00,
    "quantidadeNotas": 10,
    "dataCalculo": "2025-02-01T10:00:00Z"
  }
]
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 4.2 Get Imposto Resumo by ID

Retrieves a specific tax summary by its ID.

**Endpoint:** `GET /api/impostosresumo/{id}`

**Path Parameters:**
- `id` (UUID, required): The imposto resumo ID

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mes": 1,
  "ano": 2025,
  "totalReceitaBruta": 50000.00,
  "totalISS": 2500.00,
  "totalIRPJ": 2400.00,
  "totalCSLL": 1440.00,
  "totalPIS": 325.00,
  "totalCOFINS": 1500.00,
  "totalINSS": 5500.00,
  "totalImpostos": 13665.00,
  "receitaLiquida": 36335.00,
  "quantidadeNotas": 10,
  "dataCalculo": "2025-02-01T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid ID format
- `404 Not Found`: Imposto resumo not found
- `500 Internal Server Error`: Server error

---

### 4.3 Get Impostos Resumo by Medico

Retrieves all tax summaries for a specific medico.

**Endpoint:** `GET /api/impostosresumo/medico/{medicoId}`

**Path Parameters:**
- `medicoId` (UUID, required): The medico ID

**Response: 200 OK**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "mes": 1,
    "ano": 2025,
    /* ... full imposto resumo object ... */
  }
]
```

**Error Responses:**
- `400 Bad Request`: Invalid medico ID
- `500 Internal Server Error`: Server error

---

### 4.4 Get Imposto Resumo by Medico and Period

Retrieves a tax summary for a specific medico and time period.

**Endpoint:** `GET /api/impostosresumo/medico/{medicoId}/periodo`

**Path Parameters:**
- `medicoId` (UUID, required): The medico ID

**Query Parameters:**
- `mes` (integer, required): Month (1-12)
- `ano` (integer, required): Year (2000-current year + 1)

**Example Request:**
```http
GET /api/impostosresumo/medico/3fa85f64-5717-4562-b3fc-2c963f66afa6/periodo?mes=1&ano=2025
```

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mes": 1,
  "ano": 2025,
  "totalReceitaBruta": 50000.00,
  "totalISS": 2500.00,
  "totalIRPJ": 2400.00,
  "totalCSLL": 1440.00,
  "totalPIS": 325.00,
  "totalCOFINS": 1500.00,
  "totalINSS": 5500.00,
  "totalImpostos": 13665.00,
  "receitaLiquida": 36335.00,
  "quantidadeNotas": 10,
  "dataCalculo": "2025-02-01T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resumo not found for specified period
- `500 Internal Server Error`: Server error

---

### 4.5 Create Imposto Resumo

Creates a new tax summary manually.

**Endpoint:** `POST /api/impostosresumo`

**Request Body:**
```json
{
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mes": 1,
  "ano": 2025,
  "totalReceitaBruta": 50000.00,
  "totalISS": 2500.00,
  "totalIRPJ": 2400.00,
  "totalCSLL": 1440.00,
  "totalPIS": 325.00,
  "totalCOFINS": 1500.00,
  "totalINSS": 5500.00,
  "totalImpostos": 13665.00,
  "receitaLiquida": 36335.00,
  "quantidadeNotas": 10
}
```

**Response: 201 Created**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mes": 1,
  "ano": 2025,
  "totalReceitaBruta": 50000.00,
  "totalISS": 2500.00,
  "totalIRPJ": 2400.00,
  "totalCSLL": 1440.00,
  "totalPIS": 325.00,
  "totalCOFINS": 1500.00,
  "totalINSS": 5500.00,
  "totalImpostos": 13665.00,
  "receitaLiquida": 36335.00,
  "quantidadeNotas": 10,
  "dataCalculo": "2025-02-01T10:00:00Z"
}
```

**Validation Rules:**
- `medicoId` is required
- `mes` must be between 1 and 12
- `ano` must be between 2000 and current year + 1
- `totalReceitaBruta` cannot be negative
- `quantidadeNotas` cannot be negative
- Resumo for the same medico/mes/ano combination cannot already exist

**Error Responses:**
- `400 Bad Request`: Validation error
- `409 Conflict`: Resumo already exists for this period
- `500 Internal Server Error`: Server error

---

### 4.6 Update Imposto Resumo

Updates an existing tax summary.

**Endpoint:** `PUT /api/impostosresumo/{id}`

**Path Parameters:**
- `id` (UUID, required): The imposto resumo ID

**Request Body:** Same as Create (section 4.5)

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  /* ... updated imposto resumo object ... */
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch or validation error
- `404 Not Found`: Imposto resumo not found
- `500 Internal Server Error`: Server error

---

### 4.7 Delete Imposto Resumo

Deletes a tax summary.

**Endpoint:** `DELETE /api/impostosresumo/{id}`

**Path Parameters:**
- `id` (UUID, required): The imposto resumo ID

**Response: 204 No Content**

**Error Responses:**
- `400 Bad Request`: Invalid ID
- `404 Not Found`: Imposto resumo not found
- `500 Internal Server Error`: Server error

---

### 4.8 Check Imposto Resumo Exists

Checks if a tax summary exists.

**Endpoint:** `GET /api/impostosresumo/{id}/exists`

**Path Parameters:**
- `id` (UUID, required): The imposto resumo ID

**Response: 200 OK**
```json
true
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

### 4.9 Calculate Tax Summary (Auto-Calculate) ?

**This is the most powerful endpoint** - Automatically calculates and saves tax summaries based on notas fiscais.

**Endpoint:** `POST /api/impostosresumo/calcular`

**Query Parameters:**
- `medicoId` (UUID, required): The medico ID
- `mes` (integer, required): Month (1-12)
- `ano` (integer, required): Year

**Example Request:**
```http
POST /api/impostosresumo/calcular?medicoId=3fa85f64-5717-4562-b3fc-2c963f66afa6&mes=1&ano=2025
```

**Response: 200 OK**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "mes": 1,
  "ano": 2025,
  "totalReceitaBruta": 50000.00,
  "totalISS": 2500.00,
  "totalIRPJ": 2400.00,
  "totalCSLL": 1440.00,
  "totalPIS": 325.00,
  "totalCOFINS": 1500.00,
  "totalINSS": 5500.00,
  "totalImpostos": 13665.00,
  "receitaLiquida": 36335.00,
  "quantidadeNotas": 10,
  "dataCalculo": "2025-02-01T10:00:00Z"
}
```

**What This Endpoint Does:**

1. **Finds all notas fiscais** for the specified medico in the given month/year
2. **Retrieves aliquota rates** for each municipio from the notas fiscais
3. **Calculates taxes automatically:**
   - ISS: `valorTotal × (aliquotaISS / 100)`
   - IRPJ: `valorTotal × (aliquotaIRPJ / 100)`
   - CSLL: `valorTotal × (aliquotaCSLL / 100)`
   - PIS: `valorTotal × (aliquotaPIS / 100)`
   - COFINS: `valorTotal × (aliquotaCOFINS / 100)`
   - INSS: `valorTotal × (aliquotaINSS / 100)`
4. **Aggregates totals** across all notas
5. **Calculates net revenue:** `receitaLiquida = totalReceitaBruta - totalImpostos`
6. **Saves or updates** the resumo (if already exists for the period, it updates it)

**Use Cases:**
- Monthly tax calculation for accountants
- Automated tax reporting
- Financial planning and analysis
- Compliance reporting

**Error Responses:**
- `400 Bad Request`: Invalid parameters or no notas fiscais found for the period
- `500 Internal Server Error`: Server error

**Example Calculation:**

If a medico has 10 notas fiscais in January 2025, each worth R$ 5,000:
```
Total Revenue: 10 × R$ 5,000 = R$ 50,000

Taxes (example rates for São Paulo):
- ISS (5%):     R$ 2,500
- IRPJ (4.8%):  R$ 2,400
- CSLL (2.88%): R$ 1,440
- PIS (0.65%):  R$ 325
- COFINS (3%):  R$ 1,500
- INSS (11%):   R$ 5,500

Total Taxes: R$ 13,665
Net Revenue: R$ 50,000 - R$ 13,665 = R$ 36,335
```

---

## Error Response Format

All error responses follow a consistent format:

### 400 Bad Request
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation error message here"
}
```

### 404 Not Found
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "Resource with ID {id} not found"
}
```

### 409 Conflict
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.8",
  "title": "Conflict",
  "status": 409,
  "detail": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
  "title": "Internal Server Error",
  "status": 500,
  "detail": "Error retrieving data"
}
```

---

## Common HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 OK | Success | Successful GET, PUT requests |
| 201 Created | Resource created | Successful POST requests |
| 204 No Content | Success with no response body | Successful DELETE requests |
| 400 Bad Request | Invalid input | Validation errors, malformed requests |
| 401 Unauthorized | Authentication required | Missing or invalid JWT token |
| 404 Not Found | Resource not found | Requested resource doesn't exist |
| 409 Conflict | Resource conflict | Duplicate entries, business rule violations |
| 500 Internal Server Error | Server error | Unexpected server errors |

---

## Testing with Swagger

The API includes Swagger UI for interactive testing (available in development mode):

**Access Swagger UI:**
```
https://localhost:{port}/swagger
```

**Features:**
- Interactive API documentation
- Try out endpoints directly from the browser
- View request/response schemas
- See example responses

**Note:** You'll need to authenticate first:
1. Obtain a JWT token from Azure AD
2. Click "Authorize" button in Swagger UI
3. Enter: `Bearer {your_token}`
4. Now you can test all endpoints

---

## Rate Limiting

Currently, there are no rate limits enforced. Consider implementing rate limiting for production use.

---

## Versioning

Current version: **v1** (implicit in base URL)

Future versions may use path-based versioning:
- `/api/v1/notasfiscais`
- `/api/v2/notasfiscais`

---

## Best Practices

### 1. Always Use HTTPS
In production, always use HTTPS to encrypt data in transit.

### 2. Handle Errors Gracefully
Check HTTP status codes and handle errors appropriately in your client application.

### 3. Use Appropriate HTTP Methods
- **GET**: Retrieve data (idempotent, no side effects)
- **POST**: Create new resources
- **PUT**: Update existing resources (complete replacement)
- **DELETE**: Remove resources

### 4. Include Request IDs
For debugging, include a unique request ID in headers:
```http
X-Request-ID: unique-id-here
```

### 5. Pagination (Future Enhancement)
For endpoints returning large datasets, consider implementing pagination:
```http
GET /api/notasfiscais?page=1&pageSize=20
```

---

## Support and Contact

For API support, please contact:
- **Technical Support:** [support@plantonize.com]
- **Documentation Issues:** [docs@plantonize.com]

---

## Changelog

### Version 1.0.0 (2025-01-15)
- Initial API release
- Complete CRUD operations for all entities
- Tax calculation functionality
- Azure AD authentication integration

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
