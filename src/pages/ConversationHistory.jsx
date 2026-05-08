import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, MessageSquare, Building2, Share2, ImagePlus, UserCheck, Trash2, Search, Archive, Filter } from "lucide-react";
import ChatHeader from "../components/chat/ChatHeader";
import ConversationList from "../components/chat/ConversationList";
import { useConversations } from "../hooks/useConversations";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const toolIcons = {
  chat: MessageSquare,
  property_presentation: Building2,
  social_media: Share2,
  image_generator: ImagePlus,
  agent_assistant: UserCheck,
};

const toolLabels = {
  chat: "Chat IA",
  property_presentation: "Apresentação",
  social_media: "Redes Sociais",
  image_generator: "Gerador de Imagens",
  agent_assistant: "Assistente",
};

const toolRoutes = {
  chat: "/chat",
  property_presentation: "/property-presentation",
  social_media: "/social-media",
  image_generator: "/image-generator",
  agent_assistant: "/agent-assistant",
};

export default function ConversationHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    conversations,
    isLoading,
    searchConversations,
    deleteConversation,
    archiveConversation,
  } = useConversations();
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.trim()) {
      await searchConversations(value);
    }
  };

  const filtered = conversations
    .filter((c) => !c.is_archived || showArchived)
    .filter((c) => !filterType || c.tool_type === filterType)
    .filter((c) => !search || c.title?.toLowerCase().includes(search.toLowerCase()));

  const groupedByDate = filtered.reduce((acc, conv) => {
    const date = new Date(conv.created_date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey = "Mais antigos";
    if (date.toDateString() === today.toDateString()) {
      groupKey = "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Ontem";
    } else if (date.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
      groupKey = "Últimos 7 dias";
    } else if (date.getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000) {
      groupKey = "Últimos 30 dias";
    }

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(conv);
    return acc;
  }, {});

  const dateGroups = ["Hoje", "Ontem", "Últimos 7 dias", "Últimos 30 dias", "Mais antigos"];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader title="Histórico" subtitle="Suas conversas anteriores" icon={History} />
      
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full">
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar conversas..."
              className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
            />
          </div>

          {/* Filter by tool type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-white/8 text-white hover:bg-white/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Tipo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem
                onClick={() => setFilterType(null)}
                className="text-gray-200 cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
              >
                Todos os tipos
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              {Object.entries(toolLabels).map(([type, label]) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="text-gray-200 cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show archived toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className={`border-white/8 ${
              showArchived
                ? "bg-gold-500/20 text-gold-500 border-gold-500/50"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Archive className="w-4 h-4 mr-2" />
            Arquivadas
          </Button>
        </div>

        {/* Conversations */}
        {isLoading ? (
          <div className="text-center py-12 text-white/30 text-sm">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">
              {search || filterType ? "Nenhuma conversa encontrada" : "Nenhuma conversa salva"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dateGroups.map((group) => {
              const convs = groupedByDate[group];
              if (!convs || convs.length === 0) return null;

              return (
                <div key={group}>
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                    {group}
                  </h3>
                  <div className="space-y-2">
                    {convs.map((conv, i) => {
                      const Icon = toolIcons[conv.tool_type] || MessageSquare;
                      return (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl hover:bg-white/8 transition-colors group cursor-pointer"
                          onClick={() =>
                            navigate(
                              `${toolRoutes[conv.tool_type] || "/chat"}?conversationId=${conv.id}`
                            )
                          }
                        >
                          <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-gold-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {conv.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gold-500 font-medium">
                                {toolLabels[conv.tool_type] || "Chat"}
                              </span>
                              <span className="text-[10px] text-white/30">
                                {moment(conv.created_date).fromNow()}
                              </span>
                              <span className="text-[10px] text-white/30">
                                • {conv.messages?.length || 0} msgs
                              </span>
                              {conv.is_archived && (
                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                  Arquivado
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {!conv.is_archived && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveConversation(conv.id);
                                }}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                              >
                                <Archive className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        )}
      </div>
    </div>
  );
}