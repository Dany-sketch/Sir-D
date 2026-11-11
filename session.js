const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const pino = require("pino");

async function startSession() {
    const { state, saveCreds } =
        await useMultiFileAuthState("./session");

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: "silent" }),
        browser: ["SIR D MD", "Chrome", "1.0.0"],
        syncFullHistory: false,
        markOnlineOnConnect: true
    });

    sock.ev.on("creds.update", saveCreds);

    if (!state.creds.registered) {
        setTimeout(async () => {
            try {
                const number = (process.env.PAIRING_NUMBER || "")
                    .replace(/\D/g, "");

                if (!number) {
                    console.log("Set PAIRING_NUMBER in environment variables.");
                    return;
                }

                const code = await sock.requestPairingCode(number);

                console.log("YOUR SIR D MD PAIRING CODE:", code);
            } catch (error) {
                console.error("Pairing error:", error);
            }
        }, 3000);
    }

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("SIR D MD connected successfully!");
        }

        if (connection === "close") {
            const statusCode =
                lastDisconnect?.error?.output?.statusCode;

            if (statusCode === DisconnectReason.loggedOut) {
                console.log("WhatsApp logged out. Pair again.");
            } else {
                console.log("Connection closed. Restart required.");
            }
        }
    });

    return sock;
}

module.exports = startSession;
