from flask import Flask, request, jsonify
import requests
from faster_whisper import WhisperModel
import torch
from TTS.api import TTS
import google.generativeai as genai
import os

device = "cuda" if torch.cuda.is_available() else "cpu"

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

model_size = "medium"
model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")

app = Flask(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/query-prices', methods=['POST'])
def query_prices():
    procedure_json = request.get_json()
    insurance_provider = procedure_json['insurance_provider']
    dict = {}
    for procedure in procedure_json['procedures']:
        print(procedure)
        answer = requests.get("https://www.dolthub.com/api/v1alpha1/dolthub/hospital-price-transparency/master?q=SELECT+*+FROM+%60prices%60+WHERE+CODE%3D\"{}\"+AND+payer+LIKE+\"%25{}%25\"+LIMIT+1%3B".format(procedure, insurance_provider))
        answer = answer.json()
        dict[procedure] =  float(answer['rows'][0]['price']) - float(procedure_json['procedures'][procedure])
    return jsonify(dict)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    request.files['audio'].save("audio.mp3")

    # Use FasterWhisper to convert audio to text
    segments, info = model.transcribe("audio.mp3", beam_size=5)
    final_text = ""
    for segment in segments:
        final_text += segment.text


    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content([final_text, "You are a patient support assistant. You are tasked with helping patients with figuring out whether the hospital overcharged them and suggest further course of action based on the information the user gives."])
    #ping gemini for the answer

    tts.tts_to_file(response, speaker_wav = "target/the_wolf_of_wall_street_speech-cut.wav", language="en", file_path="sample_output.wav")

    return final_text, response, "sample_output.wav"

if __name__ == '__main__':
    app.run(debug = False)