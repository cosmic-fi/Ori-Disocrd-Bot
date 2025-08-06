module.exports = {
    name: 'volume',
    description: 'Set the volume',
    options: [{
        name: 'level',
        type: 4,
        description: 'Volume level (0-100)',
        required: true
    }],
    
    async execute(interaction, queue) {
        if (!interaction.member.voice.channel) {
            return interaction.reply('❌ You need to be in a voice channel!');
        }
        
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue) {
            return interaction.reply('❌ There is no song playing!');
        }

        const volume = interaction.options.getInteger('level');
        if (volume < 0 || volume > 100) {
            return interaction.reply('❌ Volume must be between 0 and 100!');
        }

        serverQueue.volume = volume / 100;
        interaction.reply(`🔊 Volume set to ${volume}%`);
    }
};