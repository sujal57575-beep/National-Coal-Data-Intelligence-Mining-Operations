import math
import numpy as np
from typing import List, Dict, Any

class VectorEmbedder:
    """
    Vector Embedder that creates normalized dense representation vectors for semantic search and RAG.
    Designed for fast, zero-dependency local vectorization with cosine similarity math.
    """
    DIMENSION = 64

    # Mining domain vocabulary anchors for dense semantic projection
    VOCAB_ANCHORS = [
        "coal", "production", "target", "dispatch", "mining", "geological", "seam", "strata",
        "borehole", "reserve", "resource", "overburden", "excavation", "drilling", "parliament",
        "inquiry", "lok", "sabha", "minister", "ccl", "ecl", "bccl", "wcl", "secl", "ncl",
        "mcl", "cmpdi", "rajrappa", "piparwar", "gevra", "kusmunda", "grade", "gcv", "ash",
        "stock", "pithead", "power", "thermal", "station", "safety", "dgms", "incident", "accident",
        "environmental", "reclamation", "cost", "revenue", "financial", "crores", "tonnes", "million",
        "annual", "quarterly", "monthly", "target", "achievement", "efficiency", "manpower", "equipment",
        "dumper", "shovel", "dragline", "haul"
    ]

    @classmethod
    def get_embedding(cls, text: str) -> List[float]:
        tokens = [t.lower().strip(".,:;()[]{}!?-") for t in text.split()]
        vector = np.zeros(cls.DIMENSION, dtype=np.float32)
        
        # Project tokens onto semantic anchors
        for token in tokens:
            if not token:
                continue
            for idx, anchor in enumerate(cls.VOCAB_ANCHORS):
                if token == anchor:
                    vector[idx] += 2.0
                elif anchor in token or token in anchor:
                    vector[idx] += 1.0
            # Additional hash-based subword projection for general words
            hash_idx = abs(hash(token)) % cls.DIMENSION
            vector[hash_idx] += 0.5

        # Normalize vector to unit length
        norm = np.linalg.norm(vector)
        if norm > 1e-6:
            vector = vector / norm
        else:
            vector[0] = 1.0
            
        return [round(float(v), 6) for v in vector]

    @classmethod
    def cosine_similarity(cls, vec_a: List[float], vec_b: List[float]) -> float:
        a = np.array(vec_a, dtype=np.float32)
        b = np.array(vec_b, dtype=np.float32)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(np.dot(a, b) / (norm_a * norm_b))
