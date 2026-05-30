from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Cache model loader
_model = None

def get_model():
    global _model
    if _model is None:
        print("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully.")
    return _model

def calculate_similarity(resume_text, job_descriptions):
    """
    resume_text: str
    job_descriptions: list of dict with 'id' and 'description'
    Returns list of dict with 'id' and 'score'
    """
    if not resume_text or not job_descriptions:
        return []

    model = get_model()
    
    # Encode resume
    resume_emb = model.encode([resume_text])
    
    # Encode job descriptions
    job_descs = [job['description'] for job in job_descriptions]
    job_embs = model.encode(job_descs)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(resume_emb, job_embs)[0]
    
    ranked_jobs = []
    for i, job in enumerate(job_descriptions):
        ranked_jobs.append({
            'id': job['id'],
            'score': float(similarities[i])
        })
        
    # Sort by descending score
    ranked_jobs.sort(key=lambda x: x['score'], reverse=True)
    return ranked_jobs
