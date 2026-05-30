# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS
# pyrefly: ignore [missing-import]
import fitz # PyMuPDF
from matcher import calculate_similarity

app = Flask(__name__)
CORS(app)

@app.route('/match', methods=['POST'])
def match_jobs():
    try:
        data = request.get_json()
        if not data or 'resumeText' not in data or 'jobs' not in data:
            return jsonify({'success': False, 'message': 'Missing resumeText or jobs array'}), 400
            
        resume_text = data['resumeText']
        jobs = data['jobs']
        
        ranked_jobs = calculate_similarity(resume_text, jobs)
        
        return jsonify({
            'success': True,
            'rankedJobs': ranked_jobs
        })
    except Exception as e:
        print("Error during matching:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/extract', methods=['POST'])
def extract_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file uploaded'}), 400
            
        file = request.files['file']
        
        # Read PDF bytes
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        text = ""
        for page in doc:
            text += page.get_text()
            
        return jsonify({
            'success': True,
            'text': text
        })
    except Exception as e:
        print("Error extracting PDF:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

import os

if __name__ == '__main__':
    # Listen on dynamic port provided by environment, or default to 5001
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
