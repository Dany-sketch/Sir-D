const settings = require("../settings.cjs");
const fs = require("fs");
const path = require("path");

const commands = new Map();

// Load plugins
function loadPlugins(sock) {
const pluginDir = path.join(__dirname, "../plugins");

if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir, { recursive: true });
    return;
}

const files = fs.readdirSync(pluginDir).filter(file => file.endsWith(".js"));

for (const file of files) {
    try {
        const pluginPath = path.join(pluginDir, file);

        delete require.cache[require.resolve(pluginPath)];

        const plugin = require(pluginPath);

        if (!plugin.command || typeof plugin.execute !== "function") {
            console.log(`⚠️ Invalid plugin: ${file}`);
            continue;
        }

        const names = Array.isArray(plugin.command)
            ? plugin.command
            : [plugin.command];

        for (const name of names) {
            commands.set(name.toLowerCase(), plugin);
        }

        console.log(`✅ Loaded plugin: ${file}`);
    } catch (error) {
        console.error(`❌ Plugin error (${file}):`, error.message);
    }
}

}

// Handle incoming messages
async function commandHandler(sock, msg) {
try {
if (!msg.message) return;

    const remoteJid = msg.key.remoteJid;
    if (!remoteJid || msg.key.fromMe) return;

    const messageType = Object.keys(msg.message)[0];

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        "";

    if (!text.startsWith(settings.PREFIX)) return;

    const args = text.slice(settings.PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const plugin = commands.get(commandName);

    if (!plugin) {
        await sock.sendMessage(remoteJid, {
            text: settings.MESSAGES.INVALID
        }, { quoted: msg });
        return;
    }

    const sender = msg.key.participant || remoteJid;
    const isGroup = remoteJid.endsWith("@g.us");

    const ownerNumber = settings.OWNER_NUMBER.replace(/\D/g, "");
    const senderNumber = sender.split("@")[0].replace(/\D/g, "");

    const isOwner = senderNumber === ownerNumber;

    if (settings.MODE === "private" && !isOwner) return;

    if (plugin.ownerOnly && !isOwner) {
        return sock.sendMessage(remoteJid, {
            text: settings.MESSAGES.OWNER
        }, { quoted: msg });
    }

    if (plugin.groupOnly && !isGroup) {
        return sock.sendMessage(remoteJid, {
            text: settings.MESSAGES.GROUP
        }, { quoted: msg });
    }

    if (plugin.privateOnly && isGroup) {
        return sock.sendMessage(remoteJid, {
            text: settings.MESSAGES.PRIVATE
        }, { quoted: msg });
    }

    if (plugin.react) {
        await sock.sendMessage(remoteJid, {
            react: {
                text: plugin.react,
                key: msg.key
            }
        });
    }

    await plugin.execute(sock, msg, {
        args,
        command: commandName,
        sender,
        remoteJid,
        isOwner,
        isGroup,
        settings
    });

} catch (error) {
    console.error("Command Handler Error:", error);

    const remoteJid = msg.key.remoteJid;

    if (remoteJid) {
        await sock.sendMessage(remoteJid, {
            text: settings.MESSAGES.ERROR
        }).catch(() => {});
    }
}

}

module.exports = {
commandHandler,
loadPlugins,
commands
};
