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

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Initialize Socket.io connection
    socket.current = io(URL, {
      auth: {
        token: token,
      },
    });

    // Initialize PeerJS client
    peer.current = new Peer(null, {
      host: "openchat-b-production.up.railway.app",
      path: "/peerjs",
      secure: true,
    });

    peer.current.on("open", (id) => {
      console.log("PeerJS ID:", id);
      setPeerId(id);
    });

    // Handle local stream setup
    startLocalStream();

    // Handle peer matched event
    socket.current.on("matched", (data) => {
      console.log("Matched with peer:", data.CommonId);
      console.log(data);
      setIsMatched(true);
      // Call the matched peer
      startPeerCall(data.peerId);
    });

    // Handle incoming calls
    peer.current.on("call", (call) => {
      call.answer(localStream.current); // Answer with local stream
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream; // Set remote video stream
      });
    });

    return () => {
      socket.current.disconnect();
      peer.current.destroy();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
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

  const startPeerCall = (remotePeerId) => {
    if (!localStream.current) return;

    const call = peer.current.call(remotePeerId, localStream.current);
    call.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
  };

  return {
    peerId,
    isMatched,
    localVideoRef,
    remoteVideoRef,
    socket,
    peer,
    startPeerCall,
    startLocalStream,
  };
};

export default useVideoCall;
