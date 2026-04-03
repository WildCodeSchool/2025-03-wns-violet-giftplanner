import express, { Request, Response } from 'express';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID,
    PORT = '3000',
    WEBHOOK_SECRET
} = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN manquant dans .env');
}

if (!DISCORD_CHANNEL_ID) {
    throw new Error('DISCORD_CHANNEL_ID manquant dans .env');
}

if (!WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET manquant dans .env');
}

const app = express();
app.use(express.json());

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user?.tag}`);
});

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, botReady: client.isReady() });
});

app.post('/notify', async (req: Request, res: Response) => {
    try {
        const authHeader = req.header('x-webhook-secret');

        if (authHeader !== WEBHOOK_SECRET) {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        const { message, title } = req.body as {
            message?: string;
            title?: string;
        };

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Champ "message" requis' });
        }

        if (!client.isReady()) {
            return res.status(503).json({ error: 'Bot Discord non prêt' });
        }

        const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);

        if (!channel) {
            return res.status(404).json({ error: 'Salon introuvable' });
        }

        if (!channel.isTextBased()) {
            return res.status(400).json({ error: 'Le salon n’est pas textuel' });
        }

        const textChannel = channel as TextChannel;
        const content = title
            ? `**${title}**\n${message}`
            : message;

        await textChannel.send({ content });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Erreur /notify :', error);
        return res.status(500).json({ error: 'Erreur interne' });
    }
});

async function start(): Promise<void> {
    await client.login(DISCORD_TOKEN);

    app.listen(Number(PORT), () => {
        console.log(`🚀 Serveur HTTP lancé sur le port ${PORT}`);
        console.log(`➡️ POST /notify`);
    });
}

start().catch((error) => {
    console.error('Erreur au démarrage :', error);
    process.exit(1);
});