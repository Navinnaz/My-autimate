//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
//llama3-70b-8192

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Store your Groq API Key securely
const GROQ_API_KEY = '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';

// Middlewares
app.use(cors());
app.use(express.json());

// Home route (for browser GET request)
app.get('/', (req, res) => {
  res.send('Welcome to the Autimate AI Chatbot Server! 🚀');
});

// Route to handle chatbot communication
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a calm, gentle, and emotionally supportive friend. Always reply with kindness, validation, and encouragement. Use simple, soft words. Your goal is to make the user feel safe, understood, and happy."
        },
        { 
          role: "user", 
          content: userMessage 
        }
      ],
      temperature: 0.5
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content;
    res.json({ reply: botMessage });

  } catch (error) {
    console.error('Error communicating with Groq API:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
