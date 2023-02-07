import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useWebRTC } from "../../hooks/useWebRTC";
import { getRoom } from "../../http";
import styles from "./Room.module.css";

const Room = () => {
  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [isMute, setIsMute] = useState(true);
  const handleManualLeave = () => {
    navigate("/rooms");
  };
  const avatarStyle = {
    border: `3px solid #5453E0`,
  };
  const [room, setRoom] = useState(null);
  useEffect(() => {
    getRoom(roomId).then(({ data }) => {
      setRoom(data);
    });
  }, [roomId]);
  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);
  const handleButtonMute = (clientId) => {
    if (clientId != user.id) return;
    setIsMute((prev) => !prev);
  };
  return (
    <div>
      <div className={styles.container}>
        <button className={styles.goBack} onClick={handleManualLeave}>
          <img src="/images/arrow_back.png" alt="arrow" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientWrapper}>
        <div className={styles.clientHeader}>
          <h2>{room && room.topic}</h2>
          <div className={styles.headerRight}>
            <button className={styles.handButton}>
              <img src="/images/hand.png" alt="hand" />
            </button>
            <button className={styles.leaveButton} onClick={handleManualLeave}>
              <img src="/images/leave.png" alt="leave" />
              <span>leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientList}>
          {clients.map((client) => {
            return (
              <div key={client.id} className={styles.userWrapper}>
                <div className={styles.userHead}>
                  <audio
                    autoPlay
                    ref={(instance) => provideRef(instance, client.id)}
                  ></audio>
                  <img
                    src={client.avatar}
                    className={styles.avatar}
                    style={avatarStyle}
                    alt=""
                  />
                  <button
                    className={styles.micOff}
                    onClick={() => handleButtonMute(client.id)}
                  >
                    {client.muted ? (
                      <img src="/images/mic-mute.png" alt="" />
                    ) : (
                      <img src="/images/mic.png" alt="" />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
