import { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base33Cliente";

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

      // Build prompt with context
      let fullPrompt = systemPrompt + "\n\n";
      // Include last 10 messages for context
      const contextMsgs = updatedMessages.slice(-10);
      for (const m of contextMsgs) {
        fullPrompt += `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}\n`;
      }
      fullPrompt += "\nAssistente:";

      const invokeParams = {
        prompt: fullPrompt,
      };

      if (fileUrls.length > 0) {
        invokeParams.file_urls = fileUrls;
      }

      const response = await base44.integrations.Core.InvokeLLM(invokeParams);

      const aiMsg = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };

      const allMessages = [...updatedMessages, aiMsg];
      setMessages(allMessages);
      setIsLoading(false);

      // Save conversation
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