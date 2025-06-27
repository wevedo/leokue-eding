

const { createContext } = require('../Ibrahim/helper');

module.exports = {
    setup: async (adams, { config, logger }) => {
        if (!adams || !config) return;

        const botJid = `${adams.user?.id.split('@')[0]}@s.whatsapp.net`;
        const welcomeImage = 'https://files.catbox.moe/h2ydge.jpg';
        const businessLink = 'https://business.bwmxmd.online/';
        
        // Cache for group names to reduce API calls
        const groupCache = new Map();
        setInterval(() => groupCache.clear(), 3600000); // 1 hour cache

        adams.ev.on('group-participants.update', async (update) => {
            try {
                const { id, participants, action } = update;

                // Get or fetch group metadata
                let groupName = groupCache.get(id);
                if (!groupName) {
                    const metadata = await adams.groupMetadata(id);
                    groupName = metadata.subject || "this dope group";
                    groupCache.set(id, groupName);
                }

                // Prepare common context
                const contextOptions = {
                    title: "BWM-XMD Notification",
                    body: `${action === 'add' ? 'Welcome' : 'Farewell'} Alert`,
                    thumbnail: welcomeImage
                };

                for (const participant of participants) {
                    if (participant === botJid) continue;

                    // Welcome new members
                    if (action === 'add' && config.WELCOME_MESSAGE === 'yes') {
                        await adams.sendMessage(id, {
                            image: { url: welcomeImage },
                            caption: `🚀 Welcome to ${groupName}, @${participant.split('@')[0]}! The party just got better!\n\n` +
                                     `💼 Here to do business? We got you covered:\n` +
                                     `🔗 ${businessLink}\n\n` +
                                     `✨ Pro tip: Keep your notifications on for epic updates!`,
                            mentions: [participant],
                            ...createContext(participant, contextOptions)
                        });
                    }
                    // Goodbye message
                    else if (action === 'remove' && config.GOODBYE_MESSAGE === 'yes') {
                        await adams.sendMessage(id, {
                            text: `👋 @${participant.split('@')[0]} just bounced! Doors always open though...\n\n` +
                                  `💼 Business never stops: ${businessLink}\n\n` +
                                  `⚡ Remember: Out of sight, but our deals are always in reach!`,
                            mentions: [participant],
                            ...createContext(participant, {
                                ...contextOptions,
                                thumbnail: 'https://files.catbox.moe/sd49da.jpg'
                            })
                        });
                    }
                }
            } catch (err) {
                logger.error('Greeting system error:', err);
            }
        });
    }
};
