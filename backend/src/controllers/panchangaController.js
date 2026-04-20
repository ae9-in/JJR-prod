import axios from 'axios';
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
    const hfUrl = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
    console.log(`[Panchanga] Requesting AI from: ${hfUrl}`);

    const hfResponse = await axios.post(
      hfUrl,
      {
        inputs: `<|user|>\n${aiPrompt}</s>\n<|assistant|>\n`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'JJR-Storefront/1.0'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const hfResult = hfResponse.data;
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
    // Check if it's an Axios error with a response
    if (error.response) {
      const hfErrStatus = error.response.status;
      const hfErrData = error.response.data;

      if (hfErrStatus === 503) {
        return res.json({
          success: true,
          data: "🙏 The AI is warming up. Please try again in 30 seconds."
        });
      }

      console.error(`[Panchanga] AI Service Error (${hfErrStatus}):`, hfErrData);
      return res.status(500).json({ 
        success: false, 
        message: 'AI Service Error', 
        details: typeof hfErrData === 'string' ? hfErrData : JSON.stringify(hfErrData)
      });
    }

    console.error('[Panchanga] Internal Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Panchanga.',
      details: error.message,
      debug: {
        pid: process.pid,
        cwd: process.cwd(),
        nodeVersion: process.version
      }
    });
  }
});
