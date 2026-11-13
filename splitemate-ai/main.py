from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import tempfile
import traceback
from datetime import datetime
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv
from docx import Document

app = Flask(__name__)
CORS(app, support_credentials=True)

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/draft-group-expense', methods=['POST'])
@cross_origin(supports_credentials=True)
def parse_resume():
    try:
        text = request.text
        current_date = datetime.today().strftime("%Y-%m")
        prompt = f"""
    You are an expert in extracting details from the text provided by user for splitting the among the respective group.
    Your task it extract the basic structured detials from the text provided and return ONLY valid JSON output.
    {{
        "expense_details": {{
            "split_description": "",
            "split_amount": "",
            "who_paid": "",
            "expense_date": "",
            "split_among": "",

        }}
    }}
    From the give text extract the details as given in above JSON. Split_descrition should be the what is the split for, split_amount is how muach amount need to be splitted, 
"""

    
    except Exception as e:
        return jsonify({'error': f'Resume parsing failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)