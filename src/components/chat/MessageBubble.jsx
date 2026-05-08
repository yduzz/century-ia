import { motion } from "framer-motion";
import { Sparkles, User, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ backgroundColor: isUser ? 'rgba(230,231,232,0.1)' : '#BEAF87' }}
      >
        {isUser
          ? <User className="w-3.5 h-3.5" style={{ color: '#808285' }} />
          : <Sparkles className="w-3.5 h-3.5" style={{ color: '#252526' }} />
        }
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? "flex flex-col items-end" : ""}`}>
        {message.file_urls && message.file_urls.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.file_urls.map((url, idx) => {
              const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(url);
              return isImage ? (
                <img key={idx} src={url} alt="Anexo" className="w-36 h-36 rounded-xl object-cover" style={{ border: '1px solid rgba(190,175,135,0.15)' }} />
              ) : (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'rgba(190,175,135,0.08)', color: '#808285' }}>
                  <FileText className="w-3.5 h-3.5" style={{ color: '#BEAF87' }} />
                  Arquivo anexado
                </div>
              );
            })}
          </div>
        )}

        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={isUser
            ? { backgroundColor: '#2a2a2b', color: '#E6E7E8', borderRadius: '18px 4px 18px 18px' }
            : { color: 'rgba(230,231,232,0.88)', borderRadius: '4px 18px 18px 18px' }
          }
        >
          <div className="prose prose-sm max-w-none prose-invert prose-p:my-2 prose-headings:my-3 prose-li:my-1 prose-ul:my-2 prose-ol:my-2" style={{ color: 'inherit' }}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                h1: ({ children }) => <h1 className="text-base font-bold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold mt-3 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>,
                ul: ({ children }) => <ul className="my-2 ml-4 space-y-1 list-disc">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 ml-4 space-y-1 list-decimal">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                hr: () => <hr className="my-3 border-white/10" />,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-gold-500 pl-3 my-2 italic opacity-80">{children}</blockquote>,
              }}
            >{message.content}</ReactMarkdown>
          </div>
        </div>

        {message.timestamp && (
          <p className="text-[10px] mt-1 px-1" style={{ color: 'rgba(128,130,133,0.5)' }}>
            {new Date(message.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </motion.div>
  );
}