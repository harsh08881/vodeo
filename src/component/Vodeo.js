import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import URL from "../utils/constant";

const Videos = () => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [inputPeerId, setInputPeerId] = useState(""); // State to store the peerId entered by the user
  const [matchDetails, setMatchDetails] = useState(null); // Store match details
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const peer = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Retrieve token from localStorage or other secure places
    const token = localStorage.getItem("token");  // Replace with actual token retrieval

    // Initialize PeerJS
    peer.current = new Peer({
      host: "openchat-b-production.up.railway.app", // Replace with your Peer server host
      port: 443,                                   // Replace with correct port
      path: "/peerjs",
      secure: true,                                // Set to true if you're using HTTPS
    });

    // Initialize Socket.IO with authentication token
    socket.current = io(URL, {
      auth: {
        token, // Sending the token during the handshake
      }
    });

    socket.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Listen for 'matched' event
    socket.current.on("matched", (data) => {
      console.log("Matched event received:", data);
      setMatchDetails(data); // Store match details in state
      if(data.isInitiator){
      callPeer(data.matchedWith);
      }
    });

    // Handle Peer connection open event
    peer.current.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id); // Set local Peer ID
    });

    // Handle incoming calls
    peer.current.on("call", (call) => {
      console.log("Incoming call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with the local stream
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream");
            setRemoteStream(remoteStream); // Store the remote stream
          });
        })
        .catch((err) => {
          console.error("Failed to get local stream:", err);
        });
    });

    // Handle Peer errors
    peer.current.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    // Cleanup on component unmount
    return () => {
      if (peer.current) peer.current.destroy();
      if (socket.current) socket.current.disconnect();
    };
  }, []);

   // Function to show camera video on screen
   const showCameraVideo = async () => {
    try {
      // Request access to the camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,  // You can also include audio: true if you need microphone access
        audio: true,
      });

      // Set the stream as the source for the local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      console.log("Camera video is now being displayed on screen.");
      setLocalStream(stream); // Save the stream in state
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
        setRemoteStream(remoteStream); // Store the remote stream
      });
    } catch (err) {
      console.error("Failed to initiate call:", err);
    }
  };

  // Handle match event
  const handleMatch = () => {
    if (peerId) {
      console.log("Firing match event with Peer ID:", peerId);
      socket.current.emit("match", peerId); // Emit a match event with the peerId
    }
  };


      
  
  return (
    <div>
      <h1>Video Chat</h1>
      {/* Match button */}
      <button onClick={handleMatch}>Find Match</button>

      {/* Display remote stream if connected */}
      <div>
        {remoteStream && (
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
        )}
      </div>
      <video
            ref={localVideoRef}
            autoPlay
            controls
       />

      <div>

      </div>

      {/* Display local Peer ID */}
      {peerId && <p>Your Peer ID: {peerId}</p>}

      {/* Display match details */}
      {matchDetails && (
        <div>
          <h3>Matched With: {matchDetails.matchedWith}</h3>
          <p>Common ID: {matchDetails.commonId}</p>
          <p>Initiator: {matchDetails.isInitiator ? "Yes" : "No"}</p>
        </div>
      )}
    </div>

  );
};

export default Videos;
