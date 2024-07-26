"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../../../contexts/SocketContext";
import styles from "./page.module.scss";
import { EVENT } from "../../../../constants/socketEvents";

interface Params {
  params: { roomName: string };
}

const Room = ({ params: { roomName } }: Params) => {
  const [userCount, setUserCount] = useState();
  const socket = useSocket();
  const inputRef = useRef(null);

  const addMessage = (message) => {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
  };

  //컴포넌트가 마운트될 때와 roomName 또는 socket이 변경될 때마다 실행
  useEffect(() => {
    //클라이언트가 방에 들어가겠다는 메시지를 서버에 보냄
    socket.emit(EVENT.ENTER_ROOM, roomName, (count) => {
      setUserCount(count);
    });

    //서버로부터 'welcome' 이벤트를 받을 때 실행될 콜백 함수를 등록
    socket.on(EVENT.WELCOME, (userNickname, count) => {
      setUserCount(count);
      addMessage(`\"${userNickname}\"님이 입장하셨습니다.`);
    });

    socket.on(EVENT.BYE, (userLeft, count) => {
      setUserCount(count);
      addMessage(`\"${userLeft}\"님이 나가셨습니다.`);
    });

    socket.on(EVENT.NEW_MESSAGE, addMessage);

    //컴포넌트가 언마운트될 때 'welcome' 이벤트 리스너를 제거
    return () => {
      socket.off(EVENT.WELCOME);
      socket.off(EVENT.BYE);
      socket.off(EVENT.NEW_MESSAGE);
    };
  }, [roomName, socket]);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      const message = inputRef.current.value;
      socket.emit(EVENT.NEW_MESSAGE, message, roomName, () => {
        addMessage(`${socket.nickname}(나): ${message}`);
      });
    }
    inputRef.current.value = "";
  };

  return (
    <div>
      <h1>방: {roomName}</h1>
      <h4>{`접속 중인 사용자: ${userCount}명`}</h4>
      <div className={styles.chats}>
        <ul className={styles.ul}></ul>
      </div>
      <form className={styles.form} onSubmit={handleMessageSubmit}>
        <input
          className={styles.input}
          placeholder="메시지를 입력하세요."
          type="text"
          ref={inputRef}
        />
        <button type="submit">보내기</button>
      </form>
    </div>
  );
};

export default Room;
