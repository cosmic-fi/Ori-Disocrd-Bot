const fs = require('fs');
const path = require('path');

class LevelingSystem {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data/levels.json');
        this.ensureDataFile();
        this.users = this.loadData();
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
        fs.writeFileSync(this.dataPath, JSON.stringify(this.users, null, 2));
    }

    getUser(userId, guildId) {
        const key = `${guildId}-${userId}`;
        if (!this.users[key]) {
            this.users[key] = {
                xp: 0,
                level: 1,
                totalXp: 0,
                lastMessage: 0
            };
        }
        return this.users[key];
    }

    addXp(userId, guildId, amount = null) {
        const user = this.getUser(userId, guildId);
        const now = Date.now();
        
        // Prevent spam (1 minute cooldown)
        if (now - user.lastMessage < 60000) {
            return null;
        }
        
        const xpGain = amount || Math.floor(Math.random() * 15) + 15; // 15-30 XP
        user.xp += xpGain;
        user.totalXp += xpGain;
        user.lastMessage = now;
        
        const oldLevel = user.level;
        const newLevel = this.calculateLevel(user.totalXp);
        
        if (newLevel > oldLevel) {
            user.level = newLevel;
            user.xp = user.totalXp - this.getXpForLevel(newLevel);
            this.saveData();
            return { levelUp: true, newLevel, xpGain };
        }
        
        this.saveData();
        return { levelUp: false, xpGain };
    }

    calculateLevel(totalXp) {
        return Math.floor(0.1 * Math.sqrt(totalXp)) + 1;
    }

    getXpForLevel(level) {
        return Math.pow((level - 1) / 0.1, 2);
    }

    getXpForNextLevel(level) {
        return this.getXpForLevel(level + 1);
    }

    getLeaderboard(guildId, limit = 10) {
        const guildUsers = Object.entries(this.users)
            .filter(([key]) => key.startsWith(`${guildId}-`))
            .map(([key, data]) => ({
                userId: key.split('-')[1],
                ...data
            }))
            .sort((a, b) => b.totalXp - a.totalXp)
            .slice(0, limit);
        
        return guildUsers;
    }
}

module.exports = LevelingSystem;