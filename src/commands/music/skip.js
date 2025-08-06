module.exports = {
    name: 'skip',
    description: 'Skip the current song',
    
    async execute(interaction, queue) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel to skip music!');
        }
        
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue) {
            return interaction.reply('❌ There is no song playing!');
        }

        serverQueue.player.stop();
        interaction.reply('⏭️ Song skipped!');
    }
};