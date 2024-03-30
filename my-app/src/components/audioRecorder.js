// record audio blobs utilizing media recorder API 

import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
    // set state based on whether recording, the url of audio, whether errors 
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [error, setError] = useState('');

    // retrieve the media data  
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);

                    recorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            setAudioURL(URL.createObjectURL(event.data));
                        }
                    };
                })
                .catch(err => setError('Failed to initialize media recorder: ' + err.message));
        } else {
            setError('Audio recording is not supported in this browser.');
        }
    }, []);

    // start recording audio 
    const startRecording = () => {
        if (mediaRecorder) {
            setRecording(true);
            mediaRecorder.start();
        }
    };

    // stop recording audio 
    const stopRecording = () => {
        if (mediaRecorder) {
            setRecording(false);
            mediaRecorder.stop();
        }
    };

    // return the audio recorder with start and stop recording buttons
    return (
        <div>
            <h2>Audio Recorder</h2>
            {error && <p className="text-danger">{error}</p>}
            <button className="btn btn-primary" onClick={startRecording} disabled={recording}>Start Recording</button>
            <button className="btn btn-secondary" onClick={stopRecording} disabled={!recording}>Stop Recording</button>
            <audio src={audioURL} controls />
        </div>
    );
};

export default AudioRecorder;
