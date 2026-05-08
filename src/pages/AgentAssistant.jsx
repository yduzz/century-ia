import { useRef, useEffect } from "react";
import { UserCheck } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import MessageBubble from "../components/chat/MessageBubble";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import TypingIndicator from "../components/chat/TypingIndicator";
import useChat from "../hooks/useChat";

const SYSTEM_PROMPT = `Você é um assistente profissional para corretores imobiliários da Century 21 Brasil. Você ajuda no dia a dia do corretor com: responder dúvidas de clientes, criar mensagens profissionais para WhatsApp, criar scripts de vendas, gerar respostas rápidas, ajudar em negociações, criar propostas e muito mais. Seja profissional, objetivo e prático. Responda em português do Brasil com formatação markdown.`;

const SUGGESTIONS = [
  "Crie uma mensagem de WhatsApp para agendar visita",
  "Me ajude a responder um cliente que quer negociar o preço",
  "Crie um script de vendas para primeiro contato",
  "Gere respostas rápidas para perguntas frequentes de clientes",
];

export default function AgentAssistant() {
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get("conversationId");
  const { messages, isLoading, sendMessage } = useChat("agent_assistant", SYSTEM_PROMPT, conversationId);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader title="IA Assistente do Corretor" subtitle="Seu assistente pessoal de vendas" icon={UserCheck} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen title="Assistente do Corretor" suggestions={SUGGESTIONS} onSelectSuggestion={(s) => sendMessage(s)} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
      <ChatInput onSend={sendMessage} isLoading={isLoading} placeholder="Como posso ajudar no seu dia a dia?" />
    </div>
  );
}