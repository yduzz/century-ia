# Guia de Deploy no Vercel - CENTURY.IA

## 📋 Pré-requisitos

- Uma conta no GitHub (você precisa fazer push do projeto para lá)
- Uma conta no Vercel (gratuita)
- Git instalado localmente

## 🚀 Passos para Deploy

### 1. **Fazer login/criar conta no GitHub**
   - Acesse [github.com](https://github.com)
   - Crie uma conta se não tiver uma
   - Gere um Personal Access Token (PAT) se preferir usar HTTPS

### 2. **Criar repositório no GitHub**
   ```bash
   # Navegar até a pasta do projeto
   cd c:\Users\Think\Desktop\CENTURY IA
   
   # Inicializar git (se ainda não estiver)
   git init
   
   # Adicionar todos os arquivos
   git add .
   
   # Fazer commit inicial
   git commit -m "Initial commit: CENTURY.IA project"
   
   # Adicionar remote (substitua seu_usuario e seu_repo)
   git remote add origin https://github.com/seu_usuario/seu_repo.git
   
   # Fazer push para main branch
   git branch -M main
   git push -u origin main
   ```

### 3. **Conectar ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Sign Up" ou "Log In"
   - Escolha "Continue with GitHub"
   - Autorize o Vercel a acessar sua conta GitHub

### 4. **Importar Projeto no Vercel**
   - Após login, clique em "New Project"
   - Encontre seu repositório `seu_repo` na lista
   - Clique em "Import"

### 5. **Configurar Variáveis de Ambiente**
   - Na tela de configuração do projeto, encontre "Environment Variables"
   - Adicione as variáveis do seu `.env.local`:
     - `VITE_BASE44_APP_ID` = seu_app_id
     - `VITE_BASE44_FUNCTIONS_VERSION` = v1
     - `VITE_BASE44_APP_BASE_URL` = https://api.base44.com
     - `VITE_GEMINI_API_KEY` = sua_chave_gemini_gratuita
     - `VITE_VERCEL_CLIENT_ID` = seu_client_id (se usar login Vercel)
     - `VITE_VERCEL_REDIRECT_URI` = https://seu-dominio.vercel.app/auth/vercel/callback

### 5a. **Obter Chave da API Gemini (GRATUITA)**
   - Acesse [Google AI Studio](https://aistudio.google.com/app/apikeys)
   - Clique em "Create API Key"
   - A chave será gerada automaticamente
   - **Limite gratuito:** 60 requisições/minuto, 1.500/dia
   - Copie a chave e adicione como `VITE_GEMINI_API_KEY` no Vercel

### 6. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar (normalmente 1-2 minutos)
   - Você receberá um URL como: `https://seu-projeto-xyz.vercel.app`

### 7. **Compartilhar com Amigos**
   - Copie o URL gerado
   - Compartilhe com seus amigos!
   - Eles podem acessar diretamente pelo navegador

## 📝 Notas Importantes

- **Variáveis sensíveis**: Não commite seu `.env.local` no Git (já está no .gitignore)
- **Domínio customizado**: Você pode configurar um domínio próprio nas settings do Vercel
- **Deployments automáticos**: Cada push para `main` no GitHub será automaticamente deployado
- **Visualizar logs**: Acesse o dashboard do Vercel para ver logs de build e erros

## 🔧 Troubleshooting

**Erro: "Build failed"**
- Verifique se as variáveis de ambiente estão corretas
- Confira se `npm run build` funciona localmente

**Erro: "Module not found"**
- Certifique-se de que todas as dependências estão no `package.json`
- Rode `npm install` localmente para sincronizar

**Erro: "VITE_BASE44_APP_ID is not configured"**
- Adicione as variáveis de ambiente no Vercel dashboard
- Aguarde o redeploy automático

## 📚 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Deploy Vite no Vercel](https://vercel.com/guides/deploying-a-vite-project-to-vercel)
- [Variáveis de Ambiente Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
