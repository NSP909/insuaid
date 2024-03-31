
from dotenv import *
import os
import google.generativeai as genai
import google.ai.generativelanguage as glm
from google.generativeai.types.content_types import *
from PIL import Image


def generate_text(text):
    load_dotenv()
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    genai.configure(api_key=GOOGLE_API_KEY)
    
    model = genai.GenerativeModel("gemini-pro")
    prompt="You are a patient, you will talk legally and professionaly(at least 250 words). I wil; provide you information showing hospital charges for your treatments based on that write a full letter, telling them about how you need compensation back and how you will take it to court otherwise. The letter should not require any additional data. You should be fill in the address and name with provided information. "
   
    prompt += "Max Verstappen address:1234 main steet, Box Box"
    prompt+="hospital name: Box Box Hospital, BOX Box area"
    prompt+="Do not leave any blanks like Your name or Date of Surgery or Address or Date of Letter, if you don't have such information don't write about them and write about the stuff that you have, the mail should be ready to be posted and I shouldn't need to add anything to it"
    responses = model.generate_content([text, prompt])
    
    return responses.text

text='overcharged surgery by 3000'
description = generate_text(text)
print(description)