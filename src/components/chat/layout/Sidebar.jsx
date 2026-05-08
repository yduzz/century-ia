import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base33Cliente";
import {
  LayoutDashboard,
  Building2,
  Share2,
  ImagePlus,
  UserCheck,
  History,
  MessageSquare,
  Plus,
  ScanSearch,
  Camera,
  LogOut } from
"lucide-react";

const navSections = [
{
  label: null,
  items: [
  { path: "/chat", icon: Plus, label: "Novo chat" }]

},
{
  label: null,
  items: [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/history", icon: History, label: "Histórico" }]

},
{
  label: "Ferramentas IA",
  items: [
  { path: "/property-presentation", icon: Building2, label: "Apresentação de Imóveis" },
  { path: "/social-media", icon: Share2, label: "Redes Sociais" },
  { path: "/image-generator", icon: ImagePlus, label: "Gerador de Imagens" },
  { path: "/agent-assistant", icon: UserCheck, label: "Assistente do Corretor" },
  { path: "/property-analysis", icon: ScanSearch, label: "Análise por Foto" },
  { path: "/pose-generator", icon: Camera, label: "Poses Profissionais" }]

}];


export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-60 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: '#252526', borderColor: 'rgba(190,175,135,0.12)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14">
        <img src="https://media.base44.com/images/public/69d7b5e8731b087c4c738c59/f3bdaf2be_LOGO_CENTURY_IA-removebg-preview.png" alt="Century IA" className="w-10 h-10 object-contain flex-shrink-0" />
        <div>
          <span className="text-sm font-bold tracking-wide" style={{ color: '#E6E7E8' }}>CENTURY.IA</span>
          
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {navSections.map((section, si) =>
        <div key={si}>
            {section.label &&
          <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(190,175,135,0.4)' }}>
                {section.label}
              </p>
          }
            <div className="space-y-0.5">
              {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    backgroundColor: isActive ? 'rgba(190,175,135,0.15)' : 'transparent',
                    color: isActive ? '#BEAF87' : 'rgba(230,231,232,0.5)'
                  }}
                  onMouseEnter={(e) => {if (!isActive) {e.currentTarget.style.backgroundColor = 'rgba(190,175,135,0.08)';e.currentTarget.style.color = '#E6E7E8';}}}
                  onMouseLeave={(e) => {if (!isActive) {e.currentTarget.style.backgroundColor = 'transparent';e.currentTarget.style.color = 'rgba(230,231,232,0.5)';}}}>
                  
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>);

            })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t space-y-3" style={{ borderColor: 'rgba(190,175,135,0.1)' }}>
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: 'rgba(230,231,232,0.4)' }}
          onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = 'rgba(255,100,100,0.08)';e.currentTarget.style.color = '#ff6b6b';}}
          onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent';e.currentTarget.style.color = 'rgba(230,231,232,0.4)';}}>
          
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sair</span>
        </button>
        
      </div>
    </aside>);

}