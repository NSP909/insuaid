import React, { useState } from "react";
import "../styles/TalkBot.css";

const TalkbotPage = () => {
  const [audioRecording, setAudioRecording] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRecording = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          const chunks = [];

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/wav" });
            setAudioRecording(blob);

            // Process the audio
            const formData = new FormData();
            formData.append("audio", blob);

            fetch("http://127.0.0.1:5000/process-audio", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.blob())
              .then((blob) => {
                const audio = new Audio(URL.createObjectURL(blob));
                audio.play();
                setIsPlaying(true);
                // Set a timeout to reset isPlaying state after the audio finishes playing
                audio.addEventListener("ended", () => {
                  setIsPlaying(false);
                });
              })
              .catch((err) =>
                console.error("Error processing and playing audio:", err)
              );
          };

          mediaRecorder.start();
          setTimeout(() => {
            mediaRecorder.stop();
          }, 5000); // Adjust recording duration as needed

          setIsRecording(true);
        })
        .catch((err) => console.error("Error recording audio:", err));
    } else {
      // Stop the recording
      setIsRecording(false);
    }
  };

  return (
    <div className="talkbot-container">
      <h1 className="talkbot-title">Voice-based Talkbot</h1>
      <button
        onClick={handleRecording}
        className={`talkbot-button ${isRecording ? "recording" : ""}`}
      >
        {!isRecording ? "Start Recording" : "Stop Recording & Process Audio"}
        {isRecording && <span className="recording-indicator"></span>}
      </button>
      <br />
      {responseText && (
        <p className="talkbot-response">Response: {responseText}</p>
      )}
      <div>
        {/* Render Play Audio button only if audio is not currently playing */}
        {isPlaying ? (
          <p>Playing audio...</p>
        ) : (
          <button
            disabled={isRecording}
            onClick={handleRecording}
            className="talkbot-button"
          >
            {!isRecording ? "Record and Play Audio" : "Recording..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default TalkbotPage;
