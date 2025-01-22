import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import URL from "../utils/constant";
import "./Video.css";

const Videos = () => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [loading, setLoading] = useState(false); // State for button loading
  const localVideoRef = useRef(null);
  const peer = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with actual token retrieval

    peer.current = new Peer({
      host: "openchat-b-production.up.railway.app", // Replace with your Peer server host
      port: 443,
      path: "/peerjs",
      secure: true,
    });

    socket.current = io(URL, {
      auth: {
        token,
      },
    });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.current.on("matched", (data) => {
      console.log("Matched event received:", data);
      setMatchDetails(data);
      if (data.isInitiator) {
        callPeer(data.matchedWith);
      }
      setLoading(false); // Stop loading when match event is received
    });

    peer.current.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);
    });

    peer.current.on("call", (call) => {
      console.log("Incoming call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            setRemoteStream(remoteStream);
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream:", err);
        });
    });

    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    return () => {
      if (peer.current) peer.current.destroy();
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const showCameraVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log("Camera video is now being displayed on screen.");
      setLocalStream(stream);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  useEffect(() => {
    showCameraVideo();
  }, []);

  const callPeer = async (remotePeerId) => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const call = peer.current.call(remotePeerId, localStream);
      call.on("stream", (remoteStream) => {
        console.log("Connected to remote peer's stream");
        setRemoteStream(remoteStream);
      });
    } catch (err) {
      console.error("Failed to initiate call:", err);
    }
  };

  const handleMatch = () => {
    if (peerId) {
      setLoading(true); // Start loading when match button is clicked
      console.log("Firing match event with Peer ID:", peerId);
      socket.current.emit("match", peerId);
    }
  };

  return (
    <div className="container">
      <h1>Video Chat</h1>

      <button onClick={handleMatch} disabled={loading}>
        {loading ? "Finding Match..." : "Find Match"}
      </button>

      <div className="video-container">
        <div className="remote-video">
          <video
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = remoteStream;
                videoElement.play();
              }
            }}
            autoPlay
            controls
          />
          <label>Remote Video</label>
        </div>

        <div className="local-video">
          <video ref={localVideoRef} autoPlay controls />
          <label>Local Video</label>
        </div>
      </div>

      {peerId && <p>Your Peer ID: {peerId}</p>}

      {matchDetails && (
        <div className="match-details">
          <h3>Matched With: {matchDetails.matchedWith}</h3>
          <p>Common ID: {matchDetails.commonId}</p>
          <p>Initiator: {matchDetails.isInitiator ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
};

export default Videos;
