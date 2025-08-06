const { REST, Routes } = require('discord.js');
const CommandHandler = require('./src/handlers/commandHandler');
require('dotenv').config();

const commandHandler = new CommandHandler();
const commands = commandHandler.getAllCommands().map(command => ({
    name: command.name,
    description: command.description,
    options: command.options || []
}));

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();