const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in environment variables
});
const openai = new OpenAIApi(configuration);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Chat route
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send({ error: 'Message is required' });
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = response.data.choices[0].message.content;
        res.send({ reply });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        res.status(500).send({ error: 'Failed to process the request' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
