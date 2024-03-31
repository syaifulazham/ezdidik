const express = require('express');
const app = express();
require('dotenv').config();
const axios = require('axios');

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware to parse JSON and form-data requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JavaScript, images)
app.use(express.static('public'));

// Route for the homepage
app.get('/', (req, res) => {
    res.render('index');
});


// Route to handle chat messages
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",  // Use the appropriate model for your application
            messages: [{
                role: "user",
                content: userMessage
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const botReply = response.data.choices[0].message.content;
        res.json({ message: botReply });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Error processing the request');
    }
});

// Start the server
const PORT = process.env.PORT || 3055;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
