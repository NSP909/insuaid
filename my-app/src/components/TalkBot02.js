import React, { useState } from "react";
import "../styles/TalkBot02.css"; // Ensure you have the CSS file linked
import letterPdf from "./letter.pdf"; // Import the local PDF file

const TalkBot02 = () => {
  const [audioRecording, setAudioRecording] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

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

            const formData = new FormData();
            formData.append("audio", blob);

            fetch("http://127.0.0.1:5000/overcharge-chat", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (
                  response.headers.get("content-type") === "application/pdf"
                ) {
                  setPdfUrl(letterPdf);
                } else {
                  return response.blob();
                }
              })
              .then((blob) => {
                if (blob) {
                  const audio = new Audio(URL.createObjectURL(blob));
                  audio.play();
                  setIsPlaying(true);
                  audio.addEventListener("ended", () => {
                    setIsPlaying(false);
                  });
                }
              })
              .catch((err) =>
                console.error("Error processing and playing audio:", err)
              );
          };

          mediaRecorder.start();
          setTimeout(() => mediaRecorder.stop(), 5000);

          setIsRecording(true);
        })
        .catch((err) => console.error("Error recording audio:", err));
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="talkbot-container">
      <div className="content-container">
        <h1 className="talkbot-title">Healthcare Assistant</h1>
        <p className="talkbot-description">
          Welcome to your personalized healthcare assistant. Ask any question
          about your medical bills or health insurance coverage. Our AI is here
          to offer personalized advice based on the latest healthcare data.
        </p>
        <div className="talkbot-controls">
          <button className="talkbot-button" onClick={handleRecording}>
            {!isRecording
              ? "Start Recording"
              : "Stop Recording & Process Audio"}
          </button>
          {isRecording && <div className="recording-indicator"></div>}
        </div>
        {responseText && (
          <p className="talkbot-response">Response: {responseText}</p>
        )}
        <div className="talkbot-audio-feedback">
          {isPlaying ? (
            <p>Playing audio...</p>
          ) : (
            <button
              className="talkbot-button"
              disabled={isRecording}
              onClick={handleRecording}
            >
              {!isRecording ? "Record and Play Audio" : "Recording..."}
            </button>
          )}
        </div>
        {pdfUrl && (
          <div className="talkbot-pdf-viewer">
            <button
              className="talkbot-button"
              onClick={() => window.open(pdfUrl, "_blank")}
            >
              Open PDF
            </button>
            <iframe title="pdfViewer" src={pdfUrl} className="pdf-iframe" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TalkBot02;
