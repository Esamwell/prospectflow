# ProspectFlow

Sistema web de automação de prospecção via WhatsApp, com scraping de leads do Google Meu Negócio, envio de mensagens automáticas, painel de gestão e multiusuário.

## Funcionalidades

- **Scraping de Leads**: Coleta automática de leads do Google Meu Negócio (Google Maps) usando Puppeteer.
- **Envio Automático de Mensagens**: Disparo de mensagens em massa e follow-ups automáticos via WhatsApp, com integração Baileys.
- **Gestão de Leads**: Cadastro, visualização, busca e segmentação de leads.
- **Gestão de Campanhas**: Criação, edição e acompanhamento de campanhas de prospecção.
- **Dashboard Gerencial**: Visualização de métricas em tempo real (leads, mensagens, taxa de resposta, leads quentes, campanhas, atividades recentes).
- **Multiusuário**: Controle de usuários, permissões e autenticação JWT.
- **Multi-sessão WhatsApp**: Gerenciamento de múltiplas conexões/sessões WhatsApp (criar, listar, conectar via QR Code, remover).
- **Busca Global**: Pesquisa unificada em leads, campanhas, usuários e mensagens.
- **Configurações de Usuário**: Edição de perfil, senha e dados pessoais.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, Sequelize, MySQL
- **Scraping:** Puppeteer
- **WhatsApp:** @whiskeysockets/baileys

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/Esamwell/wa-lead-magnet-system.git
   cd wa-lead-magnet-system-main
   ```
2. Instale as dependências do backend:
   ```sh
   cd backend
   npm install
   ```
3. Instale as dependências do frontend:
   ```sh
   cd ../
   npm install
   ```
4. Configure o banco de dados MySQL e o arquivo `.env` no backend.
5. Inicie o backend:
   ```sh
   cd backend
   npm start
   ```
6. Inicie o frontend:
   ```sh
   npm run dev
   ```

## Como usar

- Acesse o sistema via navegador em `http://localhost:5173` (ou porta configurada).
- Faça login com seu usuário.
- Utilize o menu lateral para acessar Leads, Campanhas, Mensagens, Dashboard, Scraping, Sessões WhatsApp e Configurações.
- Para scraping, acesse a página de Scraping, defina os parâmetros e inicie a coleta de leads.
- Gerencie campanhas, leads e mensagens pelo painel.

## Sobre o Projeto

O ProspectFlow foi desenvolvido para automatizar a prospecção comercial via WhatsApp, facilitando a geração e o acompanhamento de leads, campanhas e resultados em um único painel intuitivo e moderno.

---

Desenvolvido por Esamwell
