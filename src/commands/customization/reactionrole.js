const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

class ReactionRoleManager {
    constructor() {
        this.dataPath = path.join(__dirname, '../../../data/reactionRoles.json');
        this.ensureDataFile();
        this.reactionRoles = this.loadData();
    }

    ensureDataFile() {
        const dataDir = path.dirname(this.dataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(this.dataPath)) {
            fs.writeFileSync(this.dataPath, JSON.stringify({}));
        }
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    saveData() {
        fs.writeFileSync(this.dataPath, JSON.stringify(this.reactionRoles, null, 2));
    }

    addReactionRole(messageId, emoji, roleId) {
        if (!this.reactionRoles[messageId]) {
            this.reactionRoles[messageId] = {};
        }
        this.reactionRoles[messageId][emoji] = roleId;
        this.saveData();
    }

    removeReactionRole(messageId, emoji) {
        if (this.reactionRoles[messageId]) {
            delete this.reactionRoles[messageId][emoji];
            if (Object.keys(this.reactionRoles[messageId]).length === 0) {
                delete this.reactionRoles[messageId];
            }
            this.saveData();
        }
    }

    getReactionRole(messageId, emoji) {
        return this.reactionRoles[messageId]?.[emoji];
    }
}

const reactionRoleManager = new ReactionRoleManager();

module.exports = {
    name: 'reactionrole',
    description: 'Manage reaction roles',
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    options: [
        {
            name: 'add',
            type: 1, // SUB_COMMAND
            description: 'Add a reaction role',
            options: [
                {
                    name: 'message_id',
                    type: 3, // STRING
                    description: 'Message ID to add reaction role to',
                    required: true
                },
                {
                    name: 'emoji',
                    type: 3, // STRING
                    description: 'Emoji for the reaction',
                    required: true
                },
                {
                    name: 'role',
                    type: 8, // ROLE
                    description: 'Role to assign',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            type: 1, // SUB_COMMAND
            description: 'Remove a reaction role',
            options: [
                {
                    name: 'message_id',
                    type: 3, // STRING
                    description: 'Message ID to remove reaction role from',
                    required: true
                },
                {
                    name: 'emoji',
                    type: 3, // STRING
                    description: 'Emoji to remove',
                    required: true
                }
            ]
        },
        {
            name: 'create',
            type: 1, // SUB_COMMAND
            description: 'Create a reaction role message',
            options: [
                {
                    name: 'title',
                    type: 3, // STRING
                    description: 'Title for the reaction role message',
                    required: true
                },
                {
                    name: 'description',
                    type: 3, // STRING
                    description: 'Description for the reaction role message',
                    required: true
                }
            ]
        }
    ],
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'add') {
            const messageId = interaction.options.getString('message_id');
            const emoji = interaction.options.getString('emoji');
            const role = interaction.options.getRole('role');
            
            try {
                const message = await interaction.channel.messages.fetch(messageId);
                await message.react(emoji);
                
                reactionRoleManager.addReactionRole(messageId, emoji, role.id);
                
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Reaction Role Added')
                    .setDescription(`Added ${emoji} → ${role} to message ${messageId}`)
                    .setTimestamp();
                
                interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (error) {
                interaction.reply({ content: '❌ Failed to add reaction role. Make sure the message ID is valid and I can react with that emoji.', ephemeral: true });
            }
        }
        
        else if (subcommand === 'remove') {
            const messageId = interaction.options.getString('message_id');
            const emoji = interaction.options.getString('emoji');
            
            reactionRoleManager.removeReactionRole(messageId, emoji);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🗑️ Reaction Role Removed')
                .setDescription(`Removed ${emoji} from message ${messageId}`)
                .setTimestamp();
            
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        else if (subcommand === 'create') {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: 'React below to get roles!' })
                .setTimestamp();
            
            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            
            const successEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Reaction Role Message Created')
                .setDescription(`Message ID: ${message.id}\nUse \`/reactionrole add\` to add reaction roles to this message.`)
                .setTimestamp();
            
            interaction.followUp({ embeds: [successEmbed], ephemeral: true });
        }
    },
    
    // Export the manager for use in events
    reactionRoleManager
};