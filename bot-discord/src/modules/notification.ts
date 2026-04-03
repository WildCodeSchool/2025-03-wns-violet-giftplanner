import type { Request, Response } from 'express';
import client from '../bot';
import { TextChannel, EmbedBuilder } from 'discord.js';

const { DISCORD_CHANNEL_ID, DISCORD_ROLE_ID } = process.env;

if (!DISCORD_CHANNEL_ID) {
    throw new Error('DISCORD_CHANNEL_ID manquant dans .env');
}

type Environment = "production" | "staging";

export function buildDeployEmbed(environment: Environment) {
    const config = {
        production: {
            label: "PRODUCTION",
            color: 0x0099ff,
            emoji: "🚀"
        },
        staging: {
            label: "STAGING",
            color: 0x00c853,
            emoji: "🧪"
        }
    };

    const env = config[environment];

    return new EmbedBuilder()
        .setColor(env.color)
        .setTitle(`${env.emoji} Déploiement ${env.label}`)
        .setDescription("✅ Déploiement effectué avec succès")
        .addFields({
            name: "Environnement",
            value: env.label,
            inline: true
        },
            {
                name: "Application",
                value: "GitChat",
            })
        .setTimestamp()
        .setFooter({
            text: "Déploiement VPS"
        });
}


const notify = async (req: Request, res: Response) => {
    try {
        const { enviroment } = req.body as {
            enviroment?: string;
        };

        if (!enviroment || typeof enviroment !== 'string') {
            return res.status(400).json({ error: 'Champ "enviroment" requis' });
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

        const embed = buildDeployEmbed("staging"); // production ou "staging"

        await (channel as TextChannel).send({
            content: `<@&${DISCORD_ROLE_ID}>`,
            allowedMentions: {
                roles: [DISCORD_ROLE_ID!]
            },
            embeds: [embed]
        });

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Erreur /notify :', error);
        return res.status(500).json({ error: 'Erreur interne' });
    }
};


export default { notify };