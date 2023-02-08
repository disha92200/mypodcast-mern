import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import RoomCard from "../../components/RoomCard/RoomCard";
import { getAllRooms, getUserRooms } from "../../http";
import { useSelector } from "react-redux";
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
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState([]);
  const [roomType, setRoomType] = useState("all");

  useEffect(() => {
    (async () => {
      if (roomType === "all") {
        const { data } = await getAllRooms();
        setRooms(data);
        setShowRooms(data);
      } else {
        const { data } = await getUserRooms(user.id);
        setRooms(data);
        setShowRooms(data);
      }
    })();
  }, [roomType]);

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
  const handleRoomTypeChange = (e) => {
    setRoomType(e.target.value);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div className={styles.left}>
            <select
              className={styles.leftText}
              name=""
              id=""
              onChange={handleRoomTypeChange}
            >
              <option value="all">All voice rooms</option>
              <option value="my">My voice rooms</option>
            </select>
            {/* <span className={styles.leftText}>All voice rooms</span> */}
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
