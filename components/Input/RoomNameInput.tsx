"use client";

import { useRef } from "react";
import styles from "./Input.module.scss";
import { socket } from "../../socket";
import { useRouter } from "next/navigation";

interface InputProps {
  inputTitle: string | null;
  placeholder: string;
  buttonText: string;
}

const RoomNameInput = ({ inputTitle, placeholder, buttonText }: InputProps) => {
  const inputRef = useRef(null);
  const router = useRouter();

  const handleRoomSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      const roomName = inputRef.current.value;
      socket.emit("enter_room", roomName);
      console.log(socket.id);
      router.push(`/${roomName}`);
    }
  };

  return (
    <div className={styles.container}>
      <span>{inputTitle ?? ""}</span>
      <form className={styles.form}>
        <input
          className={styles.input}
          placeholder={placeholder}
          type="text"
          ref={inputRef}
        />
        <button
          className={styles.button}
          onClick={handleRoomSubmit}
          type="submit"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default RoomNameInput;
