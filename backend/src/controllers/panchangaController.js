import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required.' });
  }

  const hfKey = env.huggingfaceApiKey ? env.huggingfaceApiKey.trim() : '';
  const vedikaKey = env.vedikaApiKey ? env.vedikaApiKey.trim() : '';

  let finalPanchangaData = null;
  let isAiEstimation = false;

  try {
    // 1. TRY VEDIKA FIRST (Accuracy)
    const vedikaUrl = `https://api.vedika.io/v1/panchang/daily?date=${date}&latitude=12.97&longitude=77.59`;
    
    const vedikaResponse = await fetch(vedikaUrl, {
      headers: {
        'x-api-key': vedikaKey,
        'Content-Type': 'application/json',
        'User-Agent': 'JJR-Storefront/1.0'
      }
    });

    if (vedikaResponse.ok) {
      finalPanchangaData = await vedikaResponse.json();
    } else {
      const vError = await vedikaResponse.text();
      console.warn('Vedika API unavailable, will attempt AI estimation:', vError);
      isAiEstimation = true;
    }
  } catch (error) {
    console.warn('Vedika request failed:', error.message);
    isAiEstimation = true;
  }

  // 2. AI FORMATTING / ESTIMATION
  const aiPrompt = isAiEstimation 
    ? `Estimate the Hindu Panchanga details (Tithi, Nakshatra, Yoga, Karana, etc.) for Date: ${date} in Bangalore. 
       Format it in a clean, spiritual way with blessings.`
    : `Format this Panchanga data in a clean, structured, spiritual way with blessings. 
       Do not change values: ${JSON.stringify(finalPanchangaData, null, 2)}`;

  try {
    // Use the OpenAI-compatible endpoint for HuggingFace (more stable)
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'JJR-Storefront/1.0'
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.3', // Highly reliable on this endpoint
          messages: [{ role: 'user', content: aiPrompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      }
    );

    if (!hfResponse.ok) {
      const hfErr = await hfResponse.text();
      if (hfResponse.status === 503) {
        return res.json({
          success: true,
          data: isAiEstimation 
            ? "🙏 Estimating Panchanga... (AI is warming up, please try in 30 seconds)" 
            : `🙏 ${JSON.stringify(finalPanchangaData, null, 2)}`
        });
      }
      throw new Error(`AI Service error: ${hfErr}`);
    }

    const hfResult = await hfResponse.json();
    const formattedText = hfResult.choices?.[0]?.message?.content || '';

    return res.json({
      success: true,
      data: formattedText.trim() + (isAiEstimation ? '\n\n*(Estimated by AI - Top up Vedika for high accuracy)*' : '')
    });

  } catch (aiError) {
    console.error('Final stage error:', aiError.message);
    return res.json({
      success: true,
      data: finalPanchangaData 
        ? `🙏 (Data Ready, Formatting Error)\n\n${JSON.stringify(finalPanchangaData, null, 2)}` 
        : `🙏 Unable to generate Panchanga at this moment. Please check your Vedika credits.`
    });
  }
});
