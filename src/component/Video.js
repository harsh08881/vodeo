// src/components/VideoCall.js

import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";

const VideoCall = () => {
  const [userId, setUserId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [peerIdToMatch, setPeerIdToMatch] = useState(null);
  const userVideoRef = useRef(null);
  const peerVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const socket = useRef(null); // Socket instance
  const peer = useRef(null); // PeerJS instance
  const [connectionStatus, setConnectionStatus] = useState("");

  // Handle media stream
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      userVideoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing media devices", err);
    }
  };

  // Initialize PeerJS connection
  const createPeerConnection = () => {
    peer.current = new Peer({
      key: "peerjs", // Optional: Replace with your PeerJS credentials if needed
    });

    peer.current.on("open", (id) => {
      setUserId(id);
      console.log("Your peer ID: ", id);

      // Listen for incoming calls
      peer.current.on("call", (call) => {
        console.log("Incoming call from ", call.peer);
        call.answer(localStream); // Answer the call with the local stream

        call.on("stream", (remoteStream) => {
          peerVideoRef.current.srcObject = remoteStream;
        });
      });
    });
  };

  // Start call with the matched user
  const startCall = (peerId) => {
    const call = peer.current.call(peerId, localStream);

    call.on("stream", (remoteStream) => {
      peerVideoRef.current.srcObject = remoteStream;
    });
  };

  // Handle match event from the server
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setConnectionStatus("Unauthorized: Token not found.");
      return;
    }

    // Initialize the Socket.IO connection with token in the handshake
    const socketInstance = io("http://localhost:3002", {
      auth: {
        token: token, // Send the token in the handshake
      },
    });

    socket.current = socketInstance;

    // Listen for match event
    socket.current.on("matchFound", (data) => {
      console.log("Match found with user:", data.peerId);
      setIsMatched(true);
      startCall(data.peerId);
    });

    return () => {
      socket.current.off("matchFound");
      socket.current.disconnect();
    };
  }, []);

  // Handle button click to trigger match event
  const handleMatchButtonClick = () => {
    if (userId) {
      console.log("Match button clicked, sending match request to server...");
      socket.current.emit("match", userId); // Emit the match event to server
    }
  };

  // Handle video/audio toggling
  const toggleVideo = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  };

  const toggleAudio = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
  };

  // Connect to socket server and get media on component mount
  useEffect(() => {
    getUserMedia();
    createPeerConnection();

    return () => {
      // Cleanup
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h2>Video Call</h2>

      <div>
        <video ref={userVideoRef} autoPlay muted></video>
        <video ref={peerVideoRef} autoPlay></video>
      </div>

      <div>
        <button onClick={toggleVideo}>
          {localStream && localStream.getVideoTracks()[0].enabled ? "Turn Off Video" : "Turn On Video"}
        </button>
        <button onClick={toggleAudio}>
          {localStream && localStream.getAudioTracks()[0].enabled ? "Mute Audio" : "Unmute Audio"}
        </button>
      </div>

      <button onClick={handleMatchButtonClick}>Match</button> {/* Match Button */}
      {isMatched && <p>You are matched with another user!</p>}
      {connectionStatus && <p>{connectionStatus}</p>} {/* Show connection status */}
    </div>
  );
};

export default VideoCall;
