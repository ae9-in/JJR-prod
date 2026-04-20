import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required.' });
  }

  const hfKey = env.huggingfaceApiKey ? env.huggingfaceApiKey.trim() : '';

  if (!hfKey) {
    return res.status(500).json({ 
      success: false,
      message: 'Hugging Face API key is not configured' 
    });
  }

  // Pure AI Generation Prompt
  const aiPrompt = `You are a Hindu Panchanga assistant. Generate an accurate Daily Panchanga for the following:
  Date: ${date}
  Location: Bangalore, India

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
  
  Format the response specifically for a high-end spiritual storefront. Response must be in plain text but beautifully structured.`;

  try {
    const hfResponse = await fetch(
      `https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'JJR-Storefront/1.0'
        },
        body: JSON.stringify({
          inputs: `<|user|>\n${aiPrompt}</s>\n<|assistant|>\n`,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    if (!hfResponse.ok) {
      const hfErr = await hfResponse.text();
      // Handle model loading/warming up
      if (hfResponse.status === 503) {
        return res.json({
          success: true,
          data: "🙏 The AI is warming up. Please try again in 30 seconds."
        });
      }
      return res.status(500).json({ 
        success: false, 
        message: 'AI Service Error', 
        details: hfErr 
      });
    }

    const hfResult = await hfResponse.json();
    let formattedText = '';
    
    if (Array.isArray(hfResult) && hfResult.length > 0) {
      formattedText = hfResult[0].generated_text || hfResult[0].summary_text || '';
    } else {
      formattedText = hfResult.generated_text || '';
    }

    if (!formattedText) {
      throw new Error("AI returned an empty response.");
    }

    return res.json({
      success: true,
      data: formattedText.trim()
    });

  } catch (error) {
    console.error('Panchanga Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Panchanga.',
      details: error.message
    });
  }
});
