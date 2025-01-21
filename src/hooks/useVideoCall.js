import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import URL from "../utils/constant";

const useVideoCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [isMatched, setIsMatched] = useState(false);
  const [peer, setPeer] = useState(null); // Use state to store peer instance
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const localStream = useRef(null);
  const callRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Initialize Socket.io connection and Peer instance
    const initializePeerAndSocket = async () => {
      // Initialize Socket.io
      socket.current = io(URL, {
        auth: { token: token },
      });

      // Initialize Peer instance
      const peerInstance = new Peer({
        host: "openchat-b-production.up.railway.app",  // Replace with your peer server host
        port: 443,                        // Replace with correct port
        path: "/peerjs",
        secure: true,                      // Set to true if you're using HTTPS
      });

      // Set peer instance in state
      setPeer(peerInstance);

      // Handle Peer open event to get peer ID
      peerInstance.on("open", (id) => {
        console.log("Peer ID:", id);
      });

      // Handle incoming calls
      peerInstance.on("call", (call) => {
        console.log("Receiving a call...");
        if (localStream.current) {
          call.answer(localStream.current); // Answer the call with the local stream
          call.on("stream", (remoteStream) => {
            console.log("Receiving remote stream");
            remoteVideoRef.current.srcObject = remoteStream; // Set remote video stream
          });
        }
      });

      // Handle peer matched event from the server
      socket.current.on("matched", (data) => {
        console.log("Matched with peer:", data);
        const { commonId } = data;
        setIsMatched(true);
        setPeerId(commonId); // Set Peer ID for connection
      });
    };

    initializePeerAndSocket();

    // Cleanup function to disconnect socket and peer when component unmounts
    return () => {
      if (socket.current) socket.current.disconnect();
      if (peer) peer.destroy();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peer]); // Dependency on peer state

  useEffect(() => {
    // Establish a Peer connection when peerId is set
    if (peerId && peer) {
      console.log("Attempting to call peer:", peerId);
      callRef.current = peer.call(peerId, localStream.current); // Initiate a call to the peer
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
  }, [peerId, peer]); // Run when peerId or peer state changes

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

  // Start local stream when component mounts
  useEffect(() => {
    startLocalStream();
  }, []);

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
