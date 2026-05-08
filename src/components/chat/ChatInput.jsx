import { useState, useRef } from "react";
import { ArrowUp, Paperclip, Mic, MicOff, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base33Cliente";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInput({ onSend, isLoading, placeholder }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSend = async () => {
    if ((!text.trim() && files.length === 0) || isLoading) return;
    let uploadedUrls = [];
    if (files.length > 0) {
      setIsUploading(true);
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedUrls.push(file_url);
      }
      setIsUploading(false);
    }
    onSend(text.trim(), uploadedUrls);
    setText("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const toggleRecording = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Seu navegador não suporta reconhecimento de voz."); return; }
    const r = new SR();
    r.lang = "pt-BR"; r.continuous = false; r.interimResults = false;
    r.onresult = (e) => { setText((p) => p ? p + " " + e.results[0][0].transcript : e.results[0][0].transcript); setIsRecording(false); };
    r.onerror = () => setIsRecording(false);
    r.onend = () => setIsRecording(false);
    recognitionRef.current = r; r.start(); setIsRecording(true);
  };

  const canSend = (text.trim() || files.length > 0) && !isLoading && !isUploading;

  return (
    <div className="px-4 pb-6 pt-2">
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 mb-2 px-1">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(190,175,135,0.1)', color: 'rgba(230,231,232,0.6)' }}>
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button onClick={() => removeFile(idx)} className="hover:opacity-100 opacity-60"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-3 border transition-colors"
          style={{ backgroundColor: '#2a2a2b', borderColor: 'rgba(190,175,135,0.15)' }}
        >
          <button onClick={() => fileInputRef.current?.click()} className="p-1 mb-0.5 flex-shrink-0 transition-opacity opacity-40 hover:opacity-80" style={{ color: '#BEAF87' }} title="Anexar arquivo">
            <Paperclip className="w-[18px] h-[18px]" />
          </button>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.pptx,.xlsx,.txt,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Pergunte alguma coisa"}
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none max-h-40 min-h-[24px] leading-6"
            style={{ color: '#E6E7E8' }}
            onInput={(e) => { e.target.style.height = "24px"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }}
          />

          <button onClick={toggleRecording} className={`p-1 mb-0.5 flex-shrink-0 transition-opacity ${isRecording ? "opacity-100" : "opacity-40 hover:opacity-80"}`} style={{ color: isRecording ? '#ff6b6b' : '#BEAF87' }}>
            {isRecording ? <MicOff className="w-[18px] h-[18px]" /> : <Mic className="w-[18px] h-[18px]" />}
          </button>

          <button
            onClick={handleSend}
            disabled={!canSend}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 transition-opacity"
            style={{ backgroundColor: canSend ? '#BEAF87' : 'rgba(190,175,135,0.15)', color: canSend ? '#252526' : 'rgba(190,175,135,0.3)' }}
          >
            {isLoading || isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}