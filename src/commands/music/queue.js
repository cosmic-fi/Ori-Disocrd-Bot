const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Show the current queue',
    
    async execute(interaction, queue) {
        const serverQueue = queue.get(interaction.guildId);
        if (!serverQueue || serverQueue.isEmpty()) {
            return interaction.reply('❌ The queue is empty!');
        }

        const queueList = serverQueue.songs.slice(0, 10).map((song, index) => {
            return `${index === 0 ? '🎵 **Now Playing:**' : `${index}.`} ${song.title} - *${song.requester}*`;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📝 Music Queue')
            .setDescription(queueList)
            .addFields(
                { name: 'Total Songs', value: `${serverQueue.getQueueLength()}`, inline: true },
                { name: 'Volume', value: `${Math.round(serverQueue.volume * 100)}%`, inline: true }
            )
            .setTimestamp();

        if (serverQueue.getQueueLength() > 10) {
            embed.setFooter({ text: `And ${serverQueue.getQueueLength() - 10} more songs...` });
        }

        interaction.reply({ embeds: [embed] });
    }
};