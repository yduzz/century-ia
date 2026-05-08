import { useState } from 'react';
import { Trash2, Archive, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ConversationList({
  conversations = [],
  isLoading = false,
  onSelectConversation,
  onArchive,
  onDelete,
  onSearch,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleDelete = async (id, title) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = async () => {
    if (deleteConfirm && onDelete) {
      await onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const getToolIcon = (toolType) => {
    const icons = {
      chat: '💬',
      property_presentation: '🏠',
      social_media: '📱',
      image_generator: '🖼️',
      agent_assistant: '🤖',
    };
    return icons[toolType] || '📝';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="mt-4 text-gray-400">Carregando conversas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400">Nenhuma conversa encontrada</p>
            <p className="text-xs text-gray-500 mt-2">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece uma nova conversa para vê-la aqui'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => onSelectConversation?.(conv)}
              >
                {/* Icon */}
                <span className="text-xl flex-shrink-0">{getToolIcon(conv.tool_type)}</span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{conv.title}</h3>
                  <p className="text-xs text-gray-500">{formatDate(conv.created_date)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive?.(conv.id);
                    }}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                    title="Arquivar"
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conv.id, conv.title);
                    }}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar conversa?</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a conversa "{deleteConfirm.title}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Deletar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
