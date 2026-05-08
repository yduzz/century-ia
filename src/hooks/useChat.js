import { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base33Cliente";
import { geminiClient } from "@/api/geminiClient";

export default function useChat(toolType, systemPrompt, initialConversationId = null) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text, fileUrls = []) => {
      const userMsg = {
        role: "user",
        content: text,
        file_urls: fileUrls,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        // Build prompt with context from conversation history
        let fullPrompt = "";
        const contextMsgs = updatedMessages.slice(-10);
        for (const m of contextMsgs) {
          fullPrompt += `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}\n`;
        }

        // Call Gemini API
        let response;
        if (fileUrls && fileUrls.length > 0) {
          response = await geminiClient.sendMessageWithFiles(fullPrompt, fileUrls, systemPrompt);
        } else {
          response = await geminiClient.sendMessage(fullPrompt, systemPrompt);
        }

        const aiMsg = {
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };

        const allMessages = [...updatedMessages, aiMsg];
        setMessages(allMessages);
        setIsLoading(false);

        // Save conversation to base44 (optional)
        try {
          const title = text.substring(0, 50) + (text.length > 50 ? "..." : "");
          if (conversation) {
            await base44.entities.Conversation.update(conversation.id, {
              messages: allMessages,
            });
          } else {
            const conv = await base44.entities.Conversation.create({
              title,
              tool_type: toolType,
              messages: allMessages,
            });
            setConversation(conv);
          }
        } catch (saveError) {
          console.warn('Failed to save conversation:', saveError);
          // Don't fail the chat if saving fails
        }
      } catch (error) {
        console.error('Chat error:', error);
        setIsLoading(false);
        
        // Add error message to chat
        const errorMsg = {
          role: "assistant",
          content: `Desculpe, ocorreu um erro: ${error.message}. Verifique se a chave de API do Gemini está configurada.`,
          timestamp: new Date().toISOString(),
        };
        setMessages([...updatedMessages, errorMsg]);
      }
    },
    [messages, conversation, toolType, systemPrompt]
  );

  const loadConversation = useCallback((conv) => {
    setConversation(conv);
    setMessages(conv.messages || []);
  }, []);

  useEffect(() => {
    if (initialConversationId) {
      base44.entities.Conversation.filter({ id: initialConversationId }, "-created_date", 1)
        .then((results) => {
          if (results && results.length > 0) loadConversation(results[0]);
        });
    }
  }, [initialConversationId]);

  const resetChat = useCallback(() => {
    setConversation(null);
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, loadConversation, resetChat, conversation };
}