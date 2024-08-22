const PastebinAPI = require('pastebin-js');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const {
    default: Venocyber_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore
} = require('maher-zubair-baileys');

const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const app = express();
const port = 3000;

let router = express.Router();

function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function VENOCYBER_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);
        try {
            let Pair_Code_By_Venocyber_Tech = Venocyber_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Venocyber_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Venocyber_Tech.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Venocyber_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Venocyber_Tech.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);

                    let data = fs.readFileSync(`./temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_Venocyber_Tech.sendMessage(Pair_Code_By_Venocyber_Tech.user.id, { text: '' + b64data });

                    let VENOCYBER_MD_TEXT = `
*_Pair Code Connected by Venocyber Tech_*
*_Made With 🤍_*
______________________________________
╔════◇
║ *『 WOW YOU CHOOSEN VENOCYBER-MD 』*
║ _You Have Completed the First Step to Deploy a Whatsapp Bot._
╚══════════════════════╝
╔═════◇
║  『••• 𝗩𝗶𝘀𝗶𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
║❒ *Ytube:* _youtube.com/@JASTINMTEWA-vn9pl_
║❒ *Owner:* _https://wa.me/message/A4QG2JZKBXFTN1_
║❒ *Repo:* _https://github.com/Kingjux/venocyber-md_
║❒ *WaGroup:* _https://chat.whatsapp.com/HSln3blDuuuKvC8njxyCCN_
║❒ *WaChannel:* _https://whatsapp.com/channel/0029VaYauR9ISTkHTj4xvi1l_
║❒ *Plugins:* _https://github.com/Kingjux/venocyber-md-plugins_
╚══════════════════════╝ 
_____________________________________

_Don't Forget To Give Star To My Repo_`;

                    await Pair_Code_By_Venocyber_Tech.sendMessage(Pair_Code_By_Venocyber_Tech.user.id, { text: VENOCYBER_MD_TEXT }, { quoted: session });

                    // Add auto-responder for messages
                    Pair_Code_By_Venocyber_Tech.ev.on('message-new', async (message) => {
                        const lowerCaseBody = message.body.toLowerCase();
                        
                        if (lowerCaseBody === 'dexter') {
                            await Pair_Code_By_Venocyber_Tech.sendMessage(message.from, 'Hello! How can I dexter official assist you today?');
                        } else if (lowerCaseBody === 'mk') {
                            await Pair_Code_By_Venocyber_Tech.sendMessage(message.from, ' *මුකුත් නැ ඔයා mk* 💛');
                        } else if (lowerCaseBody === 'link' || lowerCaseBody === 'LINK') {
                            try {
                                const imageUrl = 'https://example.com/your-image.jpg'; // Replace with your image URL
                                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                                const media = new MessageMedia('image/jpeg', response.data.toString('base64'), 'image.jpg');
                                const caption = '*𝗗𝗘𝗫𝗧𝗘𝗥 ┃ AUTO STATUS SEEN* ♨\n\nhttps://wa.me/message/LLGU3TSNGKH6J1\n\n[____________________]\n\n*DEXTER LINK WITH DEXTER CONTACT*😾\n*DEXTER  PROGRAMS* 💀';
                                await Pair_Code_By_Venocyber_Tech.sendMessage(message.from, media, { caption });
                            } catch (error) {
                                console.error('Error fetching or sending image:', error);
                                await Pair_Code_By_Venocyber_Tech.sendMessage(message.from, 'Sorry, there was an error sending the image.');
                            }
                        } else {
                            await Pair_Code_By_Venocyber_Tech.sendMessage(message.from, 'Sorry, I didn’t understand that. Type "dexter" or "mk" for assistance.');
                        }
                    });

                    await delay(100);
                    await Pair_Code_By_Venocyber_Tech.ws.close();
                    return await removeFile(`./temp/${id}`);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    VENOCYBER_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted due to an error:", err);
            await removeFile(`./temp/${id}`);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    await VENOCYBER_MD_PAIR_CODE();
});

module.exports = router;
