import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
/*
dev: 애플리케이션이 개발 모드인지 아닌지를 나타냄. 
      process.env.NODE_ENV가 "production"이 아니면 dev는 true가 된다.
hostname: 서버가 실행될 호스트 이름.
port: 서버가 실행될 포트 번호.
*/
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

/*
 app: Next.js 애플리케이션 생성
 handler: Next.js가 모든 요청을 처리할 수 있는 요청 핸들러 생성
 */
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

/*
app.prepare(): Next.js 애플리케이션이 준비될 때까지 기다림
httpServer: Node.js의 HTTP 서버를 생성하고 Next.js 요청 핸들러를 사용하여 모든 요청 처리
wsServer: Socket.io 서버를 생성하고 HTTP 서버와 연결
 */
app.prepare().then(() => {
  const httpServer = createServer(handler);
  const wsServer = new Server(httpServer);

  // 주어진 방 이름에 있는 사용자 수를 반환하는 함수
  const countUsers = (roomName) => {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
  };

  //소켓 연결 처리
  //wsServer.on("connection", (socket) => { ... }): 새로운 클라이언트가 연결될 때마다 호출
  wsServer.on("connection", (socket) => {
    console.log("socket connected!");

    socket["nickname"] = "익명";

    //클라이언트가 연결을 끊을 때 호출
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    //클라이언트가 닉네임을 설정할 때 호출
    socket.on("nickname", (nickname) => {
      socket["nickname"] = nickname;
    });

    //클라이언트가 방에 들어갈 때 호출
    socket.on("enter_room", (roomName, callback) => {
      socket.join(roomName); //클라이언트를 방에 추가
      const userCount = countUsers(roomName);
      callback(userCount);
      socket.to(roomName).emit("welcome", socket.nickname, userCount);
      //방에 있는 다른 클라이언트에게 환영 메시지와 방에 있는 사용자 수를 보냄
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => {
        const userCount = countUsers(room);
        socket.to(room).emit("bye", socket.nickname, userCount - 1);
      });
    });

    socket.on("new_message", (message, room, callback) => {
      socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
      callback();
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
