import { asyncHandler } from '../middleware/asyncHandler.js';
import { env } from '../config/env.js';

const SYSTEM_PROMPT = `You are a Hindu Panchanga assistant.

Your goal is to generate accurate Panchanga with MINIMUM questions, while maintaining a spiritual and engaging user experience.

Rules for interaction:
- Ask only what is absolutely necessary.
- Required inputs: 1. Date 2. Location (city or place)

Flow:
- If user asks for Panchanga:
  → If date is missing, ask: "Please provide the date."
  → If location is missing, ask: "Please provide your city."
- Once BOTH date and location are available:
  → Immediately generate Panchanga
  → Do NOT ask any more questions

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

Output Format:
Start with a short spiritual message (1–2 lines max).

Then display Panchanga in a clean structured format:

📅 Date: {date} ({day})

🪔 Tithi: {tithi}
🌙 Nakshatra: {nakshatra}
🧘 Yoga: {yoga}
🔱 Karana: {karana}

🌅 Sunrise: {sunrise}
🌇 Sunset: {sunset}

⏳ Rahu Kalam: {rahuKalam}
⏳ Yamagandam: {yamagandam}
⏳ Gulika Kalam: {gulikaKalam}

End with a short positive spiritual closing line.

Response style:
- Clean, structured, and similar to traditional Panchanga (like Drik Panchang format)
- No long explanations unless asked
- Spiritual, calm, and respectful tone

Strict rules:
- Never ask more than 2 questions total
- Never ask irrelevant questions
- Never delay response once inputs are given
- If user gives both date and location in one message → respond immediately

Accuracy rules:
- Try to generate Panchanga as close as possible to traditional standards (like Drik Panchang format)
- Do NOT invent unrealistic values
- If exact timings are uncertain, clearly mention: "Timings are approximate."

Fallback:
- If user gives only date → ask for location
- If user gives only location → ask for date`;

export const generatePanchanga = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!env.huggingfaceApiKey) {
    return res.status(500).json({ error: 'Hugging Face API key is not configured' });
  }

  // Build conversation messages
  const conversationMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  try {
    // Use HuggingFace Inference API with a chat model
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.huggingfaceApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: formatPromptForMistral(conversationMessages),
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

      // If model is loading, return a friendly message
      if (response.status === 503) {
        return res.json({
          reply: '🙏 The Panchanga service is warming up. Please try again in a moment.',
          loading: true
        });
      }

      throw new Error(`HuggingFace API returned ${response.status}`);
    }

    const data = await response.json();
    let reply = '';

    if (Array.isArray(data) && data.length > 0) {
      reply = data[0].generated_text || '';
    } else if (data.generated_text) {
      reply = data.generated_text;
    } else {
      reply = '🙏 I could not generate the Panchanga at this time. Please try again.';
    }

    // Clean up the reply
    reply = reply.trim();
    // Remove any trailing artifacts from the model
    const endIdx = reply.lastIndexOf('✨');
    if (endIdx === -1) {
      const prayerIdx = reply.lastIndexOf('🙏');
      if (prayerIdx > reply.length * 0.7) {
        reply = reply.substring(0, reply.indexOf('\n', prayerIdx) + 1 || reply.length).trim();
      }
    }

    res.json({ reply });
  } catch (error) {
    console.error('Panchanga generation error:', error.message);
    res.status(500).json({
      error: 'Failed to generate Panchanga. Please try again later.',
      details: error.message
    });
  }
});

// Format messages into Mistral instruct format
function formatPromptForMistral(messages) {
  let prompt = '';
  const systemMsg = messages.find(m => m.role === 'system');
  const otherMsgs = messages.filter(m => m.role !== 'system');

  for (let i = 0; i < otherMsgs.length; i++) {
    const msg = otherMsgs[i];
    if (msg.role === 'user') {
      let userContent = msg.content;
      // Prepend system prompt to the first user message
      if (i === 0 && systemMsg) {
        userContent = `${systemMsg.content}\n\nUser query: ${userContent}`;
      }
      prompt += `[INST] ${userContent} [/INST]`;
    } else if (msg.role === 'assistant') {
      prompt += ` ${msg.content} `;
    }
  }

  return prompt;
}
