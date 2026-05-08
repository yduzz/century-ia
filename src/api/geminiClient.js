// Google Gemini API Integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models';

export const geminiClient = {
  /**
   * Call Google Gemini API for chat completion
   * Free tier: 60 req/min, 1,500 req/day
   */
  sendMessage: async (prompt, systemPrompt = '') => {
    if (!GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    try {
      const response = await fetch(
        `${GEMINI_API_URL}/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },

  /**
   * Send message with file URLs (images)
   */
  sendMessageWithFiles: async (prompt, fileUrls = [], systemPrompt = '') => {
    if (!GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
    }

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    try {
      const parts = [
        {
          text: fullPrompt,
        },
      ];

      // Add images if provided
      for (const url of fileUrls) {
        if (url.includes('image') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: await urlToBase64(url),
            },
          });
        }
      }

      const response = await fetch(
        `${GEMINI_API_URL}/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts,
              },
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },

  /**
   * Check if API key is configured
   */
  isConfigured: () => !!GEMINI_API_KEY,
};

/**
 * Helper function to convert URL to base64
 */
async function urlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    throw error;
  }
}
