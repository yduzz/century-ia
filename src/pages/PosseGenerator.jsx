import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, UserRound, Users, Loader2, Download, X, Sparkles, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base33Cliente";

const FEMALE_PROMPT = `Use the uploaded photo as the facial and identity reference. Recreate a completely new scene while preserving the person's facial features, skin tone, and realism.

The composition must feature a woman sitting on a tall wooden stool with a black metal frame, inside a minimalist studio environment with a neutral gray background.

The framing should be full body, vertical (1080x1920), with slight distance to emphasize posture and clean negative space.

Pose:
Right leg bent, resting on the stool's lower support
Left leg extended naturally, touching the floor
Elegant posture, confident and composed

Outfit:
Full black sophisticated look
Tailored slim-fit trousers
Black blouse
Structured blazer worn over the shoulders
Black high heels with subtle transparent details

IMPORTANT DETAIL:
Add a Century 21 (C21) gold lapel pin on the blazer, positioned exactly like the reference image (left chest area)
The pin must be small, circular, metallic gold, elegant and realistic

Styling:
Hair loose, smooth, falling naturally over the shoulders
Facial expression confident, calm, and powerful
Gaze slightly directed to the side (not straight to camera)

Lighting:
Professional studio lighting
Soft directional light
Balanced contrast between highlights and shadows
Subtle cinematic feel
Emphasis on fabric texture and facial contours

Background:
Clean, smooth gray gradient
No distractions
Editorial minimalism

Style:
Modern corporate editorial
High-end magazine quality
Photorealistic
Sophisticated, elegant, premium finish`;

const MALE_PROMPT = `Use the uploaded photo as the facial and identity reference. Recreate a new scene while preserving the person's facial features, skin tone, and photorealistic identity.

The composition must feature a man sitting on a tall wooden stool with a black metal frame, inside a minimalist studio with a neutral gray background.

The framing should be full body, vertical (1080x1920), with slight distance to emphasize posture and clean composition.

Pose:
Right leg bent and resting on the stool's lower support
Left leg naturally extended, touching the floor
Confident, upright posture

Outfit:
Elegant and fully coordinated look
Tailored slim-fit trousers (black)
Structured blazer (black)
Moss blue shirt underneath (azul musgo)
Black formal shoes with subtle translucent details

Accessories (IMPORTANT):
A Century 21 (C21) gold lapel pin on the blazer (left chest, same position as in the original photo)
A ring with a zirconia stone on the left pinky finger
A Rolex watch on the wrist, elegant and realistic

Expression & Styling:
Confident and composed facial expression
Gaze slightly directed to the side (not directly at camera)
Clean grooming, professional appearance

Lighting:
Professional studio lighting
Soft directional light
Balanced contrast between light and shadow
Subtle cinematic mood
Emphasis on facial contours and fabric textures

Background:
Smooth gray gradient
Minimalist, no distractions
Clean editorial look

Style:
Modern corporate editorial
High-end magazine photography
Photorealistic
Sophisticated and premium finish`;

export default function PoseGenerator() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [gender, setGender] = useState(null); // 'female' | 'male'
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleGenerate = async () => {
    if (!image || !gender) return;
    setIsLoading(true);
    setResult(null);

    const { file_url } = await base44.integrations.Core.UploadFile({ file: image });
    const prompt = gender === "female" ? FEMALE_PROMPT : MALE_PROMPT;

    const res = await base44.integrations.Core.GenerateImage({
      prompt,
      existing_image_urls: [file_url],
    });

    setResult(res.url);
    setIsLoading(false);
  };

  const handleReset = () => {
    setImage(null);
    setImageUrl(null);
    setResult(null);
    setGender(null);
  };

  const canGenerate = image && gender && !isLoading;

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: '#1a1a1b' }}>
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: '#E6E7E8' }}>Poses Profissionais IA</h1>
          <p className="text-sm" style={{ color: '#808285' }}>
            Envie uma foto de rosto ou corpo inteiro e gere uma foto editorial corporativa com a identidade visual Century 21.
          </p>
        </motion.div>

        {/* Upload */}
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
              <Upload className="w-7 h-7" style={{ color: '#BEAF87' }} />
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#E6E7E8' }}>Clique ou arraste uma foto aqui</p>
              <p className="text-xs" style={{ color: '#808285' }}>Foto de rosto ou corpo inteiro — JPG, PNG, WEBP</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(190,175,135,0.15)' }}>
              <img src={imageUrl} alt="Foto enviada" className="w-full object-cover max-h-64" />
              {!isLoading && (
                <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  <X className="w-4 h-4" style={{ color: '#E6E7E8' }} />
                </button>
              )}
            </div>

            {/* Gender Selection */}
            {!result && (
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'rgba(230,231,232,0.5)' }}>Selecione o gênero para o estilo da pose:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "female", label: "Mulher", icon: UserRound, desc: "Look feminino editorial" },
                    { value: "male", label: "Homem", icon: Users, desc: "Look masculino executivo" },
                  ].map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      onClick={() => setGender(value)}
                      className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all"
                      style={{
                        borderColor: gender === value ? '#BEAF87' : 'rgba(190,175,135,0.15)',
                        backgroundColor: gender === value ? 'rgba(190,175,135,0.1)' : 'rgba(37,37,38,0.5)',
                        color: gender === value ? '#BEAF87' : 'rgba(230,231,232,0.5)'
                      }}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-[11px]" style={{ color: 'rgba(128,130,133,0.8)' }}>{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            {!result && (
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
                style={{
                  backgroundColor: canGenerate ? '#BEAF87' : 'rgba(190,175,135,0.2)',
                  color: canGenerate ? '#252526' : 'rgba(190,175,135,0.4)',
                }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Gerando foto editorial... pode levar alguns segundos</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Gerar Foto Profissional</>
                )}
              </button>
            )}
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(190,175,135,0.15)' }}>
                <img src={result} alt="Foto gerada" className="w-full" />
              </div>

              <div className="flex gap-3">
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#BEAF87', color: '#252526' }}
                >
                  <Download className="w-4 h-4" /> Baixar Foto
                </a>
                <button
                  onClick={() => { setResult(null); handleGenerate(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border"
                  style={{ borderColor: 'rgba(190,175,135,0.2)', color: '#808285' }}
                >
                  <RefreshCw className="w-4 h-4" /> Gerar novamente
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl text-sm border transition-colors"
                style={{ borderColor: 'rgba(190,175,135,0.1)', color: 'rgba(128,130,133,0.6)' }}
              >
                Usar outra foto
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}