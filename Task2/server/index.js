require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const fetch = require('node-fetch');
const Review = require('./models/Review');
const { getFeedbackPrompt } = require('./prompts/feedbackPrompt');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://feedbackloop-ai.netlify.app",
  "http://localhost:5000",
  "https://majestic-strudel-9d7023.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const getCleanKey = () => {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return '';
  // Remove quotes and whitespace
  return key.replace(/^["']|["']$/g, '').trim();
};

async function generateAIResponse(rating, reviewText) {

  const apiKey = getCleanKey();

  if (!apiKey) {
    console.error("Missing OPENROUTER_API_KEY environment variable");
    return {
      userResponse: "AI service temporarily unavailable.",
      adminSummary: "Missing API Key configuration",
      adminAction: "Check server environment variables"
    };
  }

  if (!reviewText || reviewText.trim().length === 0) {
    return {
      userResponse: "Thank you for your rating. If you have a moment, we'd love to hear more details about your experience.",
      adminSummary: "Insufficient feedback provided",
      adminAction: "Request clarification"
    };
  }

  try {
    const prompt = getFeedbackPrompt(rating, reviewText);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Referer": "https://feedbackloop-ai.netlify.app", // Standard Referer
        "HTTP-Referer": "https://feedbackloop-ai.netlify.app", // OpenRouter specific
        "X-Title": "FeedbackLoop AI"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct", // Corrected Model ID
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter Response Error:", response.status, errorText);
      throw new Error(`OpenRouter API refused request: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(JSON.stringify(data.error));
    }

    const text = data.choices[0].message.content;

    const parsed = JSON.parse(text);
    return parsed;

  } catch (err) {
    console.error("OpenRouter/AI failed:", err.message);
    return {
      userResponse: "Thank you for your feedback. We appreciate you taking the time to share your experience.",
      adminSummary: "AI processing failed",
      adminAction: "Manual review required"
    };
  }
}


app.post('/api/reviews', async (req, res) => {
  try {
    const { rating, text } = req.body;

    const aiResult = await generateAIResponse(rating, text);

    const newReview = new Review({
      rating,
      text,
      aiResponse: aiResult.userResponse,
      aiSummary: aiResult.adminSummary,
      aiAction: aiResult.adminAction
    });

    await newReview.save();
    res.status(201).json({
      aiResponse: aiResult.userResponse
    });

  } catch (error) {
    console.error("Detailed Server Error:", error);
    res.status(500).json({ error: error.message || 'Server error', details: error.toString() });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
