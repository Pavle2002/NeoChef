from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from numpy import dot
from numpy.linalg import norm
from sentence_transformers.util import cos_sim

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

candidates_embeddings = None
candidates = []

@app.route('/embed', methods=['POST'])
def generate_embeddings():
    data = request.json
    texts = data.get('texts')
    if not texts or not isinstance(texts, list):
        return jsonify({'error': 'texts must be a list of strings'}), 400
    
    embeddings = model.encode(texts)
    return jsonify({'embeddings': embeddings.tolist()})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/load', methods=['POST'])
def set_candidates():
    global candidates, candidates_embeddings
    data = request.json
    new_candidates = data.get('candidates')
    if not new_candidates or not isinstance(new_candidates, list):
        return jsonify({'error': 'candidates must be a list of objects'}), 400

    for c in new_candidates:
        if 'embedding' not in c:
            return jsonify({'error': 'each candidate must have an embedding'}), 400

    candidates = new_candidates
    candidates_embeddings = [c['embedding'] for c in candidates]
    return jsonify({'status': 'candidates updated', 'count': len(candidates)})

@app.route('/match', methods=['POST'])
def match_candidates():
    global candidates, candidates_embeddings
    data = request.json
    user_input = data.get('input')
    if not user_input or not isinstance(user_input, str):
        return jsonify({'error': 'input must be a string'}), 400
    if not candidates or not candidates_embeddings:
        return jsonify({'error': 'no candidates set'}), 400

    # Compute embedding for user input
    user_embedding = model.encode([user_input])

    # Compute cosine similarities using sentence-transformers
    similarities = cos_sim(user_embedding, candidates_embeddings)[0].tolist()

    # Get top 5 matches
    top_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)[:5]
    top_candidates = [
        {
            'id': candidates[i].get('id'),
            'confidence': float(similarities[i])
        }
        for i in top_indices
    ]
    return jsonify({'matches': top_candidates})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)