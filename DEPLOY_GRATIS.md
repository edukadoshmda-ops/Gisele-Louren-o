# Deploy 100% Gratuito: Vercel (ou Netlify) + Supabase + Asaas

Este projeto já está estruturado para rodar gratuitamente na nuvem sem precisar pagar servidor!

## Passo 1: Criar o Banco e Storage Grátis no Supabase
1. Acesse **https://supabase.com** e crie um projeto gratuito.
2. No menu lateral, clique em **SQL Editor** > **New Query**.
3. Cole todo o conteúdo do arquivo `supabase/schema.sql` e clique em **Run**.
4. Vá em **Project Settings > API** e copie:
   - `Project URL` (`SUPABASE_URL`)
   - `service_role` key (`SUPABASE_SERVICE_ROLE_KEY`)

## Passo 2: Subir o Site Grátis na Vercel (Recomendado) ou Netlify

### Opção A — Vercel
1. Suba esta pasta para um repositório no **GitHub** (pode ser privado).
2. Acesse **https://vercel.com**, clique em **Add New Project** e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` = `clube-media`
   - `ADMIN_EMAIL` = seu e-mail de administrador (ex: `admin@giselelourenco.com.br`)
   - `ADMIN_PASSWORD` = uma senha forte para o painel admin
   - `SESSION_SECRET` = qualquer frase longa aleatória
   - `ASAAS_ENVIRONMENT` = `sandbox` (ou `production`)
   - `ASAAS_API_KEY` = sua chave `$aact_...` do Asaas
   - `ASAAS_WEBHOOK_TOKEN` = um segredo (ex: `segredo_webhook_gisele_daviliz_2026`)
4. Clique em **Deploy**. Pronto!

### Opção B — Netlify
1. O arquivo `netlify.toml` e `netlify/functions/api.js` já estão prontos.
2. Importe o repositório no **https://app.netlify.com**, configure as mesmas **Environment Variables** acima e faça o deploy.

## Passo 3: Configurar o Webhook Automático no Asaas
1. No painel do **Asaas** (`Configurações > Integrações > Webhooks`), adicione a URL do seu site publicado:
   - `https://SEU-DOMINIO.vercel.app/api/asaas/webhook`
2. No campo **Token de Autenticação**, coloque o mesmo valor de `ASAAS_WEBHOOK_TOKEN`.
3. Marque os eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE` e `SUBSCRIPTION_INACTIVATED`.

## Contas de Teste (Local)
- **Admin:** `admin@giselelourenco.com.br` / senha padrão `Gisele@2026` (altere em produção via `.env`!)
- **Assinante Demo:** `anapaula.familia@email.com` / senha `clube2026`
