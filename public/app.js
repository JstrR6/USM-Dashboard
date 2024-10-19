const axios = require('axios');

// Function to fetch all roles and send them to the web server
function sendRolesToWebServer() {
  const guild = client.guilds.cache.first(); // Use the first guild/server the bot is connected to
  
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
  axios.post('https://your-app-name.onrender.com/api/roles', { roles })
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

  // Send the roles after bot starts
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
