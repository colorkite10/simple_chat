import NickNameInput from "../../components/Input/NickNameInput";
import RoomNameInput from "../../components/Input/RoomNameInput";
import Rooms from "../../components/Rooms/Rooms";
import styles from "./page.module.scss";

const HomePage = () => {
  return (
    <div>
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
      <div>
        <Rooms />
      </div>
    </div>
  );
};

export default HomePage;
