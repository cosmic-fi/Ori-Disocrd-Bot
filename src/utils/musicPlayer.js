const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

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
            const stream = ytdl(song.url, { 
                filter: 'audioonly', 
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            });
            const resource = createAudioResource(stream, { inlineVolume: true });
            
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