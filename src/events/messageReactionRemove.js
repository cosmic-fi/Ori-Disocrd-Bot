const { reactionRoleManager } = require('../commands/customization/reactionrole');

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user) {
        if (user.bot) return;
        
        // Handle partial reactions
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the reaction:', error);
                return;
            }
        }
        
        const emoji = reaction.emoji.name;
        const roleId = reactionRoleManager.getReactionRole(reaction.message.id, emoji);
        
        if (roleId) {
            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(roleId);
            
            if (role && member.roles.cache.has(roleId)) {
                try {
                    await member.roles.remove(role);
                    console.log(`Removed role ${role.name} from ${user.tag}`);
                } catch (error) {
                    console.error('Error removing role:', error);
                }
            }
        }
    },
};