import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const wsServer = new Server(httpServer);

  const countUsers = (roomName) => {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
  };

  wsServer.on("connection", (socket) => {
    socket["nickname"] = "익명";
    console.log("socket connected!");

    socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });

    socket.on("nickname", (nickname) => {
      socket["nickname"] = nickname;
    });

    socket.on("enter_room", (roomName) => {
      socket.join(roomName);
      socket
        .to(roomName)
        .emit("welcome", socket.nickname, countUsers(roomName));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
