const { reactionRoleManager } = require('../commands/customization/reactionrole');

module.exports = {
    name: 'messageReactionAdd',
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
            
            if (!role) {
                console.error(`Role with ID ${roleId} not found in guild ${guild.name}`);
                return;
            }
            
            if (!member.roles.cache.has(roleId)) {
                try {
                    // Check if bot has permission to manage this role
                    const botMember = guild.members.me;
                    if (!botMember.permissions.has('ManageRoles')) {
                        console.error('Bot lacks MANAGE_ROLES permission');
                        return;
                    }
                    
                    if (role.position >= botMember.roles.highest.position) {
                        console.error(`Cannot manage role ${role.name} - role is higher than bot's highest role`);
                        return;
                    }
                    
                    await member.roles.add(role);
                    console.log(`✅ Added role ${role.name} to ${user.tag}`);
                } catch (error) {
                    console.error(`❌ Error adding role ${role.name} to ${user.tag}:`, error.message);
                    
                    // Provide specific error messages
                    if (error.code === 50013) {
                        console.error('💡 Solution: Ensure bot has "Manage Roles" permission and bot role is above target role');
                    }
                }
            }
        }
    },
};