"use client";

import { socket } from "../../../../socket";

interface Params {
  params: { roomName: string };
}

const Room = ({ params: { roomName } }: Params) => {
  socket.on("welcome", (userNickname, usersCount) => {
    console.log(userNickname, usersCount);
  });

  console.log("roompage: ", socket.id);

  return (
    <div>
      <h1>방: {roomName}</h1>
      <h4>접속 중인 사용자: </h4>
    </div>
  );
};

export default Room;
