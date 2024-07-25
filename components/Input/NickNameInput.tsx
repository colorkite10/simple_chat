"use client";

import { EVENT } from "../../constants/socketEvents";
import { useSocket } from "../../contexts/SocketContext";
import styles from "./Input.module.scss";
import { useRef } from "react";

interface InputProps {
  inputTitle: string | null;
  placeholder: string;
  buttonText: string;
}

const NickNameInput = ({ inputTitle, placeholder, buttonText }: InputProps) => {
  const inputRef = useRef(null);
  const socket = useSocket();

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      socket.emit(EVENT.NICKNAME, inputRef.current.value);
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
        <button className={styles.button} onClick={handleNameSubmit}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default NickNameInput;
