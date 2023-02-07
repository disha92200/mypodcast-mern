import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import RoomCard from "../../components/RoomCard/RoomCard";
import { getAllRooms } from "../../http";
import styles from "./Rooms.module.css";
// const rooms = [
//     {
//         id: 1,
//         topic: 'Which framework best for frontend ?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Johndjsskjhr Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 3,
//         topic: 'What’s new in machine learning?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 4,
//         topic: 'Why people use stack overflow?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 5,
//         topic: 'Artificial inteligence is the future?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
// ];
const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await getAllRooms();
      setRooms(data);
      setShowRooms(data);
    })();
  }, []);

  const handleModal = () => {
    setShowModal(true);
  };
  const onClose = () => {
    setShowModal(false);
  };

  const handleSearch = (e) => {
    setShowRooms(
      rooms.filter((room) => {
        if (room.topic.toLowerCase().includes(e.target.value.toLowerCase()))
          return room;
      })
    );
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.left}>
            <span className={styles.leftText}>All voice rooms</span>
            <div className={styles.inputWrapper}>
              <img
                className={styles.searchImg}
                src="/images/search.png"
                alt=""
              />
              <input
                className={styles.searchInput}
                type="text"
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className={styles.right}>
            <button className={styles.rightButton} onClick={handleModal}>
              <img
                className={styles.roomIcon}
                src="/images/add-room-icon.png"
                alt=""
              />
              Start a room
            </button>
          </div>
        </div>

        <div className={styles.roomList}>
          {showRooms.map((room) => {
            return <RoomCard key={room.id} room={room} />;
          })}
        </div>
      </div>
      {showModal && <AddRoomModal onCross={onClose} />}
    </>
  );
};

export default Rooms;
