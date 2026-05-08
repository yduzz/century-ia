import { useState, useRef, useEffect } from "react";
import { ImagePlus, Loader2, Download } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import ChatHeader from "../components/chat/ChatHeader";
import { motion } from "framer-motion";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [images]);

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return;

    const userPrompt = prompt;
    setPrompt("");
    setIsLoading(true);

    setImages((prev) => [...prev, { type: "prompt", text: userPrompt }]);

    const enhancedPrompt = `Photorealistic image of: ${userPrompt}. 

STRICT RULES - ABSOLUTELY NO EXCEPTIONS:
- NO text of any kind anywhere in the image
- NO logos, symbols, icons or emblems
- NO brand names, company names or trademarks (real or fictional)
- NO watermarks or overlays
- NO signs, banners or written content
- NO promotional graphics or marketing layouts
- ONLY the pure photographic/visual scene, nothing else

This must be a clean, text-free, logo-free, brand-free photograph. Any text or logo makes the image unusable.`;

    const result = await base44.integrations.Core.GenerateImage({
      prompt: enhancedPrompt,
    });

    setImages((prev) => [...prev, { type: "image", url: result.url, prompt: userPrompt }]);
    setIsLoading(false);
  };

  const suggestions = [
    "Sala de estar moderna e minimalista com luz natural",
    "Fachada de casa de alto padrão ao entardecer",
    "Apartamento com vista panorâmica para a cidade",
    "Piscina em área de lazer de condomínio luxuoso",
  ];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#1a1a1b' }}>
      <ChatHeader title="IA Gerador de Imagens" subtitle="Crie imagens profissionais para marketing" icon={ImagePlus} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {images.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl w-full">
              <h1 className="text-3xl font-semibold text-white mb-8">Gerador de Imagens IA</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.map((s, i) => (
                  <motion.button key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                    onClick={() => setPrompt(s)}
                    className="text-left px-4 py-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white">
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            {images.map((item, i) =>
              item.type === "prompt" ? (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="bg-[#2f2f2f] text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm max-w-[80%]">{item.text}</div>
                </motion.div>
              ) : (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <img src={item.url} alt={item.prompt} className="rounded-xl max-w-full shadow-lg" />
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-gold-500 hover:underline">
                    <Download className="w-3 h-3" /> Baixar imagem
                  </a>
                </motion.div>
              )
            )}
            {isLoading && (
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-gold-500" />
                Gerando imagem...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2">
        <div className="max-w-3xl mx-auto flex items-center gap-2 bg-[#2f2f2f] rounded-2xl px-4 py-3 border border-white/8 focus-within:border-white/15 transition-colors">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateImage()}
            placeholder="Descreva a imagem que deseja criar..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 outline-none" />
          <button onClick={generateImage} disabled={isLoading || !prompt.trim()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              prompt.trim() && !isLoading ? "bg-gold-500 text-black hover:bg-gold-600" : "bg-white/10 text-white/20"
            }`}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}