from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def generate_embeddings():
    data = request.json
    texts = data['texts']

    embeddings = model.encode(texts)
    return jsonify({'embeddings': embeddings.tolist()})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)