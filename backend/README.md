# Backend - ProspectFlow

Este backend foi criado em Node.js + Express, com banco de dados PostgreSQL e Sequelize ORM.

## Estrutura de Pastas

- src/
  - controllers/
  - models/
  - routes/
  - services/
  - config/
  - app.js
- package.json
- .env

## Banco de dados (Supabase / PostgreSQL)

O projeto está configurado para usar **Supabase** como banco PostgreSQL.

### Configurar a senha do banco (Supabase)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) e abra o projeto.
2. Vá em **Project Settings** (ícone de engrenagem) → **Database**.
3. Em **Connection string** > **URI**, copie a senha ou use **Reset database password** se precisar definir uma nova.
4. Coloque a senha no `.env` em `DB_PASSWORD=`.

### Criar as tabelas no Supabase

1. No Supabase Dashboard, abra **SQL Editor**.
2. Copie todo o conteúdo do arquivo `database.sql` (a partir da função `update_updated_at` e das tabelas; ignore o comentário de `CREATE DATABASE`).
3. Cole no editor e execute (**Run**).

O Supabase já cria o banco `postgres`; não é necessário criar outro banco. Depois disso o backend conecta normalmente.

### Variáveis de ambiente (`.env`)

- `DB_HOST`, `DB_USER`, `DB_NAME`, `DB_PORT` — já configurados para o projeto Supabase.
- `DB_PASSWORD` — senha do banco (obtida no passo acima).
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — para uso no frontend ou em serviços que usem a API do Supabase.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` com as credenciais do banco de dados.
3. Rode o backend:
   ```bash
   npm start
   ``` 