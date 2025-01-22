import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import io from "socket.io-client";
import URL from "../utils/constant";

const Videos = () => {
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [inputPeerId, setInputPeerId] = useState(""); // State to store the peerId entered by the user
  const [matchDetails, setMatchDetails] = useState(null); // Store match details
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
      setMatchDetails(data);  // Store match details in state
    });

    // Handle Peer connection open event
    peer.current.on("open", (id) => {
      console.log("Peer ID:", id);
      setPeerId(id); // Set local Peer ID
      socket.current.emit("register", id); // Send Peer ID to the server
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

  const handleConnect = (event) => {
    event.preventDefault();
    if (inputPeerId && peerId !== inputPeerId) {
      // Call the peer if the peerId is valid
      callPeer(inputPeerId);
    } else {
      alert("Please enter a valid peerId to connect.");
    }
  };

  return (
    <div>
      <h1>Video Chat</h1>
      {/* Match button */}
      <button onClick={handleMatch}>Find Match</button>

      {/* Input to enter peerId and button to connect */}
      <div>
        <input
          type="text"
          value={inputPeerId}
          onChange={(e) => setInputPeerId(e.target.value)} // Update the inputPeerId state
          placeholder="Enter peerId to connect"
        />
        <button onClick={handleConnect}>Connect</button>
      </div>

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
