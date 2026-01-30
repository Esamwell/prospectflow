# ProspectFlow 🚀

Automação de Prospecção via WhatsApp para Negócios

---

## Sobre o Projeto

O **ProspectFlow** é um sistema completo para automação de prospecção de clientes via WhatsApp, focado em negócios locais e agências. Com ele, você pode buscar leads no Google Meu Negócio, gerenciar campanhas, enviar mensagens automáticas, acompanhar resultados e muito mais — tudo em um painel moderno, multiusuário e fácil de usar!

---

## Funcionalidades Principais ✨

- 🔍 **Scraping de Leads**: Busque leads diretamente do Google Maps/Meu Negócio usando Puppeteer, com barra de progresso animada durante a coleta.
- 📲 **Envio Automático de Mensagens**: Integração com WhatsApp via whatsapp-web.js para disparo e follow-up automático.
- 🖼️ **Envio e Recebimento de Mídias**: Suporte a envio e recebimento de imagens e áudios (incluindo gravação de áudio pelo navegador, se suportado).
- 📊 **Dashboard em Tempo Real**: Visualize métricas de leads, campanhas, taxa de resposta, atividades recentes e muito mais.
- 🗂️ **Gestão de Leads, Campanhas e Mensagens**: CRUD completo, busca global e filtros inteligentes.
- 👥 **Multiusuário & Permissões**: Controle de acesso, autenticação JWT, painel de usuários e configurações.
- 🤖 **Follow-up Inteligente**: Sequência automática de mensagens, interrompendo ao receber resposta.
- 🔐 **Autenticação Segura**: Login, logout, proteção de rotas e tratamento de sessão expirada.
- 🛠️ **Multi-sessão WhatsApp**: Gerencie várias conexões, QR Code, status em tempo real e reconexão automática.
- ⚙️ **Configurações do Usuário**: Edite nome, e-mail e senha facilmente.
- 🖌️ **Layout Moderno**: Interface inspirada no Materio, responsiva, com experiência de usuário aprimorada.
- 📥 **Importação de Leads via CSV**: Baixe o modelo, preencha e importe facilmente.

---

## Tecnologias Utilizadas 🛠️

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, Sequelize, MySQL, whatsapp-web.js, Puppeteer

---

## Como rodar o projeto localmente

```sh
# Clone o repositório
 git clone https://github.com/Esamwell/prospectflow.git

# Acesse a pasta do projeto
 cd prospectflow

# Instale as dependências do backend e frontend
 cd backend && npm install
 cd ../ && npm install

# Inicie o backend
 cd backend && npm run dev

# Em outro terminal, inicie o frontend
 npm run dev
```

---

## Deploy único na Vercel (frontend + API)

O projeto está configurado para **um único deploy** na Vercel: frontend (Vite) e API (Express) no mesmo domínio.

1. **Conecte o repositório** na Vercel e faça o deploy (raiz do repo = este projeto).

2. **Não defina `VITE_API_URL`** — em produção a API fica no mesmo domínio (`/api/*`).

3. **Configure as variáveis de ambiente do backend** no painel da Vercel (**Settings** → **Environment Variables**), com as mesmas do `backend/.env`:
   - `DB_HOST` — host do Supabase (ex: `db.xxx.supabase.co`)
   - `DB_USER` — `postgres`
   - `DB_PASSWORD` — senha do banco no Supabase
   - `DB_NAME` — `postgres`
   - `DB_PORT` — `5432`
   - `JWT_SECRET` — segredo para tokens JWT
   - Opcional (se usar em outros serviços): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

4. **Faça o deploy** — a Vercel faz o build do frontend (Vite) e expõe a API em `/api/*` via serverless.

**Limitações na Vercel (serverless):**
- **WhatsApp**: conexões persistentes e QR Code podem ter restrições (timeout, cold start). Para uso intenso, considere um worker separado.
- **Follow-up automático**: o agendador que roda a cada minuto não fica ativo (não há processo contínuo). Follow-ups podem ser disparados por cron externo ou em outra plataforma.
- **Scraping (Puppeteer)**: pode atingir limite de tamanho ou tempo; para muitos acessos, avalie um serviço dedicado.

---

## Contribua com o ProspectFlow! 🤝

Este projeto é open source e está em constante evolução. Sinta-se à vontade para abrir issues, enviar pull requests ou sugerir melhorias. Sua colaboração é muito bem-vinda!

**Vamos juntos transformar a prospecção digital!**

---

Feito com 💙 por [esamwel | Agência SA2 Marketing](https://github.com/Esamwell)

> Venha colaborar, sugerir ideias e construir o futuro do ProspectFlow com a gente!
