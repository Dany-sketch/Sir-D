const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

async function startSession() {
const { state, saveCreds } = await useMultiFileAuthState("./session");

const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["SIR D MD", "Chrome", "1.0.0"],
    syncFullHistory: false,
    markOnlineOnConnect: true
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
        console.log("\nScan this QR code with WhatsApp:\n");
        qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
        console.log("✅ SIR D MD connected successfully!");
    }

    if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;

        if (statusCode !== DisconnectReason.loggedOut) {
            console.log("Connection closed. Reconnecting...");
            startSession();
        } else {
            console.log("WhatsApp logged out. Delete the session folder and reconnect.");
        }
    }
});

return sock;

}

module.exports = startSession;
