const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show help message',
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🤖 Discord Bot Commands')
            .setDescription('Here are all available commands organized by category:')
            .addFields(
                {
                    name: '🎵 **Music Commands**',
                    value: '`/play <song>` - Play a song or add it to queue\n' +
                           '`/skip` - Skip the current song\n' +
                           '`/stop` - Stop music and clear queue\n' +
                           '`/pause` - Pause the current song\n' +
                           '`/resume` - Resume the paused song\n' +
                           '`/queue` - Show the current queue\n' +
                           '`/volume <0-100>` - Set the volume\n' +
                           '`/nowplaying` - Show current playing song',
                    inline: false
                },
                {
                    name: '🎮 **Gaming & Entertainment**',
                    value: '`/level [user]` - Check your or another user\'s level and XP\n' +
                           '`/leaderboard` - Show the server XP leaderboard',
                    inline: false
                },
                {
                    name: '🔧 **Utility Commands**',
                    value: '`/calc <expression>` - Calculate mathematical expressions\n' +
                           '`/serverstats` - Show detailed server statistics',
                    inline: false
                },
                {
                    name: '🎨 **Customization**',
                    value: '`/reactionrole <message_id> <emoji> <role>` - Set up reaction roles',
                    inline: false
                },
                {
                    name: '❓ **General**',
                    value: '`/help` - Show this help message',
                    inline: false
                }
            )
            .setFooter({ text: 'Enjoy using the bot! 🎵🎮🔧' })
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};