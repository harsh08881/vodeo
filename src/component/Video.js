import React, { useState } from "react";
import useVideoCall from "../hooks/useVideoCall";

const VideoCall = () => {
  const {
    peerId,
    isMatched,
    localVideoRef,
    remoteVideoRef,
    socket,
  } = useVideoCall();

  const [isLoading, setIsLoading] = useState(false);

  const triggerMatch = () => {
    setIsLoading(true);

    // Emit event to trigger match request
    socket.current.emit("match", (response) => {
      setIsLoading(false);

      if (response?.status !== "success") {
        alert("Failed to find a match. Please try again.");
      }
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Video Call</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div>
          <h2>Local Video</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{
              width: "300px",
              height: "200px",
              border: "2px solid black",
              borderRadius: "10px",
            }}
          ></video>
        </div>

        <div>
          <h2>Remote Video</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{
              width: "300px",
              height: "200px",
              border: "2px solid black",
              borderRadius: "10px",
            }}
          ></video>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        {isMatched ? (
          <h3>You are matched with a peer!</h3>
        ) : (
          <button
            onClick={triggerMatch}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              backgroundColor: isLoading ? "#ccc" : "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {isLoading ? "Finding a Match..." : "Find a Match"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
