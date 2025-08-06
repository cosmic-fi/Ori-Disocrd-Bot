const { EmbedBuilder } = require('discord.js');
const LevelingSystem = require('../../utils/levelingSystem');

const levelingSystem = new LevelingSystem();

module.exports = {
    name: 'leaderboard',
    description: 'Show the server leaderboard',
    options: [{
        name: 'limit',
        type: 4, // INTEGER
        description: 'Number of users to show (max 20)',
        required: false
    }],
    
    async execute(interaction) {
        const limit = Math.min(interaction.options.getInteger('limit') || 10, 20);
        const leaderboard = levelingSystem.getLeaderboard(interaction.guildId, limit);
        
        if (leaderboard.length === 0) {
            return interaction.reply('❌ No users found in the leaderboard!');
        }
        
        const leaderboardText = leaderboard.map((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            return `${medal} <@${user.userId}> - Level ${user.level} (${user.totalXp.toLocaleString()} XP)`;
        }).join('\n');
        
        const embed = new EmbedBuilder()
            .setColor('#ffd700')
            .setTitle('🏆 Server Leaderboard')
            .setDescription(leaderboardText)
            .setTimestamp();
        
        interaction.reply({ embeds: [embed] });
    }
};