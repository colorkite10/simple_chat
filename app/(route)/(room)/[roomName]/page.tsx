"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../../../contexts/SocketContext";

interface Params {
  params: { roomName: string };
}

const Room = ({ params: { roomName } }: Params) => {
  const [userCount, setUserCount] = useState(0);
  const socket = useSocket();

  //컴포넌트가 마운트될 때와 roomName 또는 socket이 변경될 때마다 실행
  useEffect(() => {
    //클라이언트가 방에 들어가겠다는 메시지를 서버에 보냄
    socket.emit("enter_room", roomName);

    //서버로부터 'welcome' 이벤트를 받을 때 실행될 콜백 함수를 등록
    socket.on("welcome", (userNickname, count) => {
      setUserCount(count);
      console.log("userCount: ", count);
    });

    //컴포넌트가 언마운트될 때 'welcome' 이벤트 리스너를 제거
    return () => {
      socket.off("welcome");
    };
  }, [roomName, socket]);

  return (
    <div>
      <h1>방: {roomName}</h1>
      <h4>{`접속 중인 사용자: ${userCount}명`}</h4>
    </div>
  );
};

export default Room;
