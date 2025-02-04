import React, { useEffect } from "react";
import usePeerConnection from "../hooks/useVideoCall";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const VideoChat = () => {
  const { peerId, callPeer, remoteStream, handleMatch, matchDetails } = usePeerConnection();

  useEffect(() => {
    if (matchDetails) {
      console.log("Matched with:", matchDetails);
    }
  }, [matchDetails]);

  return (
    <>
    <Header/>
    <div className="vodeo-h">
      <h1>Video Chat</h1>
      <button onClick={handleMatch}>Find Match</button>
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
          />
        )}
      </div>
      {peerId && <p>Your Peer ID: {peerId}</p>}
    </div>
    <Footer/>
    </>
  );
};

export default VideoChat;
