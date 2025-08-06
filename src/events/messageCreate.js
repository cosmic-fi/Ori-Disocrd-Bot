const LevelingSystem = require('../utils/levelingSystem');
const { EmbedBuilder } = require('discord.js');

const levelingSystem = new LevelingSystem();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot || !message.guild) return;
        
        const result = levelingSystem.addXp(message.author.id, message.guild.id);
        
        if (result?.levelUp) {
            const embed = new EmbedBuilder()
                .setColor('#ffd700')
                .setTitle('🎉 Level Up!')
                .setDescription(`${message.author} reached level **${result.newLevel}**!`)
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp();
            
            message.channel.send({ embeds: [embed] });
        }
    },
};