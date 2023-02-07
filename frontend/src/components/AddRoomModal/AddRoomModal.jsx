import React from "react";
import { useState } from "react";
import { createRoom } from "../../http";
import styles from "./AddRoomModal.module.css";
import { useNavigate } from "react-router-dom";

const AddRoomModal = ({ onCross }) => {
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!topic) {
      alert("all fields required !");
      return;
    }
    try {
      const { data } = await createRoom({ topic, roomType });
      //console.log(data)
      navigate(`/room/${data.id}`);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button className={styles.crossButton} onClick={onCross}>
          <img src="/images/cross.png" alt="" />
        </button>
        <div className={styles.modalHeader}>
          <div className={styles.heading}>Enter the topic to be discussed</div>
          <input
            className={styles.modalInput}
            type="text"
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className={styles.typeHeading}>Room Type</div>
          <div className={styles.modalRoomType}>
            <button
              className={roomType === "open" ? styles.active : ""}
              onClick={() => setRoomType("open")}
            >
              <img src="/images/Globe.png" alt="" />
              <p>Open</p>
            </button>
            <button
              className={roomType === "social" ? styles.active : ""}
              onClick={() => setRoomType("social")}
            >
              <img src="/images/users.png" alt="" />
              <p>Social</p>
            </button>
            <button
              className={roomType === "private" ? styles.active : ""}
              onClick={() => setRoomType("private")}
            >
              <img src="/images/Lock.png" alt="" />
              <p>Private</p>
            </button>
          </div>
        </div>
        <hr></hr>
        <div className={styles.modalFooter}>
          <div className={styles.footerText}>
            Start a room, open to everyone
          </div>
          <div className={styles.footerButtonWrapper}>
            <button className={styles.footerButton} onClick={handleSubmit}>
              <img src="/images/party.png" alt="" />
              <span>Let's Go</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
