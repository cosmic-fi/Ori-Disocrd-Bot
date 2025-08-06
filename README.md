# Discord Music Bot (MB)

A feature-rich Discord bot with music playback, leveling system, and reaction roles.

## Features

### 🎵 Music System
- Play music from YouTube (URLs or search)
- Queue management (add, skip, stop, pause, resume)
- Volume control
- Now playing information
- Auto-disconnect when queue is empty

### 📈 Leveling System
- XP gain from messages (15-30 XP per message)
- Level up notifications
- User level checking (`/level`)
- Server leaderboard (`/leaderboard`)
- 1-minute cooldown between XP gains

### 🎭 Reaction Roles
- Assign roles via message reactions
- Easy setup with `/reactionrole` command
- Automatic role management

### 🛠️ Utility Commands
- Server statistics
- Calculator
- Help command

## Prerequisites

- [Node.js](https://nodejs.org/) (v16.9.0 or higher)
- [Discord Bot Token](https://discord.com/developers/applications)
- [Discord Application ID](https://discord.com/developers/applications)

## Installation

### 1. Clone or Download
```bash
git clone <your-repo-url>
cd MB
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Audio Encryption (Required for Music)
```bash
npm install sodium
```
*If sodium fails to install, use:*
```bash
npm install libsodium-wrappers
```

### 4. Environment Setup
Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

### 5. Deploy Commands
```bash
npm run deploy
```

### 6. Start the Bot
```bash
npm run start
```

## Bot Setup in Discord

### Required Permissions
Your bot needs these permissions:
- `Send Messages`
- `Use Slash Commands`
- `Connect` (for voice channels)
- `Speak` (for voice channels)
- `Manage Roles` (for reaction roles)
- `Add Reactions`
- `Read Message History`
- `View Channels`

### Invite Link
Generate an invite link with the required permissions from the Discord Developer Portal.

## Commands

### Music Commands
- `/play <song>` - Play a song from YouTube
- `/pause` - Pause the current song
- `/resume` - Resume playback
- `/skip` - Skip to the next song
- `/stop` - Stop playback and clear queue
- `/queue` - Show the current queue
- `/nowplaying` - Show current song info
- `/volume <1-100>` - Set playback volume

### Leveling Commands
- `/level [user]` - Check your or another user's level
- `/leaderboard` - Show server leaderboard

### Utility Commands
- `/help` - Show all commands
- `/calc <expression>` - Calculate math expressions
- `/serverstats` - Show server statistics
- `/reactionrole` - Set up reaction roles (Admin only)

## File Structure
Trae

Used 1 context

Perfect! The interaction errors are now fixed, but there's a new error about missing encryption packages for Discord voice. This is a common issue with Discord music bots.

## Current Error:
## Solution:
Install one of the required encryption packages. sodium is the fastest and most recommended:

Alternative options (if sodium doesn't work on your system):

Or:

## Why This Happens:
Discord voice connections require encryption for audio data. The @discordjs/voice library needs one of these packages to encrypt the audio packets before sending them to Discord.

## Recommended Steps:
1. 1.
   Install sodium (best performance):
2. 2.
   Restart the bot :
3. 3.
   Test the /play command with a YouTube URL or song name
## If sodium installation fails:
Sodium requires native compilation and might fail on some systems. If you get compilation errors, use the JavaScript alternative:

## Progress Summary:
✅ Fixed : Interaction acknowledgment errors ✅ Fixed : "Unknown interaction" timeout issues ✅ Fixed : Permission bitfield errors 🔧 Current : Missing encryption package for voice

Once you install the encryption package, your music bot should be fully functional!

cosmic-fi

Copy

Delete

add a readme with simple guide

Trae

I'll create a comprehensive README.md file for your Discord music bot with setup instructions and usage guide.

```
# Discord Music Bot (MB)

A feature-rich Discord bot with 
music playback, leveling system, 
and reaction roles.

## Features

### 🎵 Music System
- Play music from YouTube (URLs or 
search)
- Queue management (add, skip, 
stop, pause, resume)
- Volume control
- Now playing information
- Auto-disconnect when queue is 
empty

### 📈 Leveling System
- XP gain from messages (15-30 XP 
per message)
- Level up notifications
- User level checking (`/level`)
- Server leaderboard (`/
leaderboard`)
- 1-minute cooldown between XP 
gains

### 🎭 Reaction Roles
- Assign roles via message 
reactions
- Easy setup with `/reactionrole` 
command
- Automatic role management

### 🛠️ Utility Commands
- Server statistics
- Calculator
- Help command

## Prerequisites

- [Node.js](https://nodejs.org/) 
(v16.9.0 or higher)
- [Discord Bot Token](https://
discord.com/developers/
applications)
- [Discord Application ID](https://
discord.com/developers/
applications)

## Installation

### 1. Clone or Download
```bash
git clone <your-repo-url>
cd MB
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Audio Encryption 
(Required for Music)
```bash
npm install sodium
```
*If sodium fails to install, use:*
```bash
npm install libsodium-wrappers
```

### 4. Environment Setup
Create a `.env` file in the root 
directory:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
```

### 5. Deploy Commands
```bash
npm run deploy
```

### 6. Start the Bot
```bash
npm run start
```

## Bot Setup in Discord

### Required Permissions
Your bot needs these permissions:
- `Send Messages`
- `Use Slash Commands`
- `Connect` (for voice channels)
- `Speak` (for voice channels)
- `Manage Roles` (for reaction 
roles)
- `Add Reactions`
- `Read Message History`
- `View Channels`

### Invite Link
Generate an invite link with the 
required permissions from the 
Discord Developer Portal.

## Commands

### Music Commands
- `/play <song>` - Play a song 
from YouTube
- `/pause` - Pause the current song
- `/resume` - Resume playback
- `/skip` - Skip to the next song
- `/stop` - Stop playback and 
clear queue
- `/queue` - Show the current queue
- `/nowplaying` - Show current 
song info
- `/volume <1-100>` - Set playback 
volume

### Leveling Commands
- `/level [user]` - Check your or 
another user's level
- `/leaderboard` - Show server 
leaderboard

### Utility Commands
- `/help` - Show all commands
- `/calc <expression>` - Calculate 
math expressions
- `/serverstats` - Show server 
statistics
- `/reactionrole` - Set up 
reaction roles (Admin only)

## File Structure

```
MB/
├── src/
│   ├── commands/          # Slash commands
│   │   ├── music/         # Music-related commands
│   │   ├── utility/       # Utility commands
│   │   ├── general/       # General commands
│   │   └── customization/ # Customization commands
│   ├── events/            # Discord.js events
│   ├── handlers/          # Command handlers
│   └── utils/             # Utility classes
├── data/                  # Data storage (JSON files)
│   ├── levels.json        # User XP/level data
│   └── reactionRoles.json # Reaction role configs
├── .env                   # Environment variables
├── bot.js                 # Main bot file
└── deploy-commands.js     # Command deployment

```


## Configuration

### Leveling System
Edit `src/utils/levelingSystem.js` to customize:
- XP gain amount (default: 15-30 per message)
- Cooldown duration (default: 1 minute)
- Level calculation formula

### Music Settings
Edit `src/utils/musicQueue.js` to customize:
- Default volume (default: 0.5)
- Queue limits

## Troubleshooting

### Common Issues

**"Missing Permissions" Error**
- Ensure bot has required permissions
- Check bot role position (must be above managed roles)

**"Cannot play audio" Error**
- Install encryption package: `npm install sodium`
- Restart the bot after installation

**"Unknown interaction" Error**
- Run `npm run deploy` to update slash commands
- Wait a few minutes for Discord to sync commands

**"ytdl-core extraction" Error**
- Update ytdl-core: `npm update ytdl-core`
- Or switch to: `npm install @distube/ytdl-core`

### Support

If you encounter issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify bot permissions in Discord
4. Make sure the `.env` file is configured correctly

## Development

### Adding New Commands
1. Create a new file in the appropriate `src/commands/` subfolder
2. Follow the existing command structure
3. Run `npm run deploy` to register the command

### Adding New Events
1. Create a new file in `src/events/`
2. Export an object with `name` and `execute` properties
3. Restart the bot

## License

This project is open source. Feel free to modify and distribute.

---

**Note**: This bot stores data in local JSON files. For production use with multiple servers, consider using a proper database.