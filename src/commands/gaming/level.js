const { EmbedBuilder } = require('discord.js');
const LevelingSystem = require('../../utils/levelingSystem');

const levelingSystem = new LevelingSystem();

module.exports = {
    name: 'level',
    description: 'Check your or someone else\'s level',
    options: [{
        name: 'user',
        type: 6, // USER
        description: 'User to check level for',
        required: false
    }],
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userData = levelingSystem.getUser(targetUser.id, interaction.guildId);
        
        const xpForNext = levelingSystem.getXpForNextLevel(userData.level);
        const xpProgress = userData.totalXp - levelingSystem.getXpForLevel(userData.level);
        const xpNeeded = xpForNext - levelingSystem.getXpForLevel(userData.level);
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`📊 ${targetUser.username}'s Level`)
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: 'Level', value: `${userData.level}`, inline: true },
                { name: 'Total XP', value: `${userData.totalXp.toLocaleString()}`, inline: true },
                { name: 'Progress', value: `${xpProgress}/${xpNeeded} XP`, inline: true }
            )
            .setFooter({ text: `${Math.round((xpProgress / xpNeeded) * 100)}% to next level` })
            .setTimestamp();
        
        interaction.reply({ embeds: [embed] });
    }
};