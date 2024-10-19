const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord bot setup
const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the public folder (for your dashboard front-end)
app.use(express.static('public'));

let storedRoles = [];

// API route to store roles sent from the Discord bot
app.post('/api/roles', (req, res) => {
  storedRoles = req.body.roles;
  console.log('Received and stored roles:', storedRoles);
  res.status(200).json({ message: 'Roles received and stored successfully' });
});

// API route to retrieve the stored roles and send them to the front-end
app.get('/api/roles', (req, res) => {
  res.status(200).json({ roles: storedRoles });
});

// Function to fetch all roles from the Discord server and send them to the web server
function sendRolesToWebServer() {
  const guild = client.guilds.cache.first();
  
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
  sendRolesToWebServer();
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
