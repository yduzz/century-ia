import { useState, useEffect } from "react";
import { Settings, User, Sparkles } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import ChatHeader from "../components/chat/ChatHeader";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="flex flex-col h-full bg-[#212121]">
      <ChatHeader title="Configurações" subtitle="Personalize sua experiência" icon={Settings} />
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/8 rounded-xl p-6 mb-4">
          <h3 className="text-xs uppercase tracking-widest text-white/25 font-semibold mb-4">Perfil</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-500/15 flex items-center justify-center">
              <User className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.full_name || "Carregando..."}</p>
              <p className="text-xs text-white/40">{user?.email || ""}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/8 rounded-xl p-6 mb-4">
          <h3 className="text-xs uppercase tracking-widest text-white/25 font-semibold mb-4">Sobre</h3>
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <div>
              <p className="text-sm font-medium text-white">Century 21 Hub de IA</p>
              <p className="text-xs text-white/30">Versão 1.0</p>
            </div>
          </div>
          <p className="text-xs text-white/30 leading-relaxed">Plataforma exclusiva de Inteligência Artificial para corretores Century 21 Brasil.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <button onClick={handleLogout} className="w-full py-3 border border-white/8 rounded-xl text-sm text-white/30 hover:text-red-400 hover:border-red-400/30 transition-colors">
            Sair da conta
          </button>
        </motion.div>
      </div>
    </div>
  );
}