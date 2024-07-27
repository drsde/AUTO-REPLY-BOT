const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
let router = express.Router();
const pino = require("pino");
const {
    default: Venocyber_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

async function fetchHiruNews() {
    try {
        const { data } = await axios.get('https://www.hirunews.lk/latest-news');
        const $ = cheerio.load(data);
        let news = [];

        $('.news-title a').each((index, element) => {
            news.push({
                title: $(element).text(),
                link: 'https://www.hirunews.lk' + $(element).attr('href')
            });
        });

        return news.slice(0, 5); // Get the latest 5 news articles
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function VENOCYBER_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Venocyber_Tech = Venocyber_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
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
            Pair_Code_By_Venocyber_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection == "open") {
                    // Fetch and send news to the group
                    let news = await fetchHiruNews();
                    if (news.length > 0) {
                        let message = 'Latest Hiru News:\n\n';
                        news.forEach((article, index) => {
                            message += `${index + 1}. ${article.title}\n${article.link}\n\n`;
                        });
                        // Group ID provided by you
                        await Pair_Code_By_Venocyber_Tech.sendMessage('120363320220027193@g.us', { text: message });
                    }

                    await delay(100);
                    await Pair_Code_By_Venocyber_Tech.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    VENOCYBER_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    return await VENOCYBER_MD_PAIR_CODE();
});

module.exports = router;
