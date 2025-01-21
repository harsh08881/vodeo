import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const VideoCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [waitingCount, setWaitingCount] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    socket.current = io("http://localhost:3002", {
      auth: {
        token: token,
      },
    });

    socket.current.on("connect", () => {
      console.log("Connected to the server with socket ID:", socket.current.id);
      startLocalStream();
      socket.current.emit("join_queue", socket.current.id);
    });

    socket.current.on("matchfound", ({ peerId, matchDetails }) => {
      console.log("Match found with peer:", peerId);
      setPeerId(peerId);
      setIsMatched(true);
      setMatchDetails(matchDetails); // Save match details
      startWebRTCConnection(peerId);
    });

    // Listen for incoming ICE candidates
    socket.current.on("webrtc_ice_candidate", (data) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // Listen for the remote peer's answer to the offer
    socket.current.on("webrtc_answer", (data) => {
      if (peerConnection.current) {
        peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    // Listen for the waiting count response from the server
    socket.current.on("waiting_count", (count) => {
      setWaitingCount(count);
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

  const getWaitingCount = () => {
    // Emit event to the server to get the current active waiting count
    socket.current.emit("get_waiting_count");
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

      {isMatched && (
        <div>
          <h2>Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "300px", height: "200px", border: "2px solid black" }}
          ></video>
          <div>
            <h3>Match Details:</h3>
            <pre>{JSON.stringify(matchDetails, null, 2)}</pre>
          </div>
        </div>
      )}

      {!isMatched && <p>Waiting for a match...</p>}

      {/* Button to trigger match event */}
      <div>
        <button onClick={triggerMatch}>Trigger Match</button>
      </div>

      {/* Button to fetch waiting users count */}
      <div>
        <button onClick={getWaitingCount}>Get Waiting Users Count</button>
        {waitingCount !== null && (
          <p>Active Waiting Users: {waitingCount}</p>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
