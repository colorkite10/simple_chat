"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketContext";

const Rooms = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("room_change", (rooms) => {
      if (rooms.length === 0) {
        return;
      }
      setRooms(rooms);
    });

    return () => {
      socket.off("room_change");
    };
  }, [socket]);

  return (
    <ul>
      {rooms.map(({ roomName, roomUsersCount }) => (
        <li key={roomName}>
          `${roomName} (${roomUsersCount}명)`
        </li>
      ))}
    </ul>
  );
};

export default Rooms;
