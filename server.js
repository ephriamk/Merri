import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));

app.use(express.json({ limit: '10mb' }));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Animation generation endpoint
app.post('/api/generate-animation', async (req, res) => {
  try {
    console.log('Received animation request'); // Debug log
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Creating Anthropic client...'); // Debug log
    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    console.log('Sending request to Claude...'); // Debug log
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('Received response from Claude'); // Debug log
    const cssCode = message.content[0].text;
    
    if (!cssCode.includes('@keyframes')) {
      throw new Error('Invalid animation generated');
    }

    return res.status(200).json({
      content: [{
        text: cssCode
      }]
    });

  } catch (error) {
    console.error('Server error:', error); // Debug log
    res.status(500).json({ 
      error: 'Animation generation failed', 
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});