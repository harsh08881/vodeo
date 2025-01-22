import React from "react";
import usePeerConnection from "../hooks/useVideoCall";

const VideoChat = () => {
  const { peerId, callPeer, remoteStream, handleMatch } = usePeerConnection();

  return (
    <div>
      <h1>Video Chat</h1>
      <div>
        <p>Your Peer ID: {peerId}</p>
        <button onClick={handleMatch}>Match</button> {/* Button to trigger match */}
      </div>
      <div>
        {remoteStream && (
          <video
            ref={(ref) => {
              if (ref) ref.srcObject = remoteStream;
            }}
            autoPlay
            playsInline
          />
        )}
      </div>
    </div>
  );
};

export default VideoChat;
