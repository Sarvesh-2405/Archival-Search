import React, { useState } from 'react';

// Example of how to use the AI features in other components
export const AIInsightsExample = () => {
  // Example 1: Direct import and usage
  import { analyzeDocumentWithGemini } from '../utils/geminiService';

  // Example 2: Using the custom hook
  import { useAIAnalysis } from '../hooks/useAIAnalysis';

  // Usage of hook in a component:
  /*
  const MyComponent = () => {
    const { aiAnalysis, loadingAI, aiError, analyzeDocument, clearAnalysis } = useAIAnalysis();

    const handleClick = async () => {
      await analyzeDocument(selectedDocument);
    };

    return (
      <div>
        <button onClick={handleClick} disabled={loadingAI}>
          Analyze
        </button>
        {loadingAI && <p>Loading...</p>}
        {aiError && <p>{aiError}</p>}
        {aiAnalysis && <pre>{JSON.stringify(aiAnalysis, null, 2)}</pre>}
      </div>
    );
  };
  */

  return <div>See comments above for usage examples</div>;
};

// The AI Analysis Response Format
export const AIAnalysisResponseFormat = {
  summary: "Brief 2-3 sentence summary of document significance",
  historicalContext: "Historical context and importance",
  keyInsights: [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  suggestedRelatedTopics: [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ],
  researchValue: "Assessment of research value"
};
