/**
 * aiApi.js
 * ────────
 * Integration with Google Gemini AI for the Weather Assistant.
 * Falls back to mock responses if API key is missing.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const IS_DEMO = !API_KEY || API_KEY === 'your_gemini_api_key_here';

let genAI = null;
if (!IS_DEMO) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

/**
 * Helper to generate a contextual prompt based on current weather.
 */
const buildWeatherContext = (weatherData) => {
  if (!weatherData) return 'No weather data available.';
  return `
Current Weather in ${weatherData.city}:
- Temperature: ${weatherData.temp}°
- Condition: ${weatherData.description}
- Wind: ${weatherData.wind}
- Humidity: ${weatherData.humidity}%
- UV Index: ${weatherData.uvi || 'Unknown'}
  `.trim();
};

export const askWeatherAssistant = async (question, weatherData) => {
  if (IS_DEMO) {
    // Return a smart-sounding mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQ = question.toLowerCase();
        if (lowerQ.includes('umbrella') || lowerQ.includes('rain')) {
          resolve(weatherData?.description?.includes('rain') 
            ? "Yes, it looks like rain. Definitely take an umbrella!" 
            : "No rain expected today, you should be fine without one.");
        } else if (lowerQ.includes('clothes') || lowerQ.includes('wear')) {
          resolve(weatherData?.temp < 15 
            ? "It's a bit chilly! A warm jacket is recommended." 
            : "It's quite warm. Light, breathable clothing is best.");
        } else {
          resolve(`Based on the current weather (${weatherData?.temp}°, ${weatherData?.description}), it's a great day to be outside!`);
        }
      }, 1200);
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const context = buildWeatherContext(weatherData);
    
    const prompt = `
You are a helpful AI Weather Assistant for a premium weather dashboard.
Keep your answer concise (1-3 sentences), friendly, and practical.
Do not use markdown formatting.

Context:
${context}

User Question: ${question}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Sorry, the AI assistant is currently unavailable.');
  }
};

export const generateDailySummary = async (weatherData, forecastData) => {
  if (IS_DEMO) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Expect a ${weatherData?.description} day ahead with highs around ${forecastData?.[0]?.tempMax}°. It's a fairly typical day for this time of year.`);
      }, 1500);
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const context = buildWeatherContext(weatherData);
    
    const prompt = `
You are a meteorological AI. Provide a quick, 2-sentence summary of what the user should expect today based on the following data:
${context}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Summary temporarily unavailable.';
  }
};
