const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverstats',
    description: 'Show server statistics',
    
    async execute(interaction) {
        const guild = interaction.guild;
        
        // Fetch all members to get accurate counts
        await guild.members.fetch();
        
        const totalMembers = guild.memberCount;
        const humans = guild.members.cache.filter(member => !member.user.bot).size;
        const bots = guild.members.cache.filter(member => member.user.bot).size;
        const onlineMembers = guild.members.cache.filter(member => member.presence?.status !== 'offline').size;
        
        const textChannels = guild.channels.cache.filter(channel => channel.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 2).size;
        const categories = guild.channels.cache.filter(channel => channel.type === 4).size;
        
        const roles = guild.roles.cache.size - 1; // Exclude @everyone role
        const emojis = guild.emojis.cache.size;
        
        const createdAt = Math.floor(guild.createdTimestamp / 1000);
        const owner = await guild.fetchOwner();
        
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`📊 ${guild.name} Statistics`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👥 Members', value: `**Total:** ${totalMembers}\n**Humans:** ${humans}\n**Bots:** ${bots}\n**Online:** ${onlineMembers}`, inline: true },
                { name: '📝 Channels', value: `**Text:** ${textChannels}\n**Voice:** ${voiceChannels}\n**Categories:** ${categories}`, inline: true },
                { name: '🎭 Server Info', value: `**Roles:** ${roles}\n**Emojis:** ${emojis}\n**Boost Level:** ${guild.premiumTier}`, inline: true },
                { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
                { name: '📅 Created', value: `<t:${createdAt}:F>`, inline: true },
                { name: '🆔 Server ID', value: `${guild.id}`, inline: true }
            )
            .setFooter({ text: `Verification Level: ${guild.verificationLevel}` })
            .setTimestamp();
        
        if (guild.banner) {
            embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
        }
        
        interaction.reply({ embeds: [embed] });
    }
};