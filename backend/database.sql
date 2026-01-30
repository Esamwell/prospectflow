-- ============================================
-- ProspectFlow - Script completo do banco de dados (PostgreSQL)
-- Execute este arquivo para recriar o banco do zero
-- ============================================

-- Cria o banco (execute conectado em 'postgres' ou outro DB existente)
-- CREATE DATABASE prospectflow;

-- Conecte no banco prospectflow antes de rodar o restante (\c prospectflow no psql)

-- Função para atualizar "updatedAt" automaticamente (equivalente ao ON UPDATE do MySQL)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- 1. Empresas/Perfis de empresa (sem dependências)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS company (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  area_atuacao VARCHAR(255),
  produtos_servicos TEXT,
  diferenciais TEXT,
  tom_voz VARCHAR(255),
  representante VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER company_updated_at
  BEFORE UPDATE ON company
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 2. Usuários
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 3. Leads
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(50) NOT NULL,
  whatsapp BOOLEAN DEFAULT FALSE,
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(50),
  categoria VARCHAR(100),
  site VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pendente',
  foto VARCHAR(255),
  "ultimoContato" TIMESTAMP,
  respostas INT DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 4. Campanhas (depende de company)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ativa',
  "sessionId" VARCHAR(255),
  "companyId" INT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("companyId") REFERENCES company(id) ON DELETE SET NULL
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 5. Mensagens (depende de leads e campaigns)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  "leadId" INT NOT NULL,
  "campaignId" INT,
  conteudo TEXT NOT NULL,
  enviada BOOLEAN DEFAULT FALSE,
  resposta TEXT,
  "dataEnvio" TIMESTAMP,
  "sessionId" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("leadId") REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE SET NULL
);

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 6. Follow-ups (depende de campaigns)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS followups (
  id SERIAL PRIMARY KEY,
  "campaignId" INT NOT NULL,
  ordem INT NOT NULL,
  conteudo TEXT NOT NULL,
  "delayDias" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TRIGGER followups_updated_at
  BEFORE UPDATE ON followups
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 7. Leads por campanha (depende de campaigns e leads)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_leads (
  id SERIAL PRIMARY KEY,
  "campaignId" INT NOT NULL,
  "leadId" INT NOT NULL,
  status VARCHAR(50) DEFAULT 'novo',
  "ultima_interacao" TIMESTAMP,
  tentativas INT DEFAULT 0,
  resposta TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY ("leadId") REFERENCES leads(id) ON DELETE CASCADE,
  UNIQUE ("campaignId", "leadId")
);

CREATE TRIGGER campaign_leads_updated_at
  BEFORE UPDATE ON campaign_leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- Índices úteis para consultas
-- --------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_messages_leadId ON messages("leadId");
CREATE INDEX IF NOT EXISTS idx_messages_campaignId ON messages("campaignId");
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign ON campaign_leads("campaignId");
CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead ON campaign_leads("leadId");
