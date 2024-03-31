import React, { useState } from "react";

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

            // Process the audio
            const formData = new FormData();
            formData.append("audio", blob);

            fetch("http://127.0.0.1:5000/overcharge-chat", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (response.headers.get("content-type") === "application/pdf") {
                  // If response is a PDF file, set the PDF URL
                  setPdfUrl(URL.createObjectURL(response.blob()));
                } else {
                  // If response is not a PDF, assume audio file and play it
                  return response.blob();
                }
              })
              .then((blob) => {
                if (blob) {
                  const audio = new Audio(URL.createObjectURL(blob));
                  audio.play();
                  setIsPlaying(true);
                  // Set a timeout to reset isPlaying state after the audio finishes playing
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Voice-based Talkbot</h1>
      <button onClick={handleRecording}>
        {!isRecording ? "Start Recording" : "Stop Recording & Process Audio"}
      </button>
      <br />
      {responseText && <p>Response: {responseText}</p>}
      <div>
        {/* Render Play Audio button only if audio is not currently playing */}
        {isPlaying ? (
          <p>Playing audio...</p>
        ) : (
          <button disabled={isRecording} onClick={handleRecording}>
            {!isRecording ? "Record and Play Audio" : "Recording..."}
          </button>
        )}
      </div>
      {/* Conditionally render the PDF */}
      {pdfUrl && <iframe src={pdfUrl} width="100%" height="500px" />}
    </div>
  );
};

export default TalkBot02;
