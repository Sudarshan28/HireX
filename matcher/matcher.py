from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Cache model loader
_model = None
# Cache for job description embeddings
_embeddings_cache = {}

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
    
    # Retrieve embeddings from cache or encode fresh
    job_embs = [None] * len(job_descriptions)
    uncached_descs = []
    uncached_indices = []
    
    for i, job in enumerate(job_descriptions):
        desc = job['description'] or ''
        if desc in _embeddings_cache:
            job_embs[i] = _embeddings_cache[desc]
        else:
            uncached_descs.append(desc)
            uncached_indices.append(i)
            
    if uncached_descs:
        # Batch encode only the uncached descriptions
        encoded = model.encode(uncached_descs)
        for idx, emb in zip(uncached_indices, encoded):
            _embeddings_cache[job_descriptions[idx]['description'] or ''] = emb
            job_embs[idx] = emb
            
    job_embs_arr = np.array(job_embs)
    
    # Calculate cosine similarity
    similarities = cosine_similarity(resume_emb, job_embs_arr)[0]
    
    ranked_jobs = []
    for i, job in enumerate(job_descriptions):
        ranked_jobs.append({
            'id': job['id'],
            'score': float(similarities[i])
        })
        
    # Sort by descending score
    ranked_jobs.sort(key=lambda x: x['score'], reverse=True)
    return ranked_jobs

