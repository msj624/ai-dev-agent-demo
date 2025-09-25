const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const app = express();
const morgan = require('morgan'); // Import morgan for logging
const port = 3000;

app.use(morgan('combined')); // Use morgan middleware for logging

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
    try {
        console.log('Incoming request:', req.body); // Log incoming request
        const { message } = req.body;

        if (!message) {
            const error = new Error('Message is required');
            error.status = 400;
            throw error;
        }

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = response.data.choices[0].message.content;
        console.log('OpenAI response:', reply); // Log OpenAI response
        res.send({ reply });
    } catch (error) {
        next(error); // Pass the error to the global error handler
    }
});

/**
 * Global error-handling middleware
 * Catches unhandled errors and sends a proper response
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message); // Log the error
    res.status(err.status || 500).send({
        error: err.message || 'Internal Server Error',
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
