module.exports = {
    name: 'interactionCreate',
    async execute(interaction, commandHandler, queue) {
        if (!interaction.isChatInputCommand()) return;

        const command = commandHandler.getCommand(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction, queue);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            
            const errorMessage = '❌ There was an error while executing this command!';
            
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply(errorMessage);
                } else if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: errorMessage, flags: 64 }); // ephemeral
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError.message);
            }
        }
    },
};