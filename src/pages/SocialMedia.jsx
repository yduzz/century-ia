import { useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import MessageBubble from "../components/chat/MessageBubble";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import TypingIndicator from "../components/chat/TypingIndicator";
import useChat from "../hooks/useChat";

const SYSTEM_PROMPT = `Você é um especialista em marketing imobiliário e redes sociais da Century 21 Brasil. Sua função é criar conteúdo engajante para Instagram, Facebook e outras redes sociais. Você cria posts, legendas com emojis, hashtags relevantes, roteiros para Reels, ideias de conteúdo, anúncios imobiliários e calendários de conteúdo. Responda em português do Brasil com formatação markdown e seja criativo.`;

const SUGGESTIONS = [
  "Crie um post para Instagram sobre um apartamento novo",
  "Gere 10 hashtags para imóveis de luxo",
  "Monte um calendário de conteúdo semanal para Instagram",
  "Crie um roteiro para Reels de Tour Virtual",
];

export default function SocialMedia() {
  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get("conversationId");
  const { messages, isLoading, sendMessage } = useChat("social_media", SYSTEM_PROMPT, conversationId);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader title="IA Redes Sociais" subtitle="Marketing imobiliário inteligente" icon={Share2} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <WelcomeScreen title="Marketing para Redes Sociais" suggestions={SUGGESTIONS} onSelectSuggestion={(s) => sendMessage(s)} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>
      <ChatInput onSend={sendMessage} isLoading={isLoading} placeholder="O que você quer criar para redes sociais?" />
    </div>
  );
}