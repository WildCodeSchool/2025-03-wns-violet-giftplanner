import "dotenv/config";
import app from "./app";
import client from "./bot";

const { DISCORD_TOKEN } = process.env;

if (!DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN manquant dans .env');
}

// Get the port from the environment variables
const port = process.env.APP_PORT;

if (!port) {
    throw new Error('APP_PORT manquant dans .env');
}

// Start the server and listen on the specified port
app
    .listen(port, () => {
        console.info(`Server is listening on port ${port}`);
    })
    .on("error", (err: Error) => {
        console.error("Error:", err.message);
    });


client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user?.tag}`);
});


async function start(): Promise<void> {
    await client.login(DISCORD_TOKEN);
}

start().catch((error) => {
    console.error('Erreur au démarrage :', error);
    process.exit(1);
});