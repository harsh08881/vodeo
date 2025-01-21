import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import URL from "../utils/constant"

const VideoCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    socket.current = io(URL, {
      auth: {
        token: token,
      },
    });

    socket.current.on("connect", () => {
      console.log("Connected to the server with socket ID:", socket.current.id);
      startLocalStream();
      socket.current.emit("join_queue", socket.current.id);
    });

    return () => {
      socket.current.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const startWebRTCConnection = (peerId) => {
    peerConnection.current = new RTCPeerConnection();

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.createOffer().then((offer) => {
      return peerConnection.current.setLocalDescription(offer);
    }).then(() => {
      socket.current.emit("webrtc_offer", {
        peerId,
        offer: peerConnection.current.localDescription,
      });
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("webrtc_ice_candidate", {
          peerId,
          candidate: event.candidate,
        });
      }
    };
  };

 
  const triggerMatch = () => {
    // Emit event to trigger match request
    socket.current.emit("match");
  };

  return (
    <div>
      <h1>Video Call</h1>

      <div>
        <h2>Local Video</h2>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          style={{ width: "300px", height: "200px", border: "2px solid black" }}
        ></video>
      </div>

      </div>
  );
};

export default VideoCall;
