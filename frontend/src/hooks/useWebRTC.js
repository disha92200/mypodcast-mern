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

  //Capturing audio
  const socket = useRef(null);
  // useEffect =
  //   (() => {
  //     socket.current = socketInit();
  //   },
  //   []);

  const addNewClient = useCallback(
    async (newClient, cb) => {
      const lookingFor = await clients.find((client) => {
        return client.id === newClient.id;
      });
      if (lookingFor === undefined) {
        setClients((presentClients) => [...presentClients, newClient], cb);
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
        }
      });
    };
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
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

  return { clients, provideRef, handleMute };
};
