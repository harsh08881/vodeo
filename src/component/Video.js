import React from "react";
import useVideoCall from "../hooks/useVideoCall";

const VideoCall = () => {
  const {
    peerId,
    isMatched,
    localVideoRef,
    remoteVideoRef,
    startPeerCall,
    socket
  } = useVideoCall();

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

      <div>
        <h2>Remote Video</h2>
        <video
          ref={remoteVideoRef}
          autoPlay
          style={{ width: "300px", height: "200px", border: "2px solid black" }}
        ></video>
      </div>

      {isMatched ? (
        <h3>You are matched with a peer!</h3>
      ) : (
        <button onClick={triggerMatch}>Find a Match</button>
      )}
    </div>
  );
};

export default VideoCall;
