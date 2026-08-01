# 🤖 Gemini AI Integration Guide

This archival search application now includes AI-powered features powered by Google's Gemini API!

## What's New

The application now features:
- **AI-Powered Document Analysis**: Click the "✨ Generate AI Insights" button on any document to get:
  - AI Summary of document significance
  - Historical Context
  - Key Insights
  - Related Research Topics
  - Research Value Assessment

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key" button
3. Select "Create API key in new Google Cloud project" (or your existing project)
4. Copy your API key (keep this secret!)

### 2. Configure Your Environment

Create a `.env.local` file in the project root with:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important**: Replace `your_gemini_api_key_here` with your actual API key.

### 3. Installation

The Gemini API package is already installed. Just start the app:

```bash
npm start
```

## Features Added

### 1. **DetailModal.jsx** (Updated)
- Added state management for AI analysis
- New AI Insights section with loading states
- Error handling with retry functionality
- Displays analysis results in an organized layout

### 2. **geminiService.js** (New)
Contains three main functions:
- `analyzeDocumentWithGemini()` - Comprehensive document analysis
- `generateDocumentQuestions()` - Research questions about the document
- `getDocumentSummary()` - Quick document summary

### 3. **useAIAnalysis.js** (New)
React hook for managing AI analysis state across components

## How to Use

1. **Open any document detail modal** by clicking on a search result
2. **Scroll to "AI-Powered Insights" section**
3. **Click "✨ Generate AI Insights"** button
4. Wait for the AI to analyze the document (takes 2-5 seconds)
5. View the comprehensive insights provided

## Troubleshooting

### "API Key Error"
- Check that your `.env.local` file is in the project root
- Verify the key is correctly copied from Google AI Studio
- Restart the development server: `npm start`

### "Failed to analyze document"
- Ensure you have an active internet connection
- Check that your API key hasn't expired or reached rate limits
- Try again in a few moments

### No API Key Configured
- The app will still work but won't generate AI insights
- Follow the setup instructions above to enable the feature

## API Usage & Limits

- **Free Tier**: 60 requests per minute
- **Pricing**: Free tier available for development
- Check [Google AI Pricing](https://ai.google.dev/pricing) for production use

## File Structure

```
src/
├── components/
│   └── DetailModal.jsx (Updated with AI features)
├── hooks/
│   └── useAIAnalysis.js (New)
├── utils/
│   └── geminiService.js (New)
└── .env.example (Configuration template)
```

## What the AI Analyzes

The AI provides insights on:
- Historical significance of the document
- Context from the title, description, date, and place
- Subject matter and classification
- Research value for scholars
- Related historical topics for further research

## Privacy & Security

- Your API key is stored locally in `.env.local` (not committed to git)
- Documents are sent to Google's API for analysis
- Results are cached in component state only
- No permanent storage of analysis results

## Support

For issues with:
- **Gemini API**: Visit [Google AI Documentation](https://ai.google.dev/docs)
- **This App**: Check the README in the project root

---

**Enjoy exploring your archival documents with AI assistance!** 🎓✨
