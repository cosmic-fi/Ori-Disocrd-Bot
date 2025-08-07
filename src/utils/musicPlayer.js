const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { stream } = require('play-dl');

class MusicPlayer {
    constructor(queue) {
        this.queue = queue;
    }

    async playSong(guildId, song) {
        const serverQueue = this.queue.get(guildId);
        if (!song || !serverQueue) {
            // Check if serverQueue exists before accessing connection
            if (serverQueue && serverQueue.connection) {
                serverQueue.connection.destroy();
            }
            this.queue.delete(guildId);
            return;
        }

        try {
            // Use play-dl's stream function
            const streamData = await stream(song.url, {
                quality: 2 // 0 = lowest, 1 = medium, 2 = highest
            });
            
            const resource = createAudioResource(streamData.stream, { 
                inputType: streamData.type,
                inlineVolume: true 
            });
            
            if (resource.volume) {
                resource.volume.setVolume(serverQueue.volume);
            }

            serverQueue.player.play(resource);
            serverQueue.playing = true;

            // Remove previous listeners to prevent memory leaks
            serverQueue.player.removeAllListeners(AudioPlayerStatus.Idle);
            serverQueue.player.removeAllListeners('error');

            serverQueue.player.on(AudioPlayerStatus.Idle, () => {
                const nextSong = serverQueue.getNextSong();
                this.playSong(guildId, nextSong);
            });

            serverQueue.player.on('error', error => {
                console.error('Audio player error:', error);
                // Skip to next song on error
                const nextSong = serverQueue.getNextSong();
                this.playSong(guildId, nextSong);
            });
        } catch (error) {
            console.error('Error playing song:', error);
            // Skip to next song on error
            const nextSong = serverQueue.getNextSong();
            this.playSong(guildId, nextSong);
        }
    }
}

module.exports = MusicPlayer;