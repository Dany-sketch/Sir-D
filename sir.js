const config = {
    // BOT INFORMATION
    botName: "SIR D MD",
    ownerName: "Sir D",
    ownerNumber: "254797555742",
    prefix: ".",
    version: "1.0.0",
    description: "SIR D MD WhatsApp Multi-Device Bot",

    // BOT SETTINGS
    mode: "public",
    connectionMethod: "pairing",
    sessionType: "multi-file",
    sessionIdPrefix: "SIR-D~",

    // AUTOMATION SETTINGS
    autoRead: true,
    autoStatusView: true,
    autoLikeStatus: false,
    autoTyping: true,
    autoRecording: false,
    antiCall: true,
    alwaysOnline: false,

    // APPEARANCE
    menuStyle: "image",
    botProfile: "anime",

    // BOT INFORMATION
    packname: "SIR D MD",
    author: "Sir D",

    // MESSAGES
    messages: {
        wait: "⏳ Please wait...",
        success: "✅ Successfully completed!",
        error: "❌ An error occurred!",
        owner: "❌ This command is for my owner only!",
        admin: "❌ Group administrators only!",
        group: "❌ This command works in groups only!",
        private: "❌ This command works in private chats only!",
        notFound: "❌ Command not found. Use .menu"
    }
};

module.exports = config;
