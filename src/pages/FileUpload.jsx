import { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, X, Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import ChatHeader from "../components/chat/ChatHeader";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadAndAnalyze = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setUploadedUrls(urls);
    setIsUploading(false);
    setIsAnalyzing(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um assistente da Century 21 Brasil. Analise os arquivos enviados e faça um resumo completo do conteúdo. Extraia informações importantes, destaque pontos-chave e sugira como o corretor pode usar essas informações. Responda em português do Brasil com formatação markdown.`,
      file_urls: urls,
    });

    setAnalysis(response);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#212121]">
      <ChatHeader title="Upload de Arquivos" subtitle="Importe e analise documentos com IA" icon={Upload} />
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
        {/* Drop zone */}
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-gold-500/40 transition-colors mb-6">
          <Upload className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <p className="text-sm font-medium text-white/60 mb-1">Arraste arquivos aqui ou clique para selecionar</p>
          <p className="text-xs text-white/30">PDF, Word, Excel, PowerPoint, TXT, PNG, JPG, JPEG</p>
        </div>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt,.png,.jpg,.jpeg" onChange={handleFiles} className="hidden" />

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mb-6">
              {files.map((file, idx) => {
                const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
                return (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                    {isImage ? <ImageIcon className="w-5 h-5 text-gold-500" /> : <FileText className="w-5 h-5 text-gold-500" />}
                    <span className="flex-1 text-sm text-white/80 truncate">{file.name}</span>
                    <span className="text-xs text-white/30">{(file.size / 1024).toFixed(0)} KB</span>
                    <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-white/30 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              <button onClick={uploadAndAnalyze} disabled={isUploading || isAnalyzing}
                className="w-full mt-4 py-3 bg-gold-500 text-black rounded-xl text-sm font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isUploading ? (<><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>) :
                  isAnalyzing ? (<><Loader2 className="w-4 h-4 animate-spin" />Analisando com IA...</>) :
                  (<><Sparkles className="w-4 h-4" />Enviar e Analisar com IA</>)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h3 className="text-sm font-semibold text-white">Análise da IA</h3>
            </div>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}