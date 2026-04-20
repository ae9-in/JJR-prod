import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date, location } = req.body;

  // 1. Validate inputs
  if (!date || !location) {
    return res.status(400).json({
      success: false,
      message: 'Both date and location are required.'
    });
  }

  if (!env.huggingfaceApiKey) {
    return res.status(500).json({ 
      success: false,
      message: 'Hugging Face API key is not configured' 
    });
  }

  // 2. Prepare the prompt for the AI
  const prompt = `You are a Hindu Panchanga assistant. Generate an accurate Panchanga for the following:
  Date: ${date}
  Location: ${location}

  Panchanga must include:
  - Day (weekday)
  - Tithi
  - Nakshatra
  - Yoga
  - Karana
  - Sunrise and Sunset
  - Rahu Kalam
  - Yamagandam
  - Gulika Kalam

  Start with a short spiritual message. Then display the Panchanga in a clean structured format using emojis. End with a short positive spiritual blessing.
  
  Response must be in plain text format but well-structured.`;

  try {
    // 3. Call HuggingFace Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.huggingfaceApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: `[INST] ${prompt} [/INST]`,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.3,
            return_full_text: false,
            do_sample: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HuggingFace API error:', response.status, errorData);
      
      if (response.status === 503) {
        return res.status(503).json({
          success: false,
          message: 'The AI service is currently warming up. Please try again in 30 seconds.'
        });
      }

      throw new Error(`AI service returned status ${response.status}`);
    }

    const result = await response.json();
    let generatedText = '';

    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || '';
    } else if (result.generated_text) {
      generatedText = result.generated_text;
    } else {
      throw new Error('Invalid response format from AI service');
    }

    // 4. Return success response
    res.json({
      success: true,
      data: generatedText.trim()
    });

  } catch (error) {
    console.error('Panchanga generation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Panchanga. Please try again later.',
      details: error.message
    });
  }
});
