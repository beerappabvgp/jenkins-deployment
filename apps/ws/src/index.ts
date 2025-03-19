import { prismaClient } from "db/client";

Bun.serve({
    port: 8081,
    fetch: (req, server) => {
        if (server.upgrade(req)) {
            return;
        }
        return new Response("Upgrade Failed ... ", { status: 500 });
    },
    websocket: {
        async message(ws: any, message: any) {
            const user = await prismaClient.user.create({
                data: {
                    username: Math.random().toString(),
                    password: Math.random().toString(),
                }
            });
            console.log("user is: ", user);
            ws.send(user);
        }
    }
});