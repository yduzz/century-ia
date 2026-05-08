import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import MessageBubble from "../components/chat/MessageBubble";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import TypingIndicator from "../components/chat/TypingIndicator";
import useChat from "../hooks/useChat";

const SYSTEM_PROMPT = `Você é um assistente de IA premium da Century 21 Brasil. Você ajuda corretores imobiliários com qualquer dúvida sobre vendas, marketing, apresentação de imóveis, negociação e muito mais. Responda sempre em português do Brasil, de forma profissional, clara e objetiva. Use formatação markdown quando apropriado.`;

const SUGGESTIONS = [
  "Como criar um anúncio atrativo para um apartamento?",
  "Quais são as melhores técnicas de negociação imobiliária?",
  "Me ajude a responder um cliente que quer desconto",
  "Crie um script de venda para um imóvel de luxo",
];

export default function ChatPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get("conversationId");
  const { messages, isLoading, sendMessage } = useChat("chat", SYSTEM_PROMPT, conversationId);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader
        title="ChatGPT"
        subtitle="Assistente inteligente para corretores"
        icon={MessageSquare}
      />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen
            title="Olá! Sou a CenturIA. O que temos para hoje?"
            suggestions={SUGGESTIONS}
            onSelectSuggestion={(s) => sendMessage(s)}
          />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder="Pergunte alguma coisa"
      />
    </div>
  );
}