"use client";

import { useEffect, useState } from "react";
import { socket } from "../../socket";
import NickNameInput from "../../components/Input/NickNameInput";
import RoomNameInput from "../../components/Input/RoomNameInput";
import styles from "./page.module.scss";

const HomePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>Simple Chat</h1>
      <div className={styles.inputs}>
        <NickNameInput
          inputTitle="닉네임"
          placeholder="닉네임을 입력하세요."
          buttonText="저장"
        />
        <RoomNameInput
          inputTitle="방 제목"
          placeholder="방 제목을 입력하세요."
          buttonText="입력"
        />
      </div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
    </div>
  );
};

export default HomePage;
