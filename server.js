const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Discord bot setup
const TOKEN = process.env.DISCORD_TOKEN;  // Use environment variable for the token
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

// Express web server setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());  // Middleware for parsing JSON requests

// Serve static files (optional)
app.use(express.static('public'));

// Simple API route to receive data from Discord bot
app.post('/api/members', (req, res) => {
  const memberData = req.body;
  console.log('Received member data:', memberData);
  res.status(200).json({ message: 'Member data received' });
});

// Discord bot event: When the bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Command to respond to !ping
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!ping')) {
    message.reply('Pong!');
  }
});

// Log the bot in using the Discord token
client.login(TOKEN);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
