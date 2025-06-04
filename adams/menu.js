const { adams } = require("../Ibrahim/adams");
const moment = require("moment-timezone");
const axios = require("axios");
const s = require(__dirname + "/../config");
const readMore = String.fromCharCode(8206).repeat(4000); 
const PREFIX = s.PREFIX; // Get prefix from config

// GitHub raw audio links
const githubRawBaseUrl = "https://raw.githubusercontent.com/ibrahimaitech/bwm-xmd-music/master/tiktokmusic";
const audioFiles = Array.from({ length: 100 }, (_, i) => `sound${i + 1}.mp3`);
const getRandomAudio = () => audioFiles[Math.floor(Math.random() * audioFiles.length)];

// Menu images
const menuImages = [
    "https://res.cloudinary.com/dptzpfgtm/image/upload/v1748879883/whatsapp_uploads/e3eprzkzxhwfx7pmemr5.jpg",
    "https://res.cloudinary.com/dptzpfgtm/image/upload/v1748879901/whatsapp_uploads/hqagxk84idvf899rhpfj.jpg",
    "https://res.cloudinary.com/dptzpfgtm/image/upload/v1748879921/whatsapp_uploads/bms318aehnllm6sfdgql.jpg",
    "https://res.cloudinary.com/dptzpfgtm/image/upload/v1748879942/whatsapp_uploads/aepp7ozja6emjggk74rk.jpg",
    "https://res.cloudinary.com/dptzpfgtm/image/upload/v1748880097/whatsapp_uploads/uii3owvxgl85ijpqoqfe.jpg",
];
const randomImage = () => menuImages[Math.floor(Math.random() * menuImages.length)];
const footer = `\n\n©Sir Ibrahim Adams\n\n╭━========================\n┃  �ᴛᴏ sᴇᴇ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs ᴛᴏɢᴇᴛʜᴇʀ ᴜsᴇ\n┃ *${PREFIX} Cmds*\n┃ *${PREFIX} Help*\n┃ *${PREFIX} list*\n┃ *${PREFIX} Commands* \n╰━========================\n\n*For business use this*\nhttps://business.bwmxmd.online\n\n®2025 ʙᴡᴍ xᴍᴅ 🔥`;

// GitHub repo stats - Updated with correct repo path
const fetchGitHubStats = async () => {
    try {
        const owner = "ibrahimadams254"; // Updated GitHub username
        const repo = "BWM-XMD-QUANTUM"; // Repository name
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                'User-Agent': 'BWM-XMD-Bot' // GitHub API requires a user-agent
            }
        });
        const forks = response.data.forks_count || 0;
        const stars = response.data.stargazers_count || 0;
        return (forks * 2) + (stars * 2);
    } catch (error) {
        console.error("Error fetching GitHub stats:", error.message);
        return Math.floor(Math.random() * 1000) + 500; // Return a random number if API fails
    }
};

// Command list storage (ensures commands are stored only once)
const commandList = {};
let commandsStored = false;

adams({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    const contactName = commandeOptions?.ms?.pushName || "Unknown Contact";
    const sender = commandeOptions?.sender || (commandeOptions?.ms?.key?.remoteJid || "").replace(/@.+/, '');
    let { ms, repondre } = commandeOptions;
    let { cm } = require(__dirname + "/../Ibrahim/adams");

    // Check if the message is from a group
    const isGroup = dest.endsWith('@g.us');

    // Contact message for quoted replies
    const contactMsg = {
        key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
        message: {
            contactMessage: {
                displayName: contactName,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${contactName}\nitem1.TEL;waid=${sender}:${sender}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
            },
        },
    };

    // Store commands only once
    if (!commandsStored) {
        cm.forEach((com) => {
            const categoryUpper = com.categorie.toUpperCase();
            if (!commandList[categoryUpper]) commandList[categoryUpper] = [];
            commandList[categoryUpper].push(`🟢 ${com.nomCom}`);
        });
        commandsStored = true; // Prevents further storing
    }

    moment.tz.setDefault(s.TZ || "Africa/Nairobi");
    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");
    const totalUsers = await fetchGitHubStats();
    
    // Get random image for main menu
    const image = randomImage();

    // Dynamic Greeting Based on Time
    const hour = moment().hour();
    let greeting = "🌙 *Good Night* 😴";
    if (hour >= 5 && hour < 12) greeting = "🌅 *Good Morning* 🤗";
    else if (hour >= 12 && hour < 18) greeting = "☀️ *Good Afternoon* 😊";
    else if (hour >= 18 && hour < 22) greeting = "🌆 *Good Evening* 🤠";

    // Custom Categories with Emojis
    const categoryGroups = {
        "🤖 AI MENU": ["AI", "TTS", "NEWS"],
        "⚽ SPORTS MENU": ["FOOTBALL", "GAMES"],
        "📥 DOWNLOAD MENU": ["NEWS", "SEARCH", "IMAGES", "DOWNLOAD"],
        "🛠️ HEROKU MENU": ["CONTROL", "STICKCMD", "TOOLS"],
        "💬 CONVERSATION MENU": ["CONVERSION", "LOGO", "MEDIA", "WEEB", "SCREENSHOTS", "IMG", "AUDIO-EDIT", "MPESA"],
        "😂 FUN MENU": ["HENTAI", "FUN", "REACTION"],
        "🌍 GENERAL MENU": ["GENERAL", "MODS", "UTILITY", "MEDIA", "TRADE"],
        "👨‍👨‍👦‍👦 GROUP MENU": ["GROUP"],
        "💻 BOT_INFO MENU": ["GITHUB", "USER", "PAIR"],
        "🔞 ADULT MENU": ["XVIDEO"],
    };

    const categoryKeys = Object.keys(categoryGroups);

    // Create list sections with all categories (for inbox)
    const createListSections = () => {
        const sections = [];
        
        // Categories section
        const categoryRows = categoryKeys.map((category, index) => ({
            title: category,
            rowId: `cat_${index + 1}`,
            description: `View all ${category.toLowerCase()} commands`
        }));

        sections.push({
            title: "📋 Command Categories",
            rows: categoryRows
        });

        // Links section
        sections.push({
            title: "🔗 Quick Links",
            rows: [
                {
                    title: "🎵 Play Audio",
                    rowId: "play_audio",
                    description: "Play random BWM XMD audio"
                },
                {
                    title: "🌐 BWM XMD Web",
                    rowId: "bwm_web",
                    description: "Visit our official website"
                },
                {
                    title: "📢 WhatsApp Channel",
                    rowId: "whatsapp_channel",
                    description: "Join our official channel"
                },
                {
                    title: "🎬 BWM XMD YouTube",
                    rowId: "bwm_youtube",
                    description: "Visit our YouTube platform"
                }
            ]
        });

        return sections;
    };

    // Create button sections (for groups)
    const createButtonSections = () => {
        const buttons = [];
        
        // Add category buttons (max 3 per row)
        for (let i = 0; i < categoryKeys.length; i += 3) {
            const row = categoryKeys.slice(i, i + 3).map((category, idx) => ({
                buttonId: `cat_${i + idx + 1}`,
                buttonText: { displayText: category.split(" ")[0] }, // Show only first word for space
                type: 1
            }));
            buttons.push(row);
        }
        
        // Add special buttons
        buttons.push([
            { buttonId: 'play_audio', buttonText: { displayText: '🎵 Audio' }, type: 1 },
            { buttonId: 'bwm_web', buttonText: { displayText: '🌐 Website' }, type: 1 },
            { buttonId: 'back_to_main', buttonText: { displayText: '🏠 Main Menu' }, type: 1 }
        ]);
        
        return buttons;
    };

    // First send the image with appropriate buttons
    const buttons = isGroup 
        ? createButtonSections()
        : [
            { buttonId: 'open_menu', buttonText: { displayText: '📋 DM MENU' }, type: 1 },
            { buttonId: 'group_buttons', buttonText: { displayText: '👥 GROUP BUTTONS' }, type: 1 }
        ];

    const sentImageMessage = await zk.sendMessage(dest, {
        image: { url: image },
        caption: `
┌─❖
│ 𝐁𝐖𝐌 𝐗𝐌𝐃    
└┬❖  
┌┤ ${greeting}
│└────────┈⳹  
│🕵️ ᴜsᴇʀ ɴᴀᴍᴇ: ${contactName}
│📅 ᴅᴀᴛᴇ: ${date}
│⏰ ᴛɪᴍᴇ: ${time}
│👥 ʙᴡᴍ ᴜsᴇʀs: ${totalUsers}        
└─────────────┈⳹ 

> ©Ibrahim Adams

${readMore}

📜 *Tap the button below to open the ${isGroup ? 'group commands' : 'menu'}*

${footer}`,
        footer: "BWM XMD - Quantum Version",
        buttons: buttons,
        contextInfo: {
            mentionedJid: [sender ? `${sender}@s.whatsapp.net` : undefined].filter(Boolean),
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363285388090068@newsletter",
                newsletterName: "BWM-XMD",
                serverMessageId: Math.floor(100000 + Math.random() * 900000),
            },
        },
    }, { quoted: contactMsg });

    // Function to send the list menu (for inbox)
    const sendListMenu = async () => {
        await zk.sendMessage(dest, {
            text: "📋 *BWM XMD COMMANDS WEB*",
            footer: "Select a category from the list below",
            title: "🌎 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐓𝐄𝐂𝐇 🌎",
            buttonText: "📋 Select Option",
            sections: createListSections(),
            contextInfo: {
                mentionedJid: [sender ? `${sender}@s.whatsapp.net` : undefined].filter(Boolean),
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285388090068@newsletter",
                    newsletterName: "BWM-XMD",
                    serverMessageId: Math.floor(100000 + Math.random() * 900000),
                },
            },
        }, { quoted: contactMsg });
    };

    // Function to send button menu (for groups)
    const sendButtonMenu = async () => {
        const categoryImage = randomImage();
        await zk.sendMessage(dest, {
            image: { url: categoryImage },
            caption: `👥 *GROUP COMMANDS MENU*\n\nSelect a category from the buttons below\n\n${footer}`,
            buttons: createButtonSections(),
            contextInfo: {
                mentionedJid: [sender ? `${sender}@s.whatsapp.net` : undefined].filter(Boolean),
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285388090068@newsletter",
                    newsletterName: "BWM-XMD",
                    serverMessageId: Math.floor(100000 + Math.random() * 900000),
                },
            },
        }, { quoted: contactMsg });
    };

    // Function to show category commands with navigation
    const showCategoryCommands = async (selectedIndex, userJid) => {
        if (selectedIndex < 1 || selectedIndex > categoryKeys.length) {
            return repondre("*❌ Invalid selection. Please try again.*", { quoted: contactMsg });
        }

        const selectedCategory = categoryKeys[selectedIndex - 1];
        const combinedCommands = categoryGroups[selectedCategory].flatMap((cat) => commandList[cat] || []);
        const categoryImage = randomImage();

        // Create navigation buttons
        const navButtons = [];

        // Previous button
        if (selectedIndex > 1) {
            navButtons.push({
                buttonId: `cat_${selectedIndex - 1}`,
                buttonText: { displayText: `⬅️ Previous` },
                type: 1
            });
        }

        // Back to menu button
        navButtons.push({
            buttonId: isGroup ? "back_to_group" : "back_to_menu",
            buttonText: { displayText: isGroup ? "👥 Group Menu" : "📋 Back to Menu" },
            type: 1
        });

        // Next button
        if (selectedIndex < categoryKeys.length) {
            navButtons.push({
                buttonId: `cat_${selectedIndex + 1}`,
                buttonText: { displayText: `➡️ Next` },
                type: 1
            });
        }

        await zk.sendMessage(dest, {
            image: { url: categoryImage },
            caption: combinedCommands.length
                ? `
┌─❖ 
│ *${selectedCategory}*:
└┬❖
┌┤
 ${combinedCommands.join("\n\n")}\n└────────┈⳹

📄 *Page ${selectedIndex} of ${categoryKeys.length}*

${footer}`
                : `⚠️ No commands found for ${selectedCategory}.`,
            buttons: navButtons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [sender ? `${sender}@s.whatsapp.net` : undefined].filter(Boolean),
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285388090068@newsletter",
                    newsletterName: "BWM-XMD",
                    serverMessageId: Math.floor(100000 + Math.random() * 900000),
                },
            },
        }, { quoted: contactMsg });
    };

    // Function to send audio
    const sendAudio = async () => {
        const audioUrl = `${githubRawBaseUrl}/${getRandomAudio()}`;
        await zk.sendMessage(dest, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
                mentionedJid: [sender ? `${sender}@s.whatsapp.net` : undefined].filter(Boolean),
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363285388090068@newsletter",
                    newsletterName: "BWM-XMD",
                    serverMessageId: Math.floor(100000 + Math.random() * 900000),
                },
            },
        }, { 
            quoted: {
                key: {
                    remoteJid: ms.key.remoteJid,
                    fromMe: ms.key.fromMe,
                    id: ms.key.id,
                    participant: ms.key.participant
                },
                message: {
                    conversation: "🚀 𝐐𝐔𝐀𝐍𝐓𝐔𝐌 𝐕𝐄𝐑𝐒𝐈𝐎𝐍 🚀"
                }
            }
        });
    };

    // Global event listener for this menu session
    const messageHandler = async (update) => {
        const message = update.messages[0];
        if (!message || !message.key) return;

        const messageFrom = message.key.remoteJid;
        const messageParticipant = message.key.participant || messageFrom;
        const userJid = sender ? `${sender}@s.whatsapp.net` : ms.key.remoteJid;

        // Only process messages from the same user and chat
        if (messageFrom !== dest) return;
        if (messageParticipant !== userJid && messageFrom !== userJid) return;

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            
            // Handle open menu button (for inbox)
            if (buttonId === "open_menu") {
                await sendListMenu();
                return;
            }
            
            // Handle group buttons (for inbox)
            if (buttonId === "group_buttons") {
                await sendButtonMenu();
                return;
            }
            
            // Handle back to menu
            if (buttonId === "back_to_menu") {
                await sendListMenu();
                return;
            }
            
            // Handle back to group menu
            if (buttonId === "back_to_group" || buttonId === "back_to_main") {
                await sendButtonMenu();
                return;
            }
            
            // Handle category navigation buttons
            const catMatch = buttonId.match(/cat_(\d+)/);
            if (catMatch) {
                const selectedIndex = parseInt(catMatch[1]);
                await showCategoryCommands(selectedIndex, userJid);
            }
            
            // Handle play audio
            if (buttonId === "play_audio") {
                await sendAudio();
                return;
            }
            
            // Handle website link
            if (buttonId === "bwm_web") {
                await zk.sendMessage(dest, {
                    text: "🌐 *BWM XMD Web*\n\nVisit our official website:\nhttps://www.ibrahimadams.site\n\nExplore all BWM XMD features and updates!"
                }, { quoted: contactMsg });
                return;
            }
        }

        // Handle list responses (for inbox)
        else if (message.message?.listResponseMessage) {
            const listId = message.message.listResponseMessage.singleSelectReply.selectedRowId;
            
            // Handle category selections
            const catMatch = listId.match(/cat_(\d+)/);
            if (catMatch) {
                const selectedIndex = parseInt(catMatch[1]);
                await showCategoryCommands(selectedIndex, userJid);
                return;
            }
            
            // Handle link selections
            if (listId === "play_audio") {
                await sendAudio();
                return;
            }
            
            if (listId === "bwm_web") {
                await zk.sendMessage(dest, {
                    text: "🌐 *BWM XMD Web*\n\nVisit our official website:\nhttps://www.ibrahimadams.site\n\nExplore all BWM XMD features and updates!"
                }, { quoted: contactMsg });
                return;
            }
            
            if (listId === "whatsapp_channel") {
                await zk.sendMessage(dest, {
                    text: "📢 *WhatsApp Channel*\n\nJoin our official WhatsApp channel for updates:\nhttps://whatsapp.com/channel/0029VaZuGSxEawdxZK9CzM0Y\n\nStay connected with BWM XMD community!"
                }, { quoted: contactMsg });
                return;
            }
            
            if (listId === "bwm_youtube") {
                await zk.sendMessage(dest, {
                    text: "🎬 *BWM XMD YouTube*\n\nStream or download anything from our youtu-go for free:\nhttps://go.bwmxmd.online\n\nBest free platform by Ibrahim Adams"
                }, { quoted: contactMsg });
                return;
            }
        }
        
        // Handle text responses (fallback for number input)
        else if (message.message?.extendedTextMessage) {
            const responseText = message.message.extendedTextMessage.text.trim();
            const contextInfo = message.message.extendedTextMessage.contextInfo;
            
            // Check if it's a reply to our menu
            if (contextInfo && (contextInfo.stanzaId === sentImageMessage.key.id)) {
                const selectedIndex = parseInt(responseText);
                if (!isNaN(selectedIndex)) {
                    await showCategoryCommands(selectedIndex, userJid);
                }
            }
        }
        
        // Handle regular conversation messages (for number input)
        else if (message.message?.conversation) {
            const responseText = message.message.conversation.trim();
            const selectedIndex = parseInt(responseText);
            
            // Only process if it's a valid number and recent
            if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= categoryKeys.length) {
                const messageTime = message.messageTimestamp * 1000;
                const currentTime = Date.now();
                // Process only if message is within last 2 minutes
                if (currentTime - messageTime < 120000) {
                    await showCategoryCommands(selectedIndex, userJid);
                }
            }
        }
    };

    // Add the event listener
    zk.ev.on("messages.upsert", messageHandler);

    // Remove listener after 5 minutes to prevent memory leaks
    setTimeout(() => {
        zk.ev.off("messages.upsert", messageHandler);
    }, 300000);
});
