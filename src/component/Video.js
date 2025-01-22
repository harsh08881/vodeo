import React, { useEffect } from "react";
import usePeerConnection from "../hooks/useVideoCall";

const VideoChat = () => {
  const { peerId, callPeer, remoteStream, handleMatch, matchDetails } = usePeerConnection();

  useEffect(() => {
    if (matchDetails) {
      console.log("Matched with:", matchDetails);
    }
  }, [matchDetails]);

  return (
    <div>
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
  );
};

export default VideoChat;
