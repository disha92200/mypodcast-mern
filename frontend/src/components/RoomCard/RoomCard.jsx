import React from "react";
import styles from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const colors = ["#5453E0", "#BB6BD9", "#E91E63", "#219653", "#F2C94C"];

  return (
    <div
      onClick={() => {
        navigate(`/room/${room.id}`);
      }}
      className={styles.roomCard}
    >
      <h3 className={styles.roomTopic}>{room.topic}</h3>
      <div
        className={`${styles.speakersWrapper} ${
          room.speakers.length === 1 ? styles.singleSpeaker : ""
        }`}
      >
        <div className={styles.avatarWrapper}>
          {room.speakers.map((speaker) => {
            return (
              <img
                key={speaker._id}
                className={styles.avatar}
                style={{
                  border: `solid 3px ${
                    colors[Math.floor(Math.random() * colors.length)]
                  }`,
                }}
                src={speaker.avatar}
                alt=""
              />
            );
          })}
        </div>
        <div className={styles.nameWrapper}>
          {room.speakers.map((speaker) => {
            return (
              <div key={speaker._id} className={styles.name}>
                <span>{speaker.name}</span>
                <img src="/images/chat-bubble.png" alt="" />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src="/images/people.png" alt="" />
      </div>
    </div>
  );
};

export default RoomCard;
