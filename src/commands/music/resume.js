module.exports = {
    name: 'resume',
    description: 'Resume the paused song',
    
    async execute(interaction, queue) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel!');
        }
        
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue || serverQueue.playing) {
            return interaction.reply('❌ Music is not paused!');
        }

        serverQueue.player.unpause();
        serverQueue.playing = true;
        interaction.reply('▶️ Music resumed!');
    }
};