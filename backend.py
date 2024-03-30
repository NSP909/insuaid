from flask import Flask, request, jsonify, url_for
import requests
from faster_whisper import WhisperModel
import torch
from TTS.api import TTS
from dotenv import load_dotenv
import google.generativeai as genai
import os
import base64
import json
from ocr import get_text_from_image

load_dotenv()

device = "cuda" if torch.cuda.is_available() else "cpu"

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

model_size = "medium"
audio_model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")

app = Flask(__name__)

@app.route('/query-prices', methods=['POST'])
def query_prices():
    procedure_json = request.get_json()
    insurance_provider = procedure_json['insurance_provider']
    dict = {}
    for procedure in procedure_json['procedures']:
        answer = requests.get("https://www.dolthub.com/api/v1alpha1/dolthub/hospital-price-transparency/master?q=SELECT+Avg%28price%29%0AFROM+%60prices%60+WHERE+CODE%3D\"{}\"+AND+payer+LIKE+\"%25{}%25\"+LIMIT+1000%3B".format(procedure, insurance_provider))
        answer = answer.json()
        inner_dict = {}
        inner_dict['cost_difference'] =  float(answer['rows'][0]['Avg(price)']) - float(procedure_json['procedures'][procedure])
        inner_dict['avg_cost'] = float(answer['rows'][0]['Avg(price)'])
        inner_dict['your_cost'] = procedure_json['procedures'][procedure]
        inner_dict['percent_difference'] = (inner_dict['cost_difference'] / float(procedure_json['procedures'][procedure])) * 100
        dict[procedure] = inner_dict
    return jsonify(dict)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    request.files['audio'].save("audio.mp3")

    # Use FasterWhisper to convert audio to text
    segments, info = audio_model.transcribe("audio.mp3", beam_size=5)
    final_text = ""
    for segment in segments:
        final_text += segment.text

    response = gemini_model.generate_content([final_text, "You are a patient support assistant. You are tasked with helping patients with figuring out their hospital bill related queries. Respond in plain and simple text, do not over explain things."])
    #ping gemini for the answer

    tts.tts_to_file(response.text, speaker_wav = "target/the_wolf_of_wall_street_speech-cut.wav", language="en", file_path="sample_output.wav")

    return "sample_output.wav"

@app.route('/image', methods=['POST'])
def process_image():
    image = request.files['image']
    insurance = request.form['insurance']
    imgbase64 = base64.b64encode(image.read()).decode("utf-8")
    description = get_text_from_image(imgbase64)
    description_json = json.loads(description)
    data = {'insurance_provider': insurance, 'procedures': description_json}
    reponse = requests.post("http://127.0.0.1:5000/query-prices", json=data)
    return reponse.text

if __name__ == '__main__':
    app.run(debug = False)