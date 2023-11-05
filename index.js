const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 8443;

// Telegram Bot setup
const botToken = '6331212716:AAFS00txsq8QUekwNi7NFP0y1s5dGUScMH8';
const bot = new TelegramBot(botToken, { polling: true });

// Store incoming messages in an array (use a database for production)
const messages = [];

// Serve the HTML file
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Telegram Bot Messages</title>
        </head>
        <body>
            <h1>Telegram Bot Messages</h1>
            <div id="messages"></div>

            <script>
                const messagesDiv = document.getElementById('messages');

                // Function to display incoming messages
                function displayMessage(message) {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = message;
                    messagesDiv.appendChild(messageElement);
                }

                // Fetch messages from the server
                fetch('/getMessages')
                    .then(response => response.json())
                    .then(data => {
                        data.messages.forEach(message => {
                            displayMessage(message);
                        });
                    });
            </script>
        </body>
        </html>
    `);
});

// Provide messages to the front end
app.get('/getMessages', (req, res) => {
    res.json({ messages });
});

// Handle incoming messages from the bot
bot.on('text', (msg) => {
    const message = msg.text;
    messages.push(message);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
