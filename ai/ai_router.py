import time
from typing import Dict, Any, List

class AIRouter:
    """
    Intelligent Hybrid AI Router with Data Governance, Cost Optimization,
    and Strict Security Boundary Enforcement.
    """

    POLICY_LOCAL_ONLY = "LOCAL_ONLY"
    POLICY_PRIVATE_CLOUD = "PRIVATE_CLOUD"
    POLICY_APPROVED_CLOUD = "APPROVED_CLOUD"

    # AI usage log for cost & latency audit
    _USAGE_METRICS = {
        "total_requests": 0,
        "local_requests": 0,
        "cloud_requests": 0,
        "total_tokens": 0,
        "estimated_cost_inr": 0.0,
        "avg_latency_ms": 0.0
    }

    @classmethod
    def route_query(cls, query: str, policy: str = "LOCAL_ONLY") -> Dict[str, Any]:
        """
        Determines execution route based on sensitivity, policy, and reasoning complexity.
        """
        start = time.time()
        complexity = cls._assess_complexity(query)
        
        # Enforce governance boundary
        if policy == cls.POLICY_LOCAL_ONLY or not complexity["requires_heavy_reasoning"]:
            engine = "Local Edge AI (Air-Gapped)"
            tokens = len(query.split()) * 18
            cost = 0.0 # Zero cloud cost
            cls._USAGE_METRICS["local_requests"] += 1
        elif policy in [cls.POLICY_PRIVATE_CLOUD, cls.POLICY_APPROVED_CLOUD]:
            engine = "Enterprise Cloud LLM (Encrypted Boundary)"
            tokens = len(query.split()) * 24
            cost = round(tokens * 0.00015, 4) # estimated cost
            cls._USAGE_METRICS["cloud_requests"] += 1
        else:
            engine = "Local Edge AI (Air-Gapped)"
            tokens = len(query.split()) * 18
            cost = 0.0
            cls._USAGE_METRICS["local_requests"] += 1

        cls._USAGE_METRICS["total_requests"] += 1
        cls._USAGE_METRICS["total_tokens"] += tokens
        cls._USAGE_METRICS["estimated_cost_inr"] = round(cls._USAGE_METRICS["estimated_cost_inr"] + cost, 4)
        
        elapsed = (time.time() - start) * 1000
        return {
            "routed_engine": engine,
            "policy_applied": policy,
            "requires_cloud": complexity["requires_heavy_reasoning"],
            "complexity_reason": complexity["reason"],
            "tokens_consumed": tokens,
            "cost_inr": cost,
            "routing_latency_ms": round(elapsed, 2)
        }

    @classmethod
    def _assess_complexity(cls, query: str) -> Dict[str, Any]:
        q = query.lower()
        if any(w in q for w in ["synthesize multi-year", "parliamentary debate draft", "comprehensive audit cross-check", "detailed policy impact"]):
            return {"requires_heavy_reasoning": True, "reason": "Multi-tier historical synthesis requested"}
        return {"requires_heavy_reasoning": False, "reason": "Direct retrieval and grounded extraction sufficient"}

    @classmethod
    def get_usage_metrics(cls) -> Dict[str, Any]:
        return cls._USAGE_METRICS.copy()
