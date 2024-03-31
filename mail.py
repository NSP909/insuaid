from dotenv import *
import os
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
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

def generate_letter_pdf(text, filename):
    # Generate text
    letter_content = generate_text(text)

    # Create PDF
    c = canvas.Canvas(filename, pagesize=letter)

    # Set font and size
    c.setFont("Helvetica", 12)
    
    # Define margins
    left_margin = 50
    top_margin = 750
    line_height = 14  # Adjust as needed

    lines = letter_content.split("\n")
    max_width = letter[0] - left_margin * 2  # Maximum width for text

    for line in lines:
        # Split line if exceeds maximum width
        while c.stringWidth(line, "Helvetica", 12) > max_width:
            # Find the split point
            split_index = line.rfind(' ', 0, int(len(line) * max_width / c.stringWidth(line, "Helvetica", 12)))
            if split_index == -1:  # If no space found within the width, split forcefully
                split_index = int(len(line) * max_width / c.stringWidth(line, "Helvetica", 12))
            # Split the line
            split_line = line[:split_index]
            # Draw the line
            c.drawString(left_margin, top_margin, split_line.strip())
            # Update position
            top_margin -= line_height
            # Update remaining text
            line = line[split_index:].lstrip()  # Remove leading spaces after splitting
        # Draw the remaining part of the line
        c.drawString(left_margin, top_margin, line.strip())
        # Update position
        top_margin -= line_height

    # Save the PDF
    c.save()

text = 'overcharged surgery by 3000'
pdf_filename = "compensation_letter.pdf"
generate_letter_pdf(text, pdf_filename)
print(f"PDF generated successfully: {pdf_filename}")