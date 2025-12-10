import dotenv from "dotenv";
dotenv.config();

import { httpServer } from "./io";

// Get the port from the environment variables
const port = process.env.MESSAGE_SERVICE_PORT;

// lance express + socket.io
httpServer
    .listen(port, () => {
        console.info(`Server is listening on port ${port}`);
    })
    .on("error", (err: Error) => {
        console.error("Error:", err.message);
    });
