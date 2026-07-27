-- ============================================
-- ProspectFlow - Script completo do banco de dados (PostgreSQL para Supabase)
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================

-- Função para atualizar "updatedAt" automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------
-- 1. Empresas (Configurações base da agência)
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
-- 2. Usuários (Acesso ao sistema)
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
-- 3. Campanhas / Listas de Prospecção
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ativa',
  "companyId" INT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("companyId") REFERENCES company(id) ON DELETE SET NULL
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 4. Templates de Mensagem (NOVO)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  "campaignId" INT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("campaignId") REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 5. Leads (Prospectos)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(50) NOT NULL,
  whatsapp BOOLEAN DEFAULT TRUE,
  categoria VARCHAR(100),
  site VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pendente',
  "ultimoContato" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- --------------------------------------------
-- 6. Leads por Campanha (Relação N:N e tracking)
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_leads (
  id SERIAL PRIMARY KEY,
  "campaignId" INT NOT NULL,
  "leadId" INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pendente',
  "ultima_interacao" TIMESTAMP,
  tentativas INT DEFAULT 0,
  observacoes TEXT,
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
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign ON campaign_leads("campaignId");
CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead ON campaign_leads("leadId");
