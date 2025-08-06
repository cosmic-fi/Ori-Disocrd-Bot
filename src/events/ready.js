module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`🎵 ${client.user.tag} is online and ready to play music!`);
        client.user.setActivity('🎵 Music | /help', { type: 'LISTENING' });
    },
};