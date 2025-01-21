import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import URL from "../utils/constant";

const useVideoCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peer = useRef(null);
  const localStream = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Initialize Socket.io connection
    socket.current = io(URL, {
      auth: {
        token: token,
      },
    });

    // Initialize Peer instance
    peer.current = new Peer({
      host: "openchat-b-production.up.railway.app", // Replace with your PeerJS server host
      port: 443,                        // Replace with your server port (default: 9000)
      path: "/peerjs",                   // Replace with your server path (default: /peerjs)
      secure: true,                      // Use true for HTTPS; false for HTTP
    });
    // Handle Peer open event to get peer ID
    peer.current.on("open", (id) => {
      console.log("Peer ID:", id);
    });

    // Handle incoming calls
    peer.current.on("call", (call) => {
      console.log("Receiving a call...");
      if (localStream.current) {
        call.answer(localStream.current); // Answer the call with the local stream
        call.on("stream", (remoteStream) => {
          console.log("Receiving remote stream");
          remoteVideoRef.current.srcObject = remoteStream; // Set remote video stream
        });
      }
    });

    // Handle local stream setup
    startLocalStream();

    // Handle peer matched event
    socket.current.on("matched", (data) => {
      console.log("Matched with peer:", data);
      const { commonId } = data;
      console.log(commonId)
      setIsMatched(true);
      setPeerId(commonId); // Set Peer ID for connection
    });

    return () => {
      socket.current.disconnect();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Establish a Peer connection when peerId is set
    if (peerId && peer.current) {
      console.log("Attempting to call peer:", peerId);
      callRef.current = peer.current.call(peerId, localStream.current); // Initiate a call to the peer
      callRef.current.on("stream", (remoteStream) => {
        console.log("Connected to remote stream");
        remoteVideoRef.current.srcObject = remoteStream; // Set remote video stream
      });

      callRef.current.on("close", () => {
        console.log("Call ended");
        remoteVideoRef.current.srcObject = null;
      });

      callRef.current.on("error", (error) => {
        console.error("Call error:", error);
      });
    }
  }, [peerId]);

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

  return {
    peerId,
    isMatched,
    localVideoRef,
    remoteVideoRef,
    socket,
    peer,
    startLocalStream,
  };
};

export default useVideoCall;
