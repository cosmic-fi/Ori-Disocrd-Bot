const { EmbedBuilder } = require('discord.js');
const { formatDuration } = require('../../utils/formatters');

module.exports = {
    name: 'nowplaying',
    description: 'Show current playing song',
    
    async execute(interaction, queue) {
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue || serverQueue.isEmpty()) {
            return interaction.reply('❌ There is no song playing!');
        }

        const song = serverQueue.getCurrentSong();
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('🎵 Now Playing')
            .setDescription(`**${song.title}**`)
            .setThumbnail(song.thumbnail)
            .addFields(
                { name: 'Duration', value: formatDuration(song.duration), inline: true },
                { name: 'Requested by', value: song.requester, inline: true },
                { name: 'Volume', value: `${Math.round(serverQueue.volume * 100)}%`, inline: true }
            )
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};