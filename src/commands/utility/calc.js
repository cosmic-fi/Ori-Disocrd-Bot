const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'calc',
    description: 'Calculate mathematical expressions',
    options: [{
        name: 'expression',
        type: 3, // STRING
        description: 'Mathematical expression to calculate',
        required: true
    }],
    
    async execute(interaction) {
        const expression = interaction.options.getString('expression');
        
        // Security: Only allow safe mathematical operations
        const safeExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
        
        if (!safeExpression || safeExpression !== expression) {
            return interaction.reply('❌ Invalid expression! Only numbers and basic operators (+, -, *, /, parentheses) are allowed.');
        }
        
        try {
            // Use Function constructor for safe evaluation
            const result = Function(`"use strict"; return (${safeExpression})`)();
            
            if (!isFinite(result)) {
                return interaction.reply('❌ Result is not a finite number!');
            }
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🧮 Calculator')
                .addFields(
                    { name: 'Expression', value: `\`\`\`${expression}\`\`\``, inline: false },
                    { name: 'Result', value: `\`\`\`${result}\`\`\``, inline: false }
                )
                .setTimestamp();
            
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            interaction.reply('❌ Invalid mathematical expression!');
        }
    }
};