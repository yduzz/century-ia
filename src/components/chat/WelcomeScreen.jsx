import { motion } from "framer-motion";

export default function WelcomeScreen({ title, suggestions, onSelectSuggestion }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-xl w-full"
      >
        <h1 className="text-3xl font-semibold mb-8" style={{ color: '#E6E7E8' }}>
          {title || "Olá! Sou a CenturIA. O que temos para hoje?"}
        </h1>

        {suggestions && suggestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * i }}
                onClick={() => onSelectSuggestion(s)}
                className="text-left px-4 py-3 rounded-xl text-sm transition-colors border"
                style={{ backgroundColor: 'rgba(190,175,135,0.06)', borderColor: 'rgba(190,175,135,0.12)', color: 'rgba(230,231,232,0.6)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(190,175,135,0.12)'; e.currentTarget.style.color = '#E6E7E8'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(190,175,135,0.06)'; e.currentTarget.style.color = 'rgba(230,231,232,0.6)'; }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}