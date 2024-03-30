import requests
import json
import base64
from google.auth.transport.requests import Request
from google.oauth2 import service_account
#from reportlab.pdfgen import canvas
from dotenv import load_dotenv
import os

from dotenv import *
from flask import jsonify
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.generativeai.types.content_types import *
from PIL import Image
from backend import query_prices
import json


VISION_GDCH_ENDPOINT = "vision.googleapis.com"

load_dotenv()

keyfile_path = os.getenv("fpath")


with open(keyfile_path, "r") as keyfile:
    credentials_info = json.load(keyfile)

credentials = service_account.Credentials.from_service_account_info(
    info=credentials_info,
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)


credentials.refresh(Request())
ACCESS_TOKEN = credentials.token

def get_response(imgbase64, access_token):

    annotate_image_request = {
        "requests": [
            {
                "image": {"content": imgbase64},
                "features": [
                    {"type": "TEXT_DETECTION"},
                ],
            }
        ]
    }


    json_data = json.dumps(annotate_image_request)

    url = f"https://{VISION_GDCH_ENDPOINT}/v1/images:annotate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }
    #print(headers)
    response = requests.post(url, data=json_data, headers=headers)
    #print(response)
    return response

def parse_text(response,line_height=40):
    if response.status_code == 200:
        
        result = response.json()


        text_annotations = result['responses'][0]['textAnnotations']

    
        sorted_words = sorted(text_annotations[1:], key=lambda x: (x['boundingPoly']['vertices'][0]['y']//line_height, x['boundingPoly']['vertices'][0]['x']))

        prev_line_y = sorted_words[0]['boundingPoly']['vertices'][0]['y']
        text = ""
        for word in sorted_words:
            word_text = word['description']
            text += word_text + " "
            word_y = word['boundingPoly']['vertices'][0]['y']

        
            if abs(word_y - prev_line_y) > line_height: 
                text += "\n"
                prev_line_y = word_y
        
        return text

    else:
        print(f"Error: {response.status_code}, {response.text}")

def get_text(imgbase64, access_token=ACCESS_TOKEN):
    response = get_response(imgbase64, access_token)
    text = parse_text(response)

    return text

def generate_description(out):
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    
    genai.configure(api_key=GOOGLE_API_KEY)
    
    model = genai.GenerativeModel("gemini-pro")
    responses = model.generate_content([out, "Get the name of the proc/cpt code which and the price(without dollar sign) which is after the proc code. Output a json in the following format {proc code: price}. Don't include ```json or anything else. ALso do not include newline characters."])
    
    return responses.text
def main():
    image_path = "insuaid/documents/doc1.png"
    with open(image_path, "rb") as image_file:
        imgbase64 = base64.b64encode(image_file.read()).decode("utf-8")
    fin=generate_description(out=get_text(imgbase64, ACCESS_TOKEN))
    fin_json = json.loads(fin)
    url = 'http://127.0.0.1:5000/query-prices'
    ffin={'insurance_provider':'UNITED HEALTHCARE', 'procedures': fin_json}
    return_json = requests.post(url, json=ffin)
    print(return_json.text)

if __name__ == "__main__":
    main()