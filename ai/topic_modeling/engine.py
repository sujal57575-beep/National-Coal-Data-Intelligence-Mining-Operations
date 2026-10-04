import re
import collections
import math
from typing import List, Dict, Any, Optional

class TopicModelingEngine:
    """
    Automated Word Cloud and Topic Identification module for CMPDI/CIL.
    Performs text cleaning, stop-word removal, TF-IDF keyword extraction,
    and semantic topic clustering with filters for Year, Subsidiary, Mine, and Doc Type.
    """

    STOP_WORDS = {
        "the", "and", "to", "of", "a", "in", "for", "is", "on", "that", "by", "this", "with",
        "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have",
        "new", "more", "an", "was", "we", "will", "home", "can", "us", "about", "if", "page",
        "report", "limited", "india", "coal", "dated", "ref", "no", "per", "due", "under", "total"
    }

    MINING_TOPIC_CLUSTERS = [
        {
            "id": 1,
            "name": "Heavy Earth Moving & Excavation",
            "cluster_id": 101,
            "description": "HEMM deployment, stripping ratios, and overburden bench excavation",
            "keywords": ["overburden", "excavation", "dragline", "dumper", "shovel", "stripping ratio", "bench", "haulage"]
        },
        {
            "id": 2,
            "name": "Geological Exploration & Seam Correlation",
            "cluster_id": 102,
            "description": "Stratigraphic drilling, core sample analysis, and proved coal reserve estimation",
            "keywords": ["seam", "borehole", "proved reserves", "lithology", "calorific value", "gcv", "ash content", "coking"]
        },
        {
            "id": 3,
            "name": "Supply Chain & Power Sector Dispatch",
            "cluster_id": 103,
            "description": "Rail rake movement, pithead coal stock maintenance, and dispatches to STPS",
            "keywords": ["dispatch", "offtake", "pithead", "stock", "rake", "thermal power", "fsa", "linkage"]
        },
        {
            "id": 4,
            "name": "DGMS Safety Compliance & Hazard Control",
            "cluster_id": 104,
            "description": "Mine gas testing, occupational health, DGMS safety standards, and incident prevention",
            "keywords": ["safety", "dgms", "incident", "inspection", "ventilation", "strata control", "rescue", "protective"]
        },
        {
            "id": 5,
            "name": "Environmental Reclamation & Statutory Clearances",
            "cluster_id": 105,
            "description": "Afforestation green belts, mine closure plans, air/water monitoring, and EC clearances",
            "keywords": ["environment", "afforestation", "reclamation", "forest clearance", "effluent", "air quality", "compliance"]
        }
    ]

    @classmethod
    def generate_word_cloud(cls, texts: List[str], max_words: int = 50) -> List[Dict[str, Any]]:
        """
        Calculates TF-IDF styled keyword frequency for word cloud visualization.
        """
        all_words = []
        doc_count = max(len(texts), 1)
        word_doc_presence = collections.defaultdict(int)

        for text in texts:
            tokens = re.findall(r"\b[A-Za-z]{3,}\b", text.lower())
            seen_in_doc = set()
            for t in tokens:
                if t not in cls.STOP_WORDS:
                    all_words.append(t)
                    if t not in seen_in_doc:
                        word_doc_presence[t] += 1
                        seen_in_doc.add(t)

        counts = collections.Counter(all_words)
        word_cloud_items = []

        # Domain category dictionary for coloring
        category_map = {
            "overburden": "Operations", "excavation": "Operations", "production": "Operations",
            "target": "Performance", "dispatch": "Supply Chain", "reserves": "Geology",
            "borehole": "Geology", "seam": "Geology", "calorific": "Quality", "grade": "Quality",
            "safety": "Safety", "dgms": "Safety", "reclamation": "Environment", "afforestation": "Environment"
        }

        for word, freq in counts.most_common(max_words):
            idf = math.log((doc_count + 1) / (word_doc_presence[word] + 1)) + 1.0
            tf = freq / max(len(all_words), 1)
            tfidf = round(tf * idf * 100, 2)
            
            category = category_map.get(word, "General Mining")
            word_cloud_items.append({
                "text": word.title(),
                "value": freq,
                "category": category,
                "tf_idf": tfidf
            })

        return word_cloud_items

    @classmethod
    def get_topics(cls) -> List[Dict[str, Any]]:
        return cls.MINING_TOPIC_CLUSTERS
