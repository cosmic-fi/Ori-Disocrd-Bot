const { EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');
const MusicQueue = require('../../utils/musicQueue');
const MusicPlayer = require('../../utils/musicPlayer');
const { formatDuration } = require('../../utils/formatters');

module.exports = {
    name: 'play',
    description: 'Play a song',
    options: [{
        name: 'song',
        type: 3,
        description: 'Song name or YouTube URL',
        required: true
    }],
    
    async execute(interaction, queue) {
        // Defer immediately to prevent timeout
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.deferReply();
            }
        } catch (deferError) {
            console.error('Failed to defer reply:', deferError.message);
            // If defer fails, we need to use reply() instead of editReply()
        }
        
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return this.sendResponse(interaction, '❌ You need to be in a voice channel to play music!');
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return this.sendResponse(interaction, '❌ I need permissions to join and speak in your voice channel!');
        }

        const query = interaction.options.getString('song');

        try {
            let song;
            if (ytdl.validateURL(query)) {
                const songInfo = await ytdl.getInfo(query);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.lengthSeconds,
                    thumbnail: songInfo.videoDetails.thumbnails[0].url,
                    requester: interaction.user.tag
                };
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                };

                const video = await videoFinder(query);
                if (!video) {
                    return interaction.editReply('❌ No results found for your search!');
                }

                song = {
                    title: video.title,
                    url: video.url,
                    duration: video.duration.seconds,
                    thumbnail: video.thumbnail,
                    requester: interaction.user.tag
                };
            }

            let serverQueue = queue.get(interaction.guildId);
            
            if (!serverQueue) {
                const queueConstruct = new MusicQueue();
                queue.set(interaction.guildId, queueConstruct);
                serverQueue = queueConstruct;

                serverQueue.addSong(song);

                try {
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: interaction.guildId,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });

                    serverQueue.connection = connection;
                    serverQueue.player = createAudioPlayer();
                    connection.subscribe(serverQueue.player);

                    const musicPlayer = new MusicPlayer(queue);
                    musicPlayer.playSong(interaction.guildId, serverQueue.getCurrentSong());

                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('🎵 Now Playing')
                        .setDescription(`**${song.title}**`)
                        .setThumbnail(song.thumbnail)
                        .addFields(
                            { name: 'Duration', value: formatDuration(song.duration), inline: true },
                            { name: 'Requested by', value: song.requester, inline: true }
                        )
                        .setTimestamp();

                    interaction.editReply({ embeds: [embed] });
                } catch (error) {
                    console.error(error);
                    queue.delete(interaction.guildId);
                    return interaction.editReply('❌ There was an error connecting to the voice channel!');
                }
            } else {
                serverQueue.addSong(song);

                const embed = new EmbedBuilder()
                    .setColor('#ffff00')
                    .setTitle('📝 Added to Queue')
                    .setDescription(`**${song.title}**`)
                    .setThumbnail(song.thumbnail)
                    .addFields(
                        { name: 'Position in queue', value: `${serverQueue.getQueueLength()}`, inline: true },
                        { name: 'Duration', value: formatDuration(song.duration), inline: true },
                        { name: 'Requested by', value: song.requester, inline: true }
                    )
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ There was an error playing this song!');
        }
    },
    sendResponse(interaction, content) {
        try {
            if (interaction.deferred && !interaction.replied) {
                return interaction.editReply(content);
            } else if (!interaction.replied && !interaction.deferred) {
                return interaction.reply(content);
            }
        } catch (error) {
            console.error('Failed to send response:', error.message);
        }
    }
};