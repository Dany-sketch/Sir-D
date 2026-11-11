const express = require("express");
const startSession = require("./session");
const config = require("./sir");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
res.send("${config.botName} is running!");
});

app.get("/health", (req, res) => {
res.json({
status: "online",
bot: config.botName,
version: config.version
});
});

app.listen(PORT, "0.0.0.0", async () => {
console.log("${config.botName} HTTP server started on port ${PORT}");

try {
    const sock = await startSession();

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;

        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;

            const remoteJid = msg.key.remoteJid;
            const message =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";

            const command = message.trim().toLowerCase();

            if (command === `${config.prefix}ping`) {
                await sock.sendMessage(remoteJid, {
                    text: "🏓 SIR D MD is online!"
                }, { quoted: msg });
            }

            if (command === `${config.prefix}alive`) {
                await sock.sendMessage(remoteJid, {
                    text: `✅ ${config.botName} is alive and running!`
                }, { quoted: msg });
            }

            if (command === `${config.prefix}menu`) {
                await sock.sendMessage(remoteJid, {
                    text: `╭━━━〔 ${config.botName} 〕━━━╮

┃
┃ .ping
┃ .alive
┃ .menu
┃
╰━━━━━━━━━━━━━━━━━━╯`
}, { quoted: msg });
}
}
});

} catch (error) {
    console.error("Bot startup error:", error);
}

});
