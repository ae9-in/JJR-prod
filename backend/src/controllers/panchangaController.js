import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date } = req.body;

  // 1. Validate inputs
  if (!date) {
    return res.status(400).json({
      success: false,
      message: 'Date is required.'
    });
  }

  // Check keys
  const hfKey = env.huggingfaceApiKey ? env.huggingfaceApiKey.trim() : '';
  const vedikaKey = env.vedikaApiKey ? env.vedikaApiKey.trim() : '';

  if (!hfKey || !vedikaKey) {
    return res.status(500).json({ 
      success: false,
      message: 'Service API keys are not configured' 
    });
  }

  try {
    // 2. STEP 1: Call Vedika API for high-accuracy data
    // Bangalore defaults (12.97, 77.59)
    const vedikaUrl = `https://api.vedika.io/v1/panchang/daily?date=${date}&latitude=12.97&longitude=77.59`;
    
    console.log(`Calling Vedika API for date: ${date}`);
    const vedikaResponse = await fetch(vedikaUrl, {
      headers: {
        'x-api-key': vedikaKey,
        'Content-Type': 'application/json'
      }
    });

    if (!vedikaResponse.ok) {
      const vError = await vedikaResponse.text();
      console.error('Vedika API error:', vedikaResponse.status, vError);
      return res.status(500).json({
        success: false,
        message: 'Panchanga data error',
        details: vError
      });
    }

    const panchangaData = await vedikaResponse.json();

    // 3. STEP 2: Send data to Hugging Face for spiritual formatting
    const aiPrompt = `Format this Panchanga data in a clean, structured, spiritual way with a short blessing message at the beginning and end. Do not change any values.

Panchanga Data:
${JSON.stringify(panchangaData, null, 2)}`;

    try {
      console.log('Requesting AI formatting...');
      const hfResponse = await fetch(
        'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: `<|user|>\n${aiPrompt}</s>\n<|assistant|>`,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              return_full_text: false,
              do_sample: true
            }
          })
        }
      );

      if (!hfResponse.ok) {
        throw new Error(`AI Service returned ${hfResponse.status}`);
      }

      const hfResult = await hfResponse.json();
      let formattedText = '';
      
      if (Array.isArray(hfResult) && hfResult.length > 0) {
        formattedText = hfResult[0].generated_text || '';
      } else if (hfResult.generated_text) {
        formattedText = hfResult.generated_text;
      }

      return res.json({
        success: true,
        data: formattedText.trim()
      });

    } catch (aiError) {
      console.warn('AI Formatting failed, falling back to raw data:', aiError.message);
      // Fallback Step: If AI fails → return raw Vedika data
      return res.json({
        success: true,
        data: `🙏 (AI Formatting Unavailable)\n\n${JSON.stringify(panchangaData, null, 2)}\n\nMay this day bring you divine peace.`
      });
    }

  } catch (error) {
    console.error('Full process error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process Panchanga request.',
      details: error.message
    });
  }
});
