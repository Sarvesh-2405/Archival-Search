import { useState } from 'react';
import { analyzeDocumentWithGemini, generateDocumentQuestions, getDocumentSummary } from '../utils/geminiService';

export const useAIAnalysis = () => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const analyzeDocument = async (document) => {
    setLoadingAI(true);
    setAiError(null);
    try {
      const analysis = await analyzeDocumentWithGemini(document);
      setAiAnalysis(analysis);
      return analysis;
    } catch (error) {
      const errorMsg = 'Failed to generate AI insights. Please check your API key and try again.';
      setAiError(errorMsg);
      console.error(error);
      throw error;
    } finally {
      setLoadingAI(false);
    }
  };

  const getQuestions = async (document) => {
    setLoadingAI(true);
    setAiError(null);
    try {
      return await generateDocumentQuestions(document);
    } catch (error) {
      setAiError('Failed to generate questions.');
      console.error(error);
      throw error;
    } finally {
      setLoadingAI(false);
    }
  };

  const getSummary = async (document) => {
    setLoadingAI(true);
    setAiError(null);
    try {
      return await getDocumentSummary(document);
    } catch (error) {
      setAiError('Failed to generate summary.');
      console.error(error);
      throw error;
    } finally {
      setLoadingAI(false);
    }
  };

  const clearAnalysis = () => {
    setAiAnalysis(null);
    setAiError(null);
  };

  return {
    aiAnalysis,
    loadingAI,
    aiError,
    analyzeDocument,
    getQuestions,
    getSummary,
    clearAnalysis,
  };
};
