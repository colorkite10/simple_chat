"use client";

import { socket } from "../../socket";
import styles from "./Input.module.scss";
import { useRef } from "react";

interface InputProps {
  inputTitle: string | null;
  placeholder: string;
  buttonText: string;
}

const NickNameInput = ({ inputTitle, placeholder, buttonText }: InputProps) => {
  const inputRef = useRef(null);

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current) {
      socket.emit("nickname", inputRef.current.value);
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
