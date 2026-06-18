from sentence_transformers import SentenceTransformer


class VectorService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def get_embeddings(self, text: str):
        if not text:
            return None
        return self.model.encode(text).tolist()
