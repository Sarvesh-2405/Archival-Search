import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment variables in Create React App must start with REACT_APP_
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const IS_PLACEHOLDER = !API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY' || API_KEY.includes('your_gemini_api_key');

// Initialize only if we have a potentially valid key
const genAI = API_KEY && !IS_PLACEHOLDER ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Validates the API key configuration
 */
const validateConfig = () => {
  if (IS_PLACEHOLDER) {
    throw new Error('MISSING_API_KEY: Please add your Gemini API key to .env.local and restart the server.');
  }
  if (!genAI) {
    throw new Error('INITIALIZATION_ERROR: Failed to initialize Gemini AI. Check your API key.');
  }
};

/**
 * Robust JSON parser for Gemini responses
 * Handles markdown code blocks and trailing text
 */
const parseJSONResponse = (text) => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    try {
      // 2. Look for JSON inside markdown blocks or braces
      const jsonMatch = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (innerError) {
      console.error('Failed to parse JSON from text:', text);
    }
    throw new Error('PARSE_ERROR: Unable to understand the AI response format.');
  }
};

/**
 * Attempts to generate content using a list of potential free models.
 * This handles cases where certain models might not be available for specific keys/regions.
 */
const generateWithFallback = async (prompt, type = 'text') => {
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro'
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (type === 'json') {
        return parseJSONResponse(response.text());
      }
      return response.text();
    } catch (error) {
      lastError = error;
      // If it's a 404 (Not Found), try the next model
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.warn(`Model ${modelName} not found, trying next...`);
        continue;
      }
      // If it's another error (like 403 or 429), stop and throw
      throw error;
    }
  }

  // If we exhausted all models
  throw lastError;
};

export const analyzeDocumentWithGemini = async (document) => {
  try {
    validateConfig();

    const prompt = `You are an expert archival analyst. Analyze the following archival document and provide insightful information. Return your response in JSON format with these exact keys:
    - summary: A brief 2-3 sentence summary of the document's significance
    - historicalContext: The historical context and importance (2-3 sentences)
    - keyInsights: An array of 3-4 key insights or important points
    - suggestedRelatedTopics: An array of 3-4 related historical topics or subjects
    - researchValue: How valuable this document is for researchers (1 sentence)

    Document Information:
    Title: ${document.title}
    Type: ${document.type}
    Date: ${document.date || 'Unknown'}
    Place: ${document.place || 'Unknown'}
    Region: ${document.region || 'Unknown'}
    Description: ${document.description || 'No description provided'}
    Author: ${document.author || 'Unknown'}
    Subjects: ${document.subjects ? (Array.isArray(document.subjects) ? document.subjects.join(', ') : document.subjects) : 'None'}
    Collection: ${document.collection || 'Not specified'}

    Return ONLY valid JSON. Do not include any other text or explanations.`;

    return await generateWithFallback(prompt, 'json');
  } catch (error) {
    console.error('Error in analyzeDocumentWithGemini:', error);
    
    if (error.message?.includes('MISSING_API_KEY')) {
      throw new Error('API key not configured. Please see GEMINI_SETUP.md.');
    }
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error('Invalid API key or Generative Language API not enabled in Google Cloud Console.');
    }
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded (Free tier). Please try again in 60 seconds.');
    }
    if (error.message?.includes('404')) {
      throw new Error('No compatible AI models found for your API key. Please check your project settings in Google AI Studio.');
    }
    
    throw error;
  }
};

export const generateDocumentQuestions = async (document) => {
  try {
    validateConfig();
    const prompt = `Generate 5 research questions that scholars might ask about this archival document. Return as a JSON array of objects with 'question' and 'category' fields.

    Document: ${document.title}
    Type: ${document.type}
    Description: ${document.description || 'No description'}

    Return ONLY valid JSON array, no other text.`;

    return await generateWithFallback(prompt, 'json');
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
};

export const getDocumentSummary = async (document) => {
  try {
    validateConfig();
    const prompt = `Provide a brief, accessible summary (2-3 sentences) of the historical significance of this document:

    Title: ${document.title}
    Description: ${document.description || 'No description'}
    Context: Created in ${document.date || 'unknown date'} at ${document.place || 'unknown place'}`;

    return await generateWithFallback(prompt, 'text');
  } catch (error) {
    console.error('Error getting document summary:', error);
    return 'Summary unavailable.';
  }
};
