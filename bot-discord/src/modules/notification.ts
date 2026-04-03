import type { Request, Response } from 'express';
import client from '../bot';
import { TextChannel } from 'discord.js';

const { DISCORD_CHANNEL_ID, WEBHOOK_SECRET } = process.env;

if (!DISCORD_CHANNEL_ID) {
    throw new Error('DISCORD_CHANNEL_ID manquant dans .env');
}

const notify = async (req: Request, res: Response) => {
    try {
        // juste un simple message de test dans un salon en dure pour tster le bot
        if (!client.isReady()) {
            return res.status(503).json({ error: 'Bot Discord non prêt' });
        }
        const channel = await client.channels.fetch("1489551636849229946");

        if (!channel) {
            return res.status(404).json({ error: 'Salon introuvable' });
        }
        if (!channel.isTextBased()) {
            return res.status(400).json({ error: 'Le salon n’est pas textuel' });
        }

        const textChannel = channel as TextChannel;

        await textChannel.send({ content: 'Hello world' });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Erreur /notify :', error);
        return res.status(500).json({ error: 'Erreur interne' });
    }
    // try {
    //     const authHeader = req.header('x-webhook-secret');

    //     // if (authHeader !== WEBHOOK_SECRET) {
    //     //     return res.status(401).json({ error: 'Non autorisé' });
    //     // }

    //     const { message, title } = req.body as {
    //         message?: string;
    //         title?: string;
    //     };

    //     if (!message || typeof message !== 'string') {
    //         return res.status(400).json({ error: 'Champ "message" requis' });
    //     }

    //     if (!client.isReady()) {
    //         return res.status(503).json({ error: 'Bot Discord non prêt' });
    //     }

    //     const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);

    //     if (!channel) {
    //         return res.status(404).json({ error: 'Salon introuvable' });
    //     }

    //     if (!channel.isTextBased()) {
    //         return res.status(400).json({ error: 'Le salon n’est pas textuel' });
    //     }

    //     const textChannel = channel as TextChannel;
    //     const content = title
    //         ? `**${title}**\n${message}`
    //         : message;

    //     await textChannel.send({ content });

    //     return res.status(200).json({ ok: true });
    // } catch (error) {
    //     console.error('Erreur /notify :', error);
    //     return res.status(500).json({ error: 'Erreur interne' });
    // }
};


export default { notify };