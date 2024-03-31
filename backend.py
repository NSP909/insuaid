from flask import Flask, request, jsonify, Response
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
from flask_cors import CORS
from pymongo import MongoClient



load_dotenv()

uri=os.getenv("mongo")


cluster = MongoClient(uri)
db = cluster['data']
collection = db["users"]
device = "cuda" if torch.cuda.is_available() else "cpu"

tts = TTS(model_name="tts_models/en/ek1/tacotron2", progress_bar=False).to(device)

model_size = "medium"
audio_model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")

app = Flask(__name__)

CORS(app, origins="*")

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

    response = gemini_model.generate_content([final_text, "You are a patient support assistant. You are tasked with helping patients with figuring out their hospital bill related queries. Respond in plain and simple text, do not exceed more than two sentences."])
    #ping gemini for the answer

    tts.tts_to_file(response.text, file_path="sample_output.wav")

    return "sample_output.wav"

@app.route('/image', methods=['POST'])
def process_image():
    image = request.files['image']
    insurance = request.form['insurance']
    imgbase64 = base64.b64encode(image.read()).decode("utf-8")
    description = get_text_from_image(imgbase64)
    description_json = json.loads(description)
    data = {'insurance_provider': insurance, 'procedures': description_json}
    response = requests.post("http://127.0.0.1:5000/query-prices", json=data)
    if response.status_code == 200:
        # Return a JSON response with the data obtained from the query-prices endpoint
        return Response(response=response.text, status=response.status_code, content_type='application/json')
    else:
        # If the request was not successful, return an appropriate error response
        return jsonify({'error': 'Failed to process the image'}), 500

@app.route('/add_user', methods=['POST'])
def add_user():
    # Get user data from the request
    user_data = request.json
    if not user_data:
        return jsonify({"error": "No user data provided"}), 400

    # Check if the user already exists in the database
    existing_user = collection.find_one({"email": user_data.get("email")})
    if existing_user:
        return "user exists"

    # Insert the user into the database
    result = collection.insert_one(user_data)
    if result.inserted_id:
        return jsonify({"message": "User added successfully"}), 201
    else:
        return jsonify({"error": "Failed to add user"}), 500

if __name__ == '__main__':
    app.run(debug = False)