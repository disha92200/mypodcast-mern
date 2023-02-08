import { useEffect } from "react";
import { useCallback } from "react";
import { useRef, useState } from "react";
import { useStateWithCallBack } from "./useStateWithCallback";
import { socketInit } from "../socket/index";
import ACTIONS from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallBack([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const clientsRef = useRef([]);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const socket = useRef(null);

  const addNewClient = useCallback(
    async (newClient, cb) => {
      const lookingFor = await clients.find((client) => {
        return client.id === newClient.id;
      });
      if (lookingFor === undefined) {
        setClients((presentClients) => {
          if (presentClients) {
            return [...presentClients, newClient];
          } else {
            return [newClient];
          }
        }, cb);
      }
    },
    [clients, setClients]
  );
  useEffect(() => {
    socket.current = socketInit();
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        clientsRef.current = clients;
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      localMediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected to ${peerId} (${remoteUser.name})`
        );
      }
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        await connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  // remove peer

  useEffect(() => {
    const handleRemovePeer = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[userId];

      setClients((list) => {
        return list.filter((client) => client.id != userId);
      });
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);
  // useEffect =
  //   (() => {
  //     clientsRef.current = clients;
  //   },
  //   [clients]);
  useEffect(() => {
    const setMute = (mute, userId) => {
      setClients((list) => {
        const clientIdx = list.map((client) => client.id).indexOf(userId);
        if (clientIdx > -1) {
          const connectedClients = JSON.parse(JSON.stringify(list));
          connectedClients[clientIdx].muted = mute;
          return connectedClients;
        } else return list;
      });
    };
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });

    const setRaiseHand = (isRaise, userId) => {
      setClients((list) => {
        const clientIdx = list.map((client) => client.id).indexOf(userId);
        if (clientIdx > -1) {
          const connectedClients = JSON.parse(JSON.stringify(list));
          connectedClients[clientIdx].raiseHand = isRaise;
          return connectedClients;
        } else return list;
      });
    };
    socket.current.on(ACTIONS.RAISE_HAND, ({ peerId, userId }) => {
      setRaiseHand(true, userId);
    });
    socket.current.on(ACTIONS.UNRAISE_HAND, ({ peerId, userId }) => {
      setRaiseHand(false, userId);
    });
  }, []);

  const handleMute = (isMute, userId) => {
    let settled = false;
    const interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        settled = true;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, {
            roomId,
            userId,
          });
        }
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleRaiseHand = (isRaiseHand, userId) => {
    if (isRaiseHand) {
      socket.current.emit(ACTIONS.RAISE_HAND, {
        roomId,
        userId,
      });
    } else {
      socket.current.emit(ACTIONS.UNRAISE_HAND, {
        roomId,
        userId,
      });
    }
  };

  return { clients, provideRef, handleMute, handleRaiseHand };
};

// useEffect(() => {
//   socket.current = socketInit();

//   startCapture().then(() => {
//     addNewClient({ ...user, muted: true, raiseHand: false }, () => {
//       const localElement = audioElements.current[user.id];
//       if (localElement) {
//         localElement.volume = 0;
//         localElement.srcObject = localMediaStream.current;
//       }
//       clientsRef.current = clients;
//       socket.current.emit(ACTIONS.JOIN, { roomId, user });
//     });
//   });

//   socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

//   socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
//     if (icecandidate && connections.current[peerId]) {
//       connections.current[peerId].addIceCandidate(icecandidate);
//     }
//   });

//   socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

//   socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

//   socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
//     setMute(true, userId);
//   });
//   socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
//     setMute(false, userId);
//   });

//   socket.current.on(ACTIONS.RAISE_HAND, ({ peerId, userId }) => {
//     setRaiseHand(true, userId);
//   });
//   socket.current.on(ACTIONS.UNRAISE_HAND, ({ peerId, userId }) => {
//     setRaiseHand(false, userId);
//   });

//   return () => {
//     localMediaStream.current.getTracks().forEach((track) => {
//       track.stop();
//     });
//     socket.current.emit(ACTIONS.LEAVE, { roomId });
//     socket.current.off(ACTIONS.ADD_PEER);
//     socket.current.off(ACTIONS.ICE_CANDIDATE);
//     socket.current.off(ACTIONS.SESSION_DESCRIPTION);
//     socket.current.off(ACTIONS.REMOVE_PEER);
//   };
// }, []);

// const startCapture = async () => {
//   localMediaStream.current = await navigator.mediaDevices.getUserMedia({
//     audio: true,
//   });
// };

// const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
//   if (peerId in connections.current) {
//     return console.warn(
//       `You are already connected to ${peerId} (${remoteUser.name})`
//     );
//   }
//   connections.current[peerId] = new RTCPeerConnection({
//     iceServers: freeice(),
//   });
//   connections.current[peerId].onicecandidate = (event) => {
//     socket.current.emit(ACTIONS.RELAY_ICE, {
//       peerId,
//       icecandidate: event.candidate,
//     });
//   };

//   connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
//     if (clients.length > 1) {
//       addNewClient({ ...remoteUser, muted: true, raiseHand: false }, () => {
//         if (audioElements.current[remoteUser.id]) {
//           audioElements.current[remoteUser.id].srcObject = remoteStream;
//         } else {
//           let settled = false;
//           const interval = setInterval(() => {
//             if (audioElements.current[remoteUser.id]) {
//               audioElements.current[remoteUser.id].srcObject = remoteStream;
//               settled = true;
//             }
//             if (settled) {
//               clearInterval(interval);
//             }
//           }, 1000);
//         }
//       });
//     }
//   };
//   localMediaStream.current.getTracks().forEach((track) => {
//     connections.current[peerId].addTrack(track, localMediaStream.current);
//   });

//   if (createOffer) {
//     const offer = await connections.current[peerId].createOffer();
//     await connections.current[peerId].setLocalDescription(offer);

//     socket.current.emit(ACTIONS.RELAY_SDP, {
//       peerId,
//       sessionDescription: offer,
//     });
//   }
// };

// const handleRemoteSdp = async ({
//   peerId,
//   sessionDescription: remoteSessionDescription,
// }) => {
//   connections.current[peerId].setRemoteDescription(
//     new RTCSessionDescription(remoteSessionDescription)
//   );

//   if (remoteSessionDescription.type === "offer") {
//     const connection = connections.current[peerId];
//     const answer = await connection.createAnswer();

//     await connection.setLocalDescription(answer);

//     socket.current.emit(ACTIONS.RELAY_SDP, {
//       peerId,
//       sessionDescription: answer,
//     });
//   }
// };

// const handleRemovePeer = async ({ peerId, userId }) => {
//   if (connections.current[peerId]) {
//     connections.current[peerId].close();
//   }

//   delete connections.current[peerId];
//   delete audioElements.current[userId];

//   setClients((list) => {
//     return list.filter((client) => client.id != userId);
//   });
// };

// const setMute = (mute, userId) => {
//   setClients((list) => {
//     if (list) {
//       const clientIdx = list.map((client) => client.id).indexOf(userId);
//       if (clientIdx > -1) {
//         const connectedClients = JSON.parse(JSON.stringify(list));
//         connectedClients[clientIdx].muted = mute;
//         return connectedClients;
//       }
//     }
//   });
// };

// const setRaiseHand = (isRaise, userId) => {
//   setClients((list) => {
//     if (list) {
//       const clientIdx = list.map((client) => client.id).indexOf(userId);
//       if (clientIdx > -1) {
//         const connectedClients = JSON.parse(JSON.stringify(list));
//         connectedClients[clientIdx].raiseHand = isRaise;
//         return connectedClients;
//       }
//     }
//   });
// };
