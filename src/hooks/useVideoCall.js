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

    // Ensure local stream is ready before setting up handlers
    (async () => {
      await startLocalStream();

      // Handle incoming calls
      if (peer.current) {
        peer.current.on("call", (call) => {
          if (localStream.current) {
            call.answer(localStream.current);
            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });
          } else {
            console.error("Local stream is not available for answering calls.");
          }
        });
      }
    })();

    // Handle peer matched event
    if (socket.current) {
      socket.current.on("matched", (data) => {
        console.log("Matched with peer:", data.CommonId || data.peerId);
        setIsMatched(true);

        // Start call with matched peer
        const remotePeerId = data.CommonId || data.peerId; // Adjust key as needed
        if (remotePeerId) {
          startPeerCall(remotePeerId);
        } else {
          console.error("No valid peer ID provided for matching.");
        }
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (peer.current) {
        peer.current.destroy();
      }
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
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const startPeerCall = (remotePeerId) => {
    if (!localStream.current) {
      console.error("Local stream is not available for starting a call.");
      return;
    }

    const call = peer.current.call(remotePeerId, localStream.current);
    if (call) {
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
    } else {
      console.error("Failed to initiate a call.");
    }
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
