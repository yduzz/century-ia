import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Loader2, X, Copy, Check } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import ReactMarkdown from "react-markdown";

export default function PropertyAnalysis() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setResult(null);

    const { file_url } = await base44.integrations.Core.UploadFile({ file: image });

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em imóveis e marketing imobiliário. Analise esta foto de um imóvel e forneça:

## 📋 Descrição do Imóvel
Descreva detalhadamente o que você vê na imagem: tipo de ambiente, dimensões aparentes, estilo arquitetônico, acabamentos, iluminação, etc.

## ✨ Pontos Fortes
Liste os principais atrativos e diferenciais visíveis do imóvel.

## 🔧 Sugestões de Melhoria
Sugira melhorias práticas para valorizar o imóvel ou melhorar a apresentação para venda (home staging, reformas, decoração, etc.).

## 📣 Descrição para Anúncio
Escreva uma descrição atrativa e profissional para usar em anúncios (portais imobiliários, redes sociais, WhatsApp). Use linguagem persuasiva e destaque os pontos fortes.

## 🏷️ Sugestão de Título
Sugira 3 títulos criativos e atrativos para o anúncio deste imóvel.

Seja detalhado, profissional e útil para um corretor de imóveis.`,
      file_urls: [file_url],
    });

    setResult(response);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl(null);
    setResult(null);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: '#1a1a1b' }}>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: '#E6E7E8' }}>Análise de Imóvel por Foto</h1>
          <p className="text-sm" style={{ color: '#808285' }}>Envie uma foto e a IA descreve, avalia e cria o anúncio perfeito.</p>
        </motion.div>

        {/* Upload Area */}
        {!imageUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-colors py-16 px-8 text-center"
            style={{
              borderColor: isDragging ? '#BEAF87' : 'rgba(190,175,135,0.2)',
              backgroundColor: isDragging ? 'rgba(190,175,135,0.06)' : 'rgba(37,37,38,0.5)'
            }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(190,175,135,0.1)' }}>
              <ImagePlus className="w-7 h-7" style={{ color: '#BEAF87' }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#E6E7E8' }}>Clique ou arraste uma foto aqui</p>
              <p className="text-xs" style={{ color: '#808285' }}>JPG, PNG, WEBP — foto de fachada, sala, cozinha, etc.</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Image preview */}
            <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(190,175,135,0.15)' }}>
              <img src={imageUrl} alt="Imóvel" className="w-full object-cover max-h-72" />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                <X className="w-4 h-4" style={{ color: '#E6E7E8' }} />
              </button>
            </div>

            {/* Analyze button */}
            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
                style={{ backgroundColor: '#BEAF87', color: '#252526', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analisando imóvel...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Analisar com IA</>
                )}
              </button>
            )}
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl p-5"
              style={{ backgroundColor: 'rgba(37,37,38,0.8)', border: '1px solid rgba(190,175,135,0.12)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: '#BEAF87' }} />
                  <span className="text-sm font-medium" style={{ color: '#BEAF87' }}>Análise completa</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ backgroundColor: 'rgba(190,175,135,0.1)', color: '#BEAF87' }}
                >
                  {copied ? <><Check className="w-3 h-3" /> Copiado!</> : <><Copy className="w-3 h-3" /> Copiar</>}
                </button>
              </div>

              <div className="prose prose-sm max-w-none prose-invert prose-p:my-2 prose-headings:my-3 prose-li:my-1 prose-ul:my-2" style={{ color: 'rgba(230,231,232,0.88)' }}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                    h2: ({ children }) => <h2 className="text-sm font-bold mt-5 mb-2" style={{ color: '#BEAF87' }}>{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>,
                    ul: ({ children }) => <ul className="my-2 ml-4 space-y-1 list-disc">{children}</ul>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >{result}</ReactMarkdown>
              </div>

              <button
                onClick={handleReset}
                className="mt-5 w-full py-2.5 rounded-xl text-sm border transition-colors"
                style={{ borderColor: 'rgba(190,175,135,0.2)', color: '#808285' }}
              >
                Analisar outra foto
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}