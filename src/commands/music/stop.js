module.exports = {
    name: 'stop',
    description: 'Stop music and clear queue',
    
    async execute(interaction, queue) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel to stop music!');
        }
        
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue) {
            return interaction.reply('❌ There is no song playing!');
        }

        serverQueue.clear();
        serverQueue.player.stop();
        interaction.reply('⏹️ Music stopped and queue cleared!');
    }
};