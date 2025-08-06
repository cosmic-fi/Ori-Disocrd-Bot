class MusicQueue {
    constructor() {
        this.songs = [];
        this.volume = 0.5;
        this.playing = false;
        this.connection = null;
        this.player = null;
    }

    addSong(song) {
        this.songs.push(song);
    }

    getNextSong() {
        return this.songs.shift();
    }

    getCurrentSong() {
        return this.songs[0];
    }

    clear() {
        this.songs = [];
    }

    isEmpty() {
        return this.songs.length === 0;
    }

    getQueueLength() {
        return this.songs.length;
    }
}

module.exports = MusicQueue;