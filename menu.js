const settings = require("../settings.cjs");

module.exports = {
command: ["menu", "help", "list"],

description: "Displays the bot command menu",

execute: async (sock, msg, { remoteJid }) => {

    const menu = `

╭━━━━━━━━━━━━━━━━━━╮
👑 SIR D MD 👑
╰━━━━━━━━━━━━━━━━━━╯

👤 OWNER: ${settings.OWNER_NAME}
🤖 BOT: ${settings.BOT_NAME}
⚙️ VERSION: ${settings.VERSION}
🔰 PREFIX: ${settings.PREFIX}
🌍 MODE: ${settings.MODE.toUpperCase()}

╭━━━〔 GENERAL 〕━━━
┃
┃ ◈ .menu
┃ ◈ .ping
┃ ◈ .alive
┃ ◈ .owner
┃ ◈ .info
┃
╰━━━━━━━━━━━━━━━━━━

╭━━━〔 DOWNLOAD 〕━━━
┃
┃ ◈ .play
┃ ◈ .song
┃ ◈ .video
┃ ◈ .tiktok
┃ ◈ .instagram
┃
╰━━━━━━━━━━━━━━━━━━

╭━━━〔 GROUP 〕━━━
┃
┃ ◈ .tagall
┃ ◈ .hidetag
┃ ◈ .groupinfo
┃ ◈ .admins
┃
╰━━━━━━━━━━━━━━━━━━

╭━━━〔 OWNER 〕━━━
┃
┃ ◈ .mode
┃ ◈ .restart
┃ ◈ .shutdown
┃ ◈ .broadcast
┃
╰━━━━━━━━━━━━━━━━━━

   POWERED BY SIR D

`;

    await sock.sendMessage(remoteJid, {
        text: menu
    }, {
        quoted: msg
    });
}

};
