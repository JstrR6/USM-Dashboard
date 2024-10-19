const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.DISCORD_TOKEN;

// Discord bot setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let storedRoles = []; // To store roles sent by the bot

// API to receive roles from Discord bot and store them
app.post('/api/roles', (req, res) => {
  storedRoles = req.body.roles;
  console.log('Received and stored roles:', storedRoles);
  res.status(200).json({ message: 'Roles received and stored successfully' });
});

// API to send stored roles to the front-end
app.get('/api/roles', (req, res) => {
  res.status(200).json({ roles: storedRoles });
});

// Catch-all route to serve the index.html for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Function to fetch all roles and send them to the web server
function sendRolesToWebServer() {
  const guild = client.guilds.cache.first(); // Ensure the bot is connected to the correct guild
  
  if (!guild) {
    console.log("The bot is not connected to any guild.");
    return;
  }

  // Get all roles in the guild
  const roles = guild.roles.cache.map(role => ({
    id: role.id,
    name: role.name,
    color: role.color,
    position: role.position
  }));

  console.log('Sending roles to the server:', roles); // Log the roles before sending

  // Send the roles to the web server via a POST request
  axios.post('https://usm-dashboard.onrender.com/api/roles', { roles })
    .then(response => {
      console.log('Roles sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending roles:', error);
    });
}

// When the bot is ready, fetch the roles and send them to the web server
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  sendRolesToWebServer(); // Send roles when the bot is ready

  // Automatically send roles every 10 minutes (600,000 milliseconds)
  setInterval(() => {
    sendRolesToWebServer();
  }, 60);
});

// Command to manually trigger sending roles to the web server
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === '!sendroles') {
    sendRolesToWebServer();
    message.reply('Roles have been sent to the web server!');
  }
});

// Log the bot into Discord using the token
client.login(TOKEN);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
