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
from mail import generate_text


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
    dicter = {}
    for procedure in procedure_json['procedures']:
        answer = requests.get("https://www.dolthub.com/api/v1alpha1/dolthub/hospital-price-transparency/master?q=SELECT+Avg%28price%29%0AFROM+%60prices%60+WHERE+CODE%3D\"{}\"+AND+payer+LIKE+\"%25{}%25\"+LIMIT+1000%3B".format(procedure, insurance_provider))
        answer = answer.json()
        inner_dict = {}
        inner_dict['cost_difference'] =  float(answer['rows'][0]['Avg(price)']) - float(procedure_json['procedures'][procedure])
        inner_dict['avg_cost'] = float(answer['rows'][0]['Avg(price)'])
        inner_dict['your_cost'] = procedure_json['procedures'][procedure]
        inner_dict['percent_difference'] = (inner_dict['cost_difference'] / float(procedure_json['procedures'][procedure])) * 100
        dicter[procedure] = inner_dict
    uzer=collection.find_one({'email': emailid })
    if uzer.get("procedures") !={"dummy":"dummy"}:
        dict = uzer["procedures"]
        dict.update(dicter)
    else:
    # Handle the case where `uzer["procedures"]` is None
        dict = dicter

    update_operation = {
        '$set': {
            'procedures': dict
        }
    }
    collection.update_one({'email': emailid}, update_operation)
    return jsonify(dicter)

@app.route('/process-audio', methods=['POST'])
def process_audio():
    request.files['audio'].save("audio.mp3")

    # Use FasterWhisper to convert audio to text
    segments, info = audio_model.transcribe("audio.mp3", beam_size=5)
    final_text = ""
    for segment in segments:
        final_text += segment.text

    if "delete" in final_text and ("bill" in final_text or "bills" in final_text):
        return "delete_bill"
    
    if "remove" in final_text and "address" in final_text:
        return "remove_address"

    response = gemini_model.generate_content([final_text, "You are a patient support assistant. You are tasked with helping patients with figuring out their hospital bill related queries. Respond in plain and simple text, do not exceed more than two sentences."])
    #ping gemini for the answer

    tts_output_path = "sample_output.wav"
    tts.tts_to_file(response.text, file_path=tts_output_path)

    return jsonify({
        "final_text": final_text,
        "tts_output": response.text,
        "tts_output_path": tts_output_path
    })

@app.route('/overcharge-chat', methods=['POST'])
def overcharge_chat():
    request.files['audio'].save("audio.mp3")
    history = request.form['history']
    # with open("tp.json") as f:
    #     data_json = json.load(f)
    #     f.close()
    # data = json.dumps(data_json)
    data_json = request.files['data']
    data = json.load(data_json)

    # Use FasterWhisper to convert audio to text
    segments, info = audio_model.transcribe("audio.mp3", beam_size=5)
    final_text = "Explain where I have been overcharged and what I can do about it."
    for segment in segments:
       final_text += segment.text
    with open("insuaid/target/directions.txt", "r") as file:
        directions_contents = file.read()
        # Add contents to a string or perform any other operations

    if "generate" in final_text and "letter" in final_text:
        return generate_text(data)

    response = gemini_model.generate_content(["You are a bot that will help the patient with queries they have about being overcharged by the hospital. You have been provided with data about the patient's procedure and its costs. The accompanying json data contains structured data as follows: the outer keys are the CPT codes for every procedure the patient went through. The inner keys are: 'avg_cost': national average cost of procedure with given health provider, 'your_cost': cost for patient, 'cost_difference': difference in costs, 'percent_difference': percent difference in costs. Respond to user queries in plain and simple text, do not exceed more than four sentences. Only use the provided data to give information.", 
                                              data, "This is the user's query: " + final_text, "This was your previous answer (ignore if empty): " + history, "Suggest writing a letter to the hospital's billing department to request a refund for the overcharge.", "This is a set of general directions that the user can do to help with the overcharge: " + directions_contents])
    #ping gemini for the answer

    tts_output_path = "sample_output.wav"
    tts.tts_to_file(response.text, file_path=tts_output_path)

    return jsonify({
        "final_text": final_text,
        "tts_output": response.text,
        "tts_output_path": tts_output_path
    })
@app.route('/update_email', methods=['POST'])
def update_email():
    data=request.json
    print(data)
    global emailid
    emailid=data['email']
    global address
    address=data['address']
    global insurance
    insurance=data['insuranceName']
    print(emailid,address,insurance)
    return "updated"
    
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
def get_history():
    return collection.find_one({'email': emailid})
if __name__ == '__main__':
    app.run(debug = False)