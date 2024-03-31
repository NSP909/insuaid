import React, { useState } from 'react';

const TalkbotPage = () => {
  const [audioRecording, setAudioRecording] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleStartRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = e => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setAudioRecording(blob);
        };

        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000); // Adjust recording duration as needed
      })
      .catch(err => console.error('Error recording audio:', err));
  };

  const handleProcessAudio = () => {
    if (!audioRecording) {
      console.error('No audio recording to process');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioRecording);

    fetch('http://127.0.0.1:5000/process-audio', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      setResponseText(data.final_text); // Assuming the final text is returned
      // Assuming the URL to the processed audio is returned in the response
      setAudioUrl("http://127.0.0.1:5000/audio")
    })
    .catch(err => console.error('Error processing audio:', err));
  };

  const handlePlayAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Voice-based Talkbot</h1>
      <button onClick={handleStartRecording}>Start Recording</button>
      <button onClick={handleProcessAudio}>Process Audio</button>
      <br />
      {responseText && <p>Response: {responseText}</p>}
      {audioUrl && (
        <div>
          <button onClick={handlePlayAudio}>Play Audio</button>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TalkbotPage;
