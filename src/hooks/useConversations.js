import { useState, useCallback, useEffect } from 'react';
import { base44 } from '@/api/base33Cliente';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar todas as conversas
  const listConversations = useCallback(
    async (toolType = null, limit = 100, skip = 0) => {
      try {
        setIsLoading(true);
        setError(null);

        const query = toolType ? { tool_type: toolType } : {};
        const results = await base44.entities.Conversation.list({
          q: query,
          limit,
          skip,
          sort_by: '-created_date',
        });

        setConversations(results);
        return results;
      } catch (err) {
        setError(err.message || 'Erro ao listar conversas');
        console.error('Error listing conversations:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter uma conversa por ID
  const getConversation = useCallback(async (id) => {
    try {
      const result = await base44.entities.Conversation.get(id);
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao obter conversa');
      console.error('Error getting conversation:', err);
      return null;
    }
  }, []);

  // Criar nova conversa
  const createConversation = useCallback(
    async (title, toolType, messages = []) => {
      try {
        setError(null);
        const result = await base44.entities.Conversation.create({
          title,
          tool_type: toolType,
          messages,
          is_archived: false,
        });

        setConversations((prev) => [result, ...prev]);
        return result;
      } catch (err) {
        setError(err.message || 'Erro ao criar conversa');
        console.error('Error creating conversation:', err);
        return null;
      }
    },
    []
  );

  // Atualizar conversa
  const updateConversation = useCallback(async (id, data) => {
    try {
      setError(null);
      const result = await base44.entities.Conversation.update(id, data);

      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? result : conv))
      );
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao atualizar conversa');
      console.error('Error updating conversation:', err);
      return null;
    }
  }, []);

  // Arquivar conversa
  const archiveConversation = useCallback(
    async (id) => {
      return updateConversation(id, { is_archived: true });
    },
    [updateConversation]
  );

  // Restaurar conversa
  const restoreConversation = useCallback(
    async (id) => {
      return updateConversation(id, { is_archived: false });
    },
    [updateConversation]
  );

  // Deletar conversa
  const deleteConversation = useCallback(async (id) => {
    try {
      setError(null);
      await base44.entities.Conversation.delete(id);

      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao deletar conversa');
      console.error('Error deleting conversation:', err);
      return false;
    }
  }, []);

  // Deletar múltiplas conversas
  const deleteMultipleConversations = useCallback(async (ids) => {
    try {
      setError(null);
      
      for (const id of ids) {
        await base44.entities.Conversation.delete(id);
      }

      setConversations((prev) =>
        prev.filter((conv) => !ids.includes(conv.id))
      );
      return true;
    } catch (err) {
      setError(err.message || 'Erro ao deletar conversas');
      console.error('Error deleting conversations:', err);
      return false;
    }
  }, []);

  // Buscar conversas por título
  const searchConversations = useCallback(async (title) => {
    try {
      setError(null);
      const results = await base44.entities.Conversation.list({
        q: { title: { $regex: title, $options: 'i' } },
        sort_by: '-created_date',
      });

      setConversations(results);
      return results;
    } catch (err) {
      // Fallback: fazer busca no cliente se a API não suportar regex
      const filtered = conversations.filter((conv) =>
        conv.title.toLowerCase().includes(title.toLowerCase())
      );
      return filtered;
    }
  }, [conversations]);

  // Carregar conversas inicialmente
  useEffect(() => {
    listConversations();
  }, [listConversations]);

  return {
    conversations,
    isLoading,
    error,
    listConversations,
    getConversation,
    createConversation,
    updateConversation,
    archiveConversation,
    restoreConversation,
    deleteConversation,
    deleteMultipleConversations,
    searchConversations,
  };
};
