import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Share2, ImagePlus, UserCheck, MessageSquare, ArrowRight, ScanSearch, Camera } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import { useEffect, useState } from "react";

const tools = [
  { path: "/chat", icon: MessageSquare, title: "Chat IA", desc: "Assistente para qualquer dúvida" },
  { path: "/property-presentation", icon: Building2, title: "Apresentação de Imóveis", desc: "Apresentações e roteiros profissionais" },
  { path: "/social-media", icon: Share2, title: "Redes Sociais", desc: "Posts, legendas e conteúdo" },
  { path: "/image-generator", icon: ImagePlus, title: "Gerador de Imagens", desc: "Imagens para marketing imobiliário" },
  { path: "/agent-assistant", icon: UserCheck, title: "Assistente do Corretor", desc: "Scripts de vendas e negociação" },
  { path: "/property-analysis", icon: ScanSearch, title: "Análise por Foto", desc: "IA descreve e cria anúncio a partir de fotos" },
  { path: "/pose-generator", icon: Camera, title: "Poses Profissionais", desc: "Gere fotos editoriais corporativas com IA" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: '#1a1a1b' }}>
      <div className="max-w-2xl mx-auto px-8 pt-16 pb-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-semibold mb-1" style={{ color: '#E6E7E8' }}>
            Bem-vindo ao CENTURY.IA
          </h1>
          <p className="text-sm" style={{ color: '#808285' }}>O que você precisa fazer hoje?</p>
        </motion.div>

        {/* Tools */}
        <div className="space-y-2">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
            >
              <Link
                to={tool.path}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border transition-all group"
                style={{ backgroundColor: 'rgba(37,37,38,0.8)', borderColor: 'rgba(190,175,135,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(190,175,135,0.35)'; e.currentTarget.style.backgroundColor = 'rgba(190,175,135,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(190,175,135,0.1)'; e.currentTarget.style.backgroundColor = 'rgba(37,37,38,0.8)'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(190,175,135,0.12)' }}>
                  <tool.icon className="w-4 h-4" style={{ color: '#BEAF87' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#E6E7E8' }}>{tool.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#808285' }}>{tool.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#BEAF87' }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}