import { useRef, useEffect } from "react";
import { Building2 } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import MessageBubble from "../components/chat/MessageBubble";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import TypingIndicator from "../components/chat/TypingIndicator";
import useChat from "../hooks/useChat";

const SYSTEM_PROMPT = `Você é um especialista em apresentação de imóveis da Century 21 Brasil. Sua função é ajudar corretores a criar apresentações profissionais, descrições atrativas, roteiros de apresentação, textos para anúncios, argumentos de venda e scripts para vídeos de imóveis. Quando o corretor enviar fotos, documentos ou descrições de imóveis, analise tudo e crie conteúdo profissional de alta qualidade. Responda em português do Brasil com formatação markdown.`;

const SUGGESTIONS = [
  "Crie uma descrição profissional para um apartamento de 3 quartos",
  "Monte um roteiro de apresentação para um imóvel de luxo",
  "Gere argumentos de venda para uma casa com piscina",
  "Crie um script de vídeo para Tour Virtual de imóvel",
];

export default function PropertyPresentation() {
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get("conversationId");
  const { messages, isLoading, sendMessage } = useChat("property_presentation", SYSTEM_PROMPT, conversationId);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader title="IA Apresentação de Imóveis" subtitle="Crie apresentações profissionais" icon={Building2} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen title="Apresentação de Imóveis" suggestions={SUGGESTIONS} onSelectSuggestion={(s) => sendMessage(s)} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
      <ChatInput onSend={sendMessage} isLoading={isLoading} placeholder="Descreva o imóvel ou envie fotos..." />
    </div>
  );
}