import re
from typing import Dict, List, Any

class ValidationEngine:
    """
    AI-Assisted Validation Engine for CMPDI / Coal India Platform.
    Performs deterministic rule-based checks and cross-document discrepancy detection.
    Never silently modifies conflicting numbers.
    """

    MAX_MINE_CAPACITY_MT = 80.0 # Gevra is largest opencast in Asia (~55-70 MT)

    @classmethod
    def validate_entities(cls, entities: List[Dict[str, Any]], doc_metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        results = []
        
        # 1. Rule-Based Checks
        prod_val = None
        target_val = None
        dispatch_val = None
        
        for ent in entities:
            etype = ent.get("entity_type")
            raw_v = ent.get("raw_value")
            norm_v = ent.get("normalized_value")
            
            # Non-negativity check
            if etype in ["Production", "Target", "Dispatch", "Overburden", "Reserves"]:
                try:
                    num_val = float(norm_v)
                    if num_val < 0:
                        results.append({
                            "rule_name": f"{etype} Non-Negative Integrity Check",
                            "validation_type": "RULE_BASED",
                            "severity": "ERROR",
                            "field_name": etype,
                            "expected_value": ">= 0.0",
                            "actual_value": str(num_val),
                            "message": f"Negative value detected for {etype}: {num_val}. Physical production cannot be negative.",
                            "status": "REQUIRES_REVIEW"
                        })
                    
                    if etype == "Production":
                        prod_val = num_val
                        if num_val > cls.MAX_MINE_CAPACITY_MT:
                            results.append({
                                "rule_name": "Physical Production Ceiling Verification",
                                "validation_type": "RULE_BASED",
                                "severity": "WARNING",
                                "field_name": "Production",
                                "expected_value": f"<= {cls.MAX_MINE_CAPACITY_MT} MT",
                                "actual_value": f"{num_val} MT",
                                "message": f"Extracted production of {num_val} MT exceeds physical benchmark ceiling of {cls.MAX_MINE_CAPACITY_MT} MT.",
                                "status": "REQUIRES_REVIEW"
                            })
                    elif etype == "Target":
                        target_val = num_val
                    elif etype == "Dispatch":
                        dispatch_val = num_val
                        
                except (ValueError, TypeError):
                    results.append({
                        "rule_name": f"{etype} Numeric Format Check",
                        "validation_type": "RULE_BASED",
                        "severity": "ERROR",
                        "field_name": etype,
                        "expected_value": "Valid Float",
                        "actual_value": str(norm_v),
                        "message": f"Could not parse numeric figure for {etype}: '{norm_v}'.",
                        "status": "REQUIRES_REVIEW"
                    })

            # Financial Year Syntax
            if etype == "Financial Year":
                if not re.match(r"^\d{4}-\d{2}$", str(norm_v)):
                    results.append({
                        "rule_name": "Financial Year Format Standard",
                        "validation_type": "RULE_BASED",
                        "severity": "WARNING",
                        "field_name": "Financial Year",
                        "expected_value": "YYYY-YY (e.g. 2024-25)",
                        "actual_value": str(norm_v),
                        "message": f"Financial year format '{norm_v}' does not match standard CIL fiscal convention (YYYY-YY).",
                        "status": "REQUIRES_REVIEW"
                    })

        # Relationship rule: Dispatch vs Production sanity
        if prod_val is not None and dispatch_val is not None:
            # If dispatch is more than 150% of annual production without stock depletion context
            if dispatch_val > prod_val * 1.5 and prod_val > 0.5:
                results.append({
                    "rule_name": "Dispatch vs Production Ratio Anomaly",
                    "validation_type": "RULE_BASED",
                    "severity": "WARNING",
                    "field_name": "Dispatch",
                    "expected_value": f"<= {round(prod_val * 1.5, 2)} MT (taking into account buffer stock)",
                    "actual_value": f"{dispatch_val} MT",
                    "message": f"Dispatch ({dispatch_val} MT) significantly exceeds contemporaneous production ({prod_val} MT). Possible pithead stock liquidation or data mismatch.",
                    "status": "REQUIRES_REVIEW"
                })

        return results

    @classmethod
    def cross_document_validation(cls, doc_a_name: str, doc_a_data: Dict[str, Any], doc_b_name: str, doc_b_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Cross-validates across different document types (e.g., Monthly vs Annual).
        Never modifies conflicting numbers.
        """
        discrepancies = []
        for metric, val_a in doc_a_data.items():
            if metric in doc_b_data:
                val_b = doc_b_data[metric]
                try:
                    num_a = float(val_a)
                    num_b = float(val_b)
                    diff = abs(num_a - num_b)
                    if diff > 0.1: # More than 0.1 MT difference
                        discrepancies.append({
                            "rule_name": f"Cross-Document {metric} Discrepancy",
                            "validation_type": "CROSS_DOCUMENT",
                            "severity": "ERROR" if diff > 0.5 else "WARNING",
                            "field_name": metric,
                            "expected_value": f"{doc_a_name}: {num_a} MT",
                            "actual_value": f"{doc_b_name}: {num_b} MT",
                            "message": f"Variance of {round(diff, 2)} MT detected between {doc_a_name} ({num_a} MT) and {doc_b_name} ({num_b} MT). Human audit required.",
                            "status": "REQUIRES_REVIEW"
                        })
                except (ValueError, TypeError):
                    pass
        return discrepancies
