# ?? Documentação da API - Plantonize.Plantao

## ?? Índice
- [Visão Geral](#visão-geral)
- [Base URL](#base-url)
- [Modelos de Dados](#modelos-de-dados)
- [Endpoints](#endpoints)
  - [Atendente](#atendente)
  - [Atendimento](#atendimento)
  - [Hospital](#hospital)
  - [Médico](#médico)
  - [Plantão](#plantão)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Exemplos de Requisição](#exemplos-de-requisição)

---

## ?? Visão Geral

A API Plantonize.Plantao é uma RESTful API desenvolvida em .NET 8 para gerenciamento de plantões médicos, permitindo o controle de médicos, hospitais, atendentes, plantões e atendimentos.

**Tecnologias:**
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- C# 12.0

---

## ?? Base URL

```
https://localhost:{porta}/api
```

---

## ?? Modelos de Dados

### EntidadeBase
Todas as entidades herdam desta classe base:

```json
{
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

### Atendente

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "João Silva",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospital": { },
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

**Campos:**
- `id` (Guid): Identificador único do atendente
- `nome` (string): Nome completo do atendente
- `email` (string): Email do atendente (único)
- `hospitalId` (Guid): ID do hospital onde o atendente trabalha
- `hospital` (Hospital): Objeto do hospital (navegação)

### Atendimento

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nomePaciente": "Maria Santos",
  "descricao": "Consulta de rotina",
  "plantao": { },
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

**Campos:**
- `id` (Guid): Identificador único do atendimento
- `plantaoId` (Guid): ID do plantão relacionado
- `nomePaciente` (string): Nome do paciente atendido
- `descricao` (string): Descrição do atendimento
- `plantao` (Plantao): Objeto do plantão (navegação)

### Hospital

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123",
  "plantoes": [],
  "atendentes": [],
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

**Campos:**
- `id` (Guid): Identificador único do hospital
- `nome` (string): Nome do hospital
- `municipio` (string): Município onde está localizado
- `endereco` (string): Endereço completo
- `plantoes` (List<Plantao>): Lista de plantões do hospital
- `atendentes` (List<Atendente>): Lista de atendentes do hospital

### Médico

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "plantoes": [],
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

**Campos:**
- `id` (Guid): Identificador único do médico
- `nome` (string): Nome completo do médico
- `crm` (string): Número do CRM (único)
- `especialidade` (string): Especialidade médica
- `email` (string): Email do médico (único)
- `plantoes` (List<Plantao>): Lista de plantões do médico

### Plantão

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Pendente",
  "medico": { },
  "hospital": { },
  "atendimentos": [],
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ultimaAtualizacao": "2024-01-15T14:20:00Z",
  "ativo": true
}
```

**Campos:**
- `id` (Guid): Identificador único do plantão
- `medicoId` (Guid): ID do médico responsável
- `hospitalId` (Guid): ID do hospital
- `dataInicio` (DateTime): Data de início do plantão
- `dataFinal` (DateTime): Data final do plantão
- `horaInicio` (TimeSpan): Hora de início
- `horaFinal` (TimeSpan): Hora final
- `tipoPlantao` (string): Tipo do plantão (Diurno, Noturno, etc.)
- `municipio` (string): Município do plantão
- `valor` (decimal): Valor do plantão
- `status` (string): Status atual (Pendente, Confirmado, Cancelado, etc.)
- `medico` (Medico): Objeto do médico (navegação)
- `hospital` (Hospital): Objeto do hospital (navegação)
- `atendimentos` (List<Atendimento>): Lista de atendimentos realizados

---

## ?? Endpoints

## Atendente

### ?? Listar Todos os Atendentes

```http
GET /api/Atendente
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "João Silva",
    "email": "joao.silva@hospital.com",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter atendentes

---

### ?? Obter Atendente por ID

```http
GET /api/Atendente/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendente

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "João Silva",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Atendente não encontrado
- `500 Internal Server Error`: Erro ao obter atendente

---

### ?? Obter Atendente por Email

```http
GET /api/Atendente/email/{email}
```

**Parâmetros:**
- `email` (string, obrigatório): Email do atendente

**Exemplo:**
```http
GET /api/Atendente/email/joao.silva@hospital.com
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "João Silva",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Atendente não encontrado
- `500 Internal Server Error`: Erro ao obter atendente por email

---

### ?? Obter Atendentes por Hospital

```http
GET /api/Atendente/hospital/{hospitalId}
```

**Parâmetros:**
- `hospitalId` (Guid, obrigatório): ID do hospital

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "João Silva",
    "email": "joao.silva@hospital.com",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter atendentes do hospital

---

### ? Criar Atendente

```http
POST /api/Atendente
```

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "João Silva",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Headers de Resposta:**
```
Location: /api/Atendente/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Respostas de Erro:**
- `400 Bad Request`: Dados inválidos ou email já cadastrado
- `500 Internal Server Error`: Erro ao criar atendente

---

### ?? Atualizar Atendente

```http
PUT /api/Atendente/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendente

**Body (JSON):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "João Silva Atualizado",
  "email": "joao.silva@hospital.com",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa7"
}
```

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `400 Bad Request`: ID não corresponde ou dados inválidos
- `404 Not Found`: Atendente não encontrado
- `500 Internal Server Error`: Erro ao atualizar atendente

---

### ??? Deletar Atendente

```http
DELETE /api/Atendente/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendente

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `404 Not Found`: Atendente não encontrado
- `500 Internal Server Error`: Erro ao deletar atendente

---

## Atendimento

### ?? Listar Todos os Atendimentos

```http
GET /api/Atendimento
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "nomePaciente": "Maria Santos",
    "descricao": "Consulta de rotina",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter atendimentos

---

### ?? Obter Atendimento por ID

```http
GET /api/Atendimento/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendimento

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nomePaciente": "Maria Santos",
  "descricao": "Consulta de rotina",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Atendimento não encontrado
- `500 Internal Server Error`: Erro ao obter atendimento

---

### ?? Obter Atendimentos por Plantão

```http
GET /api/Atendimento/plantao/{plantaoId}
```

**Parâmetros:**
- `plantaoId` (Guid, obrigatório): ID do plantão

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "nomePaciente": "Maria Santos",
    "descricao": "Consulta de rotina",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter atendimentos do plantão

---

### ?? Obter Atendimentos por Nome do Paciente

```http
GET /api/Atendimento/paciente/{nomePaciente}
```

**Parâmetros:**
- `nomePaciente` (string, obrigatório): Nome do paciente

**Exemplo:**
```http
GET /api/Atendimento/paciente/Maria Santos
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "nomePaciente": "Maria Santos",
    "descricao": "Consulta de rotina",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter atendimentos por nome do paciente

---

### ? Criar Atendimento

```http
POST /api/Atendimento
```

**Body (JSON):**
```json
{
  "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nomePaciente": "Maria Santos",
  "descricao": "Consulta de rotina"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nomePaciente": "Maria Santos",
  "descricao": "Consulta de rotina",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Headers de Resposta:**
```
Location: /api/Atendimento/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Respostas de Erro:**
- `400 Bad Request`: Dados inválidos
- `500 Internal Server Error`: Erro ao criar atendimento

---

### ?? Atualizar Atendimento

```http
PUT /api/Atendimento/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendimento

**Body (JSON):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "plantaoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nomePaciente": "Maria Santos",
  "descricao": "Consulta de rotina - Atualizada"
}
```

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `400 Bad Request`: ID não corresponde ou dados inválidos
- `404 Not Found`: Atendimento não encontrado
- `500 Internal Server Error`: Erro ao atualizar atendimento

---

### ??? Deletar Atendimento

```http
DELETE /api/Atendimento/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do atendimento

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `404 Not Found`: Atendimento não encontrado
- `500 Internal Server Error`: Erro ao deletar atendimento

---

## Hospital

### ?? Listar Todos os Hospitais

```http
GET /api/Hospital
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Hospital São Lucas",
    "municipio": "São Paulo",
    "endereco": "Rua das Flores, 123",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter hospitais

---

### ?? Obter Hospital por ID

```http
GET /api/Hospital/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do hospital

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Hospital não encontrado
- `500 Internal Server Error`: Erro ao obter hospital

---

### ??? Obter Hospital por Nome

```http
GET /api/Hospital/nome/{nome}
```

**Parâmetros:**
- `nome` (string, obrigatório): Nome do hospital

**Exemplo:**
```http
GET /api/Hospital/nome/Hospital São Lucas
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Hospital não encontrado
- `500 Internal Server Error`: Erro ao obter hospital por nome

---

### ?? Obter Hospitais por Município

```http
GET /api/Hospital/municipio/{municipio}
```

**Parâmetros:**
- `municipio` (string, obrigatório): Nome do município

**Exemplo:**
```http
GET /api/Hospital/municipio/São Paulo
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Hospital São Lucas",
    "municipio": "São Paulo",
    "endereco": "Rua das Flores, 123",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter hospitais por município

---

### ? Criar Hospital

```http
POST /api/Hospital
```

**Body (JSON):**
```json
{
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Headers de Resposta:**
```
Location: /api/Hospital/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Respostas de Erro:**
- `400 Bad Request`: Dados inválidos
- `500 Internal Server Error`: Erro ao criar hospital

---

### ?? Atualizar Hospital

```http
PUT /api/Hospital/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do hospital

**Body (JSON):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas Atualizado",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123"
}
```

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `400 Bad Request`: ID não corresponde ou dados inválidos
- `404 Not Found`: Hospital não encontrado
- `500 Internal Server Error`: Erro ao atualizar hospital

---

### ??? Deletar Hospital

```http
DELETE /api/Hospital/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do hospital

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `404 Not Found`: Hospital não encontrado
- `500 Internal Server Error`: Erro ao deletar hospital

---

## Médico

### ?? Listar Todos os Médicos

```http
GET /api/Medico
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Dr. Carlos Oliveira",
    "crm": "12345-SP",
    "especialidade": "Cardiologia",
    "email": "carlos.oliveira@email.com",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter médicos

---

### ?? Obter Médico por ID

```http
GET /api/Medico/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do médico

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Médico não encontrado
- `500 Internal Server Error`: Erro ao obter médico

---

### ?? Obter Médico por CRM

```http
GET /api/Medico/crm/{crm}
```

**Parâmetros:**
- `crm` (string, obrigatório): Número do CRM

**Exemplo:**
```http
GET /api/Medico/crm/12345-SP
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Médico não encontrado
- `500 Internal Server Error`: Erro ao obter médico por CRM

---

### ?? Obter Médico por Email

```http
GET /api/Medico/email/{email}
```

**Parâmetros:**
- `email` (string, obrigatório): Email do médico

**Exemplo:**
```http
GET /api/Medico/email/carlos.oliveira@email.com
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Médico não encontrado
- `500 Internal Server Error`: Erro ao obter médico por email

---

### ?? Obter Médicos por Especialidade

```http
GET /api/Medico/especialidade/{especialidade}
```

**Parâmetros:**
- `especialidade` (string, obrigatório): Especialidade médica

**Exemplo:**
```http
GET /api/Medico/especialidade/Cardiologia
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "nome": "Dr. Carlos Oliveira",
    "crm": "12345-SP",
    "especialidade": "Cardiologia",
    "email": "carlos.oliveira@email.com",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter médicos por especialidade

---

### ? Criar Médico

```http
POST /api/Medico
```

**Body (JSON):**
```json
{
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Headers de Resposta:**
```
Location: /api/Medico/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Respostas de Erro:**
- `400 Bad Request`: Dados inválidos
- `409 Conflict`: CRM ou email já cadastrado
- `500 Internal Server Error`: Erro ao criar médico

---

### ?? Atualizar Médico

```http
PUT /api/Medico/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do médico

**Body (JSON):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Dr. Carlos Oliveira Atualizado",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com"
}
```

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `400 Bad Request`: ID não corresponde ou dados inválidos
- `404 Not Found`: Médico não encontrado
- `500 Internal Server Error`: Erro ao atualizar médico

---

### ??? Deletar Médico

```http
DELETE /api/Medico/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do médico

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `404 Not Found`: Médico não encontrado
- `500 Internal Server Error`: Erro ao deletar médico

---

## Plantão

### ?? Listar Todos os Plantões

```http
GET /api/Plantao
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões

---

### ?? Obter Plantão por ID

```http
GET /api/Plantao/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do plantão

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Pendente",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Respostas de Erro:**
- `404 Not Found`: Plantão não encontrado
- `500 Internal Server Error`: Erro ao obter plantão

---

### ????? Obter Plantões por Médico

```http
GET /api/Plantao/medico/{medicoId}
```

**Parâmetros:**
- `medicoId` (Guid, obrigatório): ID do médico

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões do médico

---

### ?? Obter Plantões por Hospital

```http
GET /api/Plantao/hospital/{hospitalId}
```

**Parâmetros:**
- `hospitalId` (Guid, obrigatório): ID do hospital

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões do hospital

---

### ?? Obter Plantões por Município

```http
GET /api/Plantao/municipio/{municipio}
```

**Parâmetros:**
- `municipio` (string, obrigatório): Nome do município

**Exemplo:**
```http
GET /api/Plantao/municipio/São Paulo
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões por município

---

### ?? Obter Plantões por Status

```http
GET /api/Plantao/status/{status}
```

**Parâmetros:**
- `status` (string, obrigatório): Status do plantão (Pendente, Confirmado, Cancelado, etc.)

**Exemplo:**
```http
GET /api/Plantao/status/Pendente
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões por status

---

### ?? Obter Plantões por Período

```http
GET /api/Plantao/periodo?dataInicio={dataInicio}&dataFinal={dataFinal}
```

**Parâmetros (Query String):**
- `dataInicio` (DateTime, obrigatório): Data inicial do período
- `dataFinal` (DateTime, obrigatório): Data final do período

**Exemplo:**
```http
GET /api/Plantao/periodo?dataInicio=2024-01-01T00:00:00Z&dataFinal=2024-01-31T23:59:59Z
```

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

**Respostas de Erro:**
- `500 Internal Server Error`: Erro ao obter plantões por período

---

### ? Criar Plantão

```http
POST /api/Plantao
```

**Body (JSON):**
```json
{
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Pendente"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Pendente",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

**Headers de Resposta:**
```
Location: /api/Plantao/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

**Respostas de Erro:**
- `400 Bad Request`: Dados inválidos
- `500 Internal Server Error`: Erro ao criar plantão

---

### ?? Atualizar Plantão

```http
PUT /api/Plantao/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do plantão

**Body (JSON):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Confirmado"
}
```

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `400 Bad Request`: ID não corresponde ou dados inválidos
- `404 Not Found`: Plantão não encontrado
- `500 Internal Server Error`: Erro ao atualizar plantão

---

### ??? Deletar Plantão

```http
DELETE /api/Plantao/{id}
```

**Parâmetros:**
- `id` (Guid, obrigatório): ID do plantão

**Resposta de Sucesso (204 No Content)**

**Respostas de Erro:**
- `404 Not Found`: Plantão não encontrado
- `500 Internal Server Error`: Erro ao deletar plantão

---

## ?? Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 OK | Requisição bem-sucedida |
| 201 Created | Recurso criado com sucesso |
| 204 No Content | Requisição bem-sucedida sem conteúdo de retorno |
| 400 Bad Request | Dados inválidos na requisição |
| 404 Not Found | Recurso não encontrado |
| 409 Conflict | Conflito de dados (ex: email ou CRM duplicado) |
| 500 Internal Server Error | Erro interno do servidor |

---

## ?? Exemplos de Requisição

### Exemplo 1: Criar um Hospital

**Requisição:**
```bash
curl -X POST "https://localhost:5001/api/Hospital" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Hospital São Lucas",
    "municipio": "São Paulo",
    "endereco": "Rua das Flores, 123"
  }'
```

**Resposta:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "nome": "Hospital São Lucas",
  "municipio": "São Paulo",
  "endereco": "Rua das Flores, 123",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

---

### Exemplo 2: Criar um Médico

**Requisição:**
```bash
curl -X POST "https://localhost:5001/api/Medico" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Carlos Oliveira",
    "crm": "12345-SP",
    "especialidade": "Cardiologia",
    "email": "carlos.oliveira@email.com"
  }'
```

**Resposta:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "nome": "Dr. Carlos Oliveira",
  "crm": "12345-SP",
  "especialidade": "Cardiologia",
  "email": "carlos.oliveira@email.com",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

---

### Exemplo 3: Criar um Plantão

**Requisição:**
```bash
curl -X POST "https://localhost:5001/api/Plantao" \
  -H "Content-Type: application/json" \
  -d '{
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente"
  }'
```

**Resposta:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
  "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "dataInicio": "2024-01-20T00:00:00Z",
  "dataFinal": "2024-01-20T00:00:00Z",
  "horaInicio": "08:00:00",
  "horaFinal": "18:00:00",
  "tipoPlantao": "Diurno",
  "municipio": "São Paulo",
  "valor": 1500.00,
  "status": "Pendente",
  "dataCriacao": "2024-01-15T10:30:00Z",
  "ativo": true
}
```

---

### Exemplo 4: Buscar Plantões por Período

**Requisição:**
```bash
curl -X GET "https://localhost:5001/api/Plantao/periodo?dataInicio=2024-01-01T00:00:00Z&dataFinal=2024-01-31T23:59:59Z" \
  -H "Accept: application/json"
```

**Resposta:**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Pendente",
    "dataCriacao": "2024-01-15T10:30:00Z",
    "ativo": true
  }
]
```

---

### Exemplo 5: Atualizar Status do Plantão

**Requisição:**
```bash
curl -X PUT "https://localhost:5001/api/Plantao/3fa85f64-5717-4562-b3fc-2c963f66afa8" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    "medicoId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    "hospitalId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "dataInicio": "2024-01-20T00:00:00Z",
    "dataFinal": "2024-01-20T00:00:00Z",
    "horaInicio": "08:00:00",
    "horaFinal": "18:00:00",
    "tipoPlantao": "Diurno",
    "municipio": "São Paulo",
    "valor": 1500.00,
    "status": "Confirmado"
  }'
```

**Resposta:** `204 No Content`

---

## ?? Notas Importantes

1. **Autenticação**: Esta documentação não inclui autenticação. Em produção, é recomendado implementar JWT ou OAuth2.

2. **Soft Delete**: A operação DELETE marca o registro como inativo (Ativo = false) ao invés de excluir fisicamente.

3. **Timestamps**: Todas as entidades possuem `DataCriacao` e `UltimaAtualizacao` gerenciados automaticamente.

4. **GUIDs**: Todos os IDs são do tipo Guid (UUID).

5. **Validação**: Os endpoints validam os dados recebidos e retornam mensagens de erro apropriadas.

6. **Relacionamentos**: Os objetos de navegação (Hospital, Medico, etc.) podem ser incluídos nas respostas dependendo da configuração do EF Core.

7. **TimeSpan**: O formato para `horaInicio` e `horaFinal` é `HH:mm:ss` (ex: "08:00:00").

8. **DateTime**: As datas seguem o formato ISO 8601 (ex: "2024-01-20T00:00:00Z").

---

## ??? Ferramentas Recomendadas

- **Postman**: Para testar os endpoints
- **Swagger/OpenAPI**: Para documentação interativa (pode ser habilitado no projeto)
- **cURL**: Para requisições via linha de comando

---

## ?? Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Versão:** 1.0  
**Última Atualização:** Janeiro 2024  
**Desenvolvido com:** .NET 8.0 & ASP.NET Core
