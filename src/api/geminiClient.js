import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini AI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export const geminiClient = {
  /**
   * Send message using official Google Gemini SDK
   */
  sendMessage: async (prompt, systemPrompt = '') => {
    if (!GEMINI_API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
    }

    if (!genAI) {
      throw new Error('Gemini AI client not initialized');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      return text;
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

    if (!genAI) {
      throw new Error('Gemini AI client not initialized');
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      const parts = [{ text: fullPrompt }];

      // Add images if provided
      for (const url of fileUrls) {
        if (url.includes('image') || url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          try {
            const base64Data = await urlToBase64(url);
            parts.push({
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            });
          } catch (imgError) {
            console.warn('Failed to process image:', url, imgError);
            // Continue with other images
          }
        }
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      return text;
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
