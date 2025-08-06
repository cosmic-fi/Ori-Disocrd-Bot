module.exports = {
    name: 'pause',
    description: 'Pause the current song',
    
    async execute(interaction, queue) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel!');
        }
        
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue || !serverQueue.playing) {
            return interaction.reply('❌ There is no song playing!');
        }

        serverQueue.player.pause();
        serverQueue.playing = false;
        interaction.reply('⏸️ Music paused!');
    }
};