# Guia de Configuração - Google Gemini API (Gratuito)

## 🎯 O que foi implementado

Seu projeto **CENTURY.IA** agora usa a **Google Gemini API** para alimentar os chats com IA. É **100% gratuito** e funcionará em todos os chats:
- Chat principal (ChatPage)
- Agent Assistant
- Property Analysis
- Social Media
- Image Generator
- E qualquer outro que use IA

## ✨ Por que Gemini?

- ✅ **Completamente gratuito** (60 req/min, 1,500/dia)
- ✅ **Sem cartão de crédito necessário**
- ✅ **Muito poderoso** (melhor que muitos modelos pagas)
- ✅ **Suporta imagens** (análise de imóveis, fotos, etc)
- ✅ **Respostas em português** perfeito
- ✅ **Rápido** e confiável

## 🔑 Como obter a chave API (grátis)

### 1. **Acesse o Google AI Studio**
   ```
   https://aistudio.google.com/app/apikeys
   ```

### 2. **Clique em "Create API Key"**
   - Autorize com sua conta Google
   - A chave será gerada automaticamente
   - Copie a chave (exemplo: `AIzaSyD...`)

### 3. **Adicione ao seu `.env.local`**
   ```env
   VITE_GEMINI_API_KEY=AIzaSyD...
   ```

### 4. **Pronto!** 🎉
   - Reinicie o servidor local (`npm run dev`)
   - Os chats agora usarão Gemini automaticamente

## 🌐 Configurar no Vercel (Deploy)

Quando fizer deploy no Vercel:

1. **Vá para o dashboard do Vercel**
2. **Clique no seu projeto**
3. **Settings → Environment Variables**
4. **Adicione:**
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Cole sua chave
   - **Clique em "Save"**
5. **Redeploy** (automático ou manual)

## 📊 Monitorar uso da quota

- Acesse: https://aistudio.google.com/app/apikeys
- Veja seu **usage quotas** em tempo real
- Limite: 1,500 requisições/dia
- Com ~50-100 requisições/dia de uso normal, você tem muito espaço

## 🔧 Troubleshooting

### "VITE_GEMINI_API_KEY is not set"
- ✅ Adicione `VITE_GEMINI_API_KEY` ao `.env.local`
- ✅ Reinicie o servidor com `npm run dev`

### "API error: 403"
- ✅ Verifique se a chave está correta
- ✅ Confira se a API Generative Language está habilitada
- ✅ Acesse: https://aistudio.google.com/app/apikeys novamente

### "Invalid response from Gemini API"
- ✅ Pode ser quota diária atingida
- ✅ Aguarde até o próximo dia (quota renova a cada 24h)
- ✅ Ou use outro modelo/serviço

## 💡 Recursos Adicionais

- [Documentação Gemini](https://ai.google.dev/docs)
- [Sandbox de teste](https://aistudio.google.com)
- [Limites e quotas](https://ai.google.dev/docs/gemini-api/usage-limits)

## 🎬 Exemplo de uso

Seu código agora funciona assim:

```javascript
import { geminiClient } from '@/api/geminiClient';

// Enviar pergunta
const response = await geminiClient.sendMessage(
  "Como vender um imóvel rápido?",
  "Você é um especialista imobiliário"
);

// Com imagens
const responseWithImage = await geminiClient.sendMessageWithFiles(
  "Avalie este imóvel",
  [imageUrl],
  "Você é avaliador de imóveis"
);
```

## ❓ Perguntas Frequentes

**P: Preciso pagar?**
R: Não! É 100% gratuito. Sem cartão de crédito, sem cobranças ocultas.

**P: E se ultrapassar 1,500 requisições/dia?**
R: Nada acontece. Você só perde acesso até o próximo dia (quota renova).

**P: Posso usar outra IA?**
R: Sim! O código foi feito para ser extensível. Você pode adicionar OpenAI, Claude, etc.

**P: As respostas são boas?**
R: Sim! Gemini é um modelo muito poderoso, comparável a GPT-4 em muitas tarefas.

---

✅ Sua IA está pronta! Compartilhe seu app com amigos em: https://github.com/yduzz/century-ia
