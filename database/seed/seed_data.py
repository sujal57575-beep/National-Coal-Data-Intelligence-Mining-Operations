import datetime
import os
import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash, RoleEnum
from app.models.entities import (
    User, Subsidiary, Mine, Document, DocumentPage, OCRResult,
    ExtractedEntity, ExtractedTable, ExtractedMetric, ValidationResult,
    ParliamentaryQuery, ReportTemplate, Report, Approval, AuditLog,
    Topic, Keyword, AIRecommendation, DocumentEmbedding
)
from ai.embeddings.embedder import VectorEmbedder

def seed_database():
    print("Initializing Database schema...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Subsidiary).count() > 0:
            print("Database already seeded. Skipping initial seed.")
            return

        print("Seeding CIL Subsidiaries...")
        subsidiaries_data = [
            {"code": "CMPDI", "name": "Central Mine Planning & Design Institute", "state": "Jharkhand", "hq_location": "Gondwana Place, Kanke Road, Ranchi", "target": 12.5, "email": "cmd.cmpdi@coalindia.in"},
            {"code": "CCL", "name": "Central Coalfields Limited", "state": "Jharkhand", "hq_location": "Darbhanga House, Ranchi", "target": 86.0, "email": "cmd.ccl@coalindia.in"},
            {"code": "SECL", "name": "South Eastern Coalfields Limited", "state": "Chhattisgarh", "hq_location": "Seepat Road, Bilaspur", "target": 185.0, "email": "cmd.secl@coalindia.in"},
            {"code": "NCL", "name": "Northern Coalfields Limited", "state": "Madhya Pradesh", "hq_location": "Singrauli", "target": 139.0, "email": "cmd.ncl@coalindia.in"},
            {"code": "WCL", "name": "Western Coalfields Limited", "state": "Maharashtra", "hq_location": "Coal Estate, Civil Lines, Nagpur", "target": 68.0, "email": "cmd.wcl@coalindia.in"},
            {"code": "BCCL", "name": "Bharat Coking Coal Limited", "state": "Jharkhand", "hq_location": "Koyla Bhawan, Dhanbad", "target": 42.0, "email": "cmd.bccl@coalindia.in"},
            {"code": "ECL", "name": "Eastern Coalfields Limited", "state": "West Bengal", "hq_location": "Sanctoria, Dishergarh", "target": 51.0, "email": "cmd.ecl@coalindia.in"},
            {"code": "MCL", "name": "Mahanadi Coalfields Limited", "state": "Odisha", "hq_location": "Jagriti Vihar, Sambalpur", "target": 204.0, "email": "cmd.mcl@coalindia.in"}
        ]

        sub_objs = {}
        for s in subsidiaries_data:
            sub = Subsidiary(
                name=s["name"],
                code=s["code"],
                state=s["state"],
                hq_location=s["hq_location"],
                annual_target_mt=s["target"],
                contact_email=s["email"]
            )
            db.add(sub)
            db.flush()
            sub_objs[s["code"]] = sub

        print("Seeding Users with Enterprise RBAC...")
        demo_users = [
            {"username": "admin", "full_name": "Dr. Rajeshwar Sharma", "email": "admin@cmpdi.co.in", "role": RoleEnum.SUPER_ADMIN, "dept": "Executive Directorate"},
            {"username": "director_geology", "full_name": "Shri Amitabh Roy", "email": "dir.geology@cmpdi.co.in", "role": RoleEnum.APPROVER, "dept": "Geology & Exploration"},
            {"username": "mining_analyst", "full_name": "Pooja Banerjee", "email": "p.banerjee@ccl.gov.in", "role": RoleEnum.ANALYST, "dept": "Production & Planning", "sub": "CCL"},
            {"username": "doc_officer", "full_name": "Sanjay Verma", "email": "s.verma@secl.co.in", "role": RoleEnum.DOCUMENT_OFFICER, "dept": "Documentation & Archives", "sub": "SECL"},
            {"username": "reviewer_hq", "full_name": "Kavita Nair", "email": "kavita.nair@cmpdi.co.in", "role": RoleEnum.REVIEWER, "dept": "Technical Audit"}
        ]

        user_objs = {}
        for u in demo_users:
            sub_id = sub_objs[u["sub"]].id if "sub" in u else sub_objs["CMPDI"].id
            user = User(
                username=u["username"],
                email=u["email"],
                hashed_password=get_password_hash("Admin@123"), # Demo secure password
                full_name=u["full_name"],
                role=u["role"],
                department=u["dept"],
                subsidiary_id=sub_id,
                organization="Coal India Limited / CMPDI"
            )
            db.add(user)
            db.flush()
            user_objs[u["username"]] = user

        print("Seeding 20+ Key Coal Mines across subsidiaries...")
        mines_data = [
            {"sub": "CCL", "name": "Rajrappa Open Cast Project", "code": "CCL-RAJ-01", "field": "Ramgarh Coalfield", "dist": "Ramgarh", "state": "Jharkhand", "type": "Opencast", "target": 4.10},
            {"sub": "CCL", "name": "Piparwar Open Cast Mine", "code": "CCL-PIP-02", "field": "North Karanpura", "dist": "Chatra", "state": "Jharkhand", "type": "Opencast", "target": 11.50},
            {"sub": "CCL", "name": "Ashoka Open Cast Project", "code": "CCL-ASH-03", "field": "North Karanpura", "dist": "Chatra", "state": "Jharkhand", "type": "Opencast", "target": 14.00},
            {"sub": "CCL", "name": "Amrapali Open Cast Mine", "code": "CCL-AMR-04", "field": "North Karanpura", "dist": "Chatra", "state": "Jharkhand", "type": "Opencast", "target": 25.00},
            {"sub": "SECL", "name": "Gevra Mega Opencast Project", "code": "SECL-GEV-01", "field": "Korba Coalfield", "dist": "Korba", "state": "Chhattisgarh", "type": "Opencast", "target": 52.50},
            {"sub": "SECL", "name": "Kusmunda Opencast Mine", "code": "SECL-KUS-02", "field": "Korba Coalfield", "dist": "Korba", "state": "Chhattisgarh", "type": "Opencast", "target": 45.00},
            {"sub": "SECL", "name": "Dipka Opencast Project", "code": "SECL-DIP-03", "field": "Korba Coalfield", "dist": "Korba", "state": "Chhattisgarh", "type": "Opencast", "target": 35.00},
            {"sub": "NCL", "name": "Jayant Opencast Project", "code": "NCL-JAY-01", "field": "Singrauli Coalfield", "dist": "Singrauli", "state": "Madhya Pradesh", "type": "Opencast", "target": 25.00},
            {"sub": "NCL", "name": "Dudhichua Mine", "code": "NCL-DUD-02", "field": "Singrauli Coalfield", "dist": "Singrauli", "state": "Madhya Pradesh", "type": "Opencast", "target": 20.00},
            {"sub": "NCL", "name": "Nigahi Opencast Mine", "code": "NCL-NIG-03", "field": "Singrauli Coalfield", "dist": "Singrauli", "state": "Madhya Pradesh", "type": "Opencast", "target": 21.00},
            {"sub": "ECL", "name": "Sonepur Bazari Project", "code": "ECL-SBZ-01", "field": "Raniganj Coalfield", "dist": "Paschim Bardhaman", "state": "West Bengal", "type": "Opencast", "target": 12.00},
            {"sub": "ECL", "name": "Rajmahal Opencast Mine", "code": "ECL-RAJ-02", "field": "Rajmahal Coalfield", "dist": "Godda", "state": "Jharkhand", "type": "Opencast", "target": 17.00},
            {"sub": "ECL", "name": "Jhanjra Underground Mine", "code": "ECL-JHA-03", "field": "Raniganj Coalfield", "dist": "Paschim Bardhaman", "state": "West Bengal", "type": "Underground", "target": 3.50},
            {"sub": "BCCL", "name": "Moonidih Underground Mine", "code": "BCCL-MOO-01", "field": "Jharia Coalfield", "dist": "Dhanbad", "state": "Jharkhand", "type": "Underground", "target": 2.20},
            {"sub": "BCCL", "name": "Block II Opencast Project", "code": "BCCL-BLK-02", "field": "Jharia Coalfield", "dist": "Dhanbad", "state": "Jharkhand", "type": "Opencast", "target": 5.00},
            {"sub": "BCCL", "name": "Bhowrah South Mine", "code": "BCCL-BHW-03", "field": "Jharia Coalfield", "dist": "Dhanbad", "state": "Jharkhand", "type": "Mixed", "target": 1.80},
            {"sub": "WCL", "name": "Padmapur Opencast Project", "code": "WCL-PAD-01", "field": "Wardha Valley Coalfield", "dist": "Chandrapur", "state": "Maharashtra", "type": "Opencast", "target": 4.50},
            {"sub": "WCL", "name": "Gondegaon Opencast Mine", "code": "WCL-GON-02", "field": "Kamptee Coalfield", "dist": "Nagpur", "state": "Maharashtra", "type": "Opencast", "target": 3.20},
            {"sub": "MCL", "name": "Bhubaneswari Opencast Mine", "code": "MCL-BHU-01", "field": "Talcher Coalfield", "dist": "Angul", "state": "Odisha", "type": "Opencast", "target": 30.00},
            {"sub": "MCL", "name": "Kulda Opencast Project", "code": "MCL-KUL-02", "field": "Ib Valley Coalfield", "dist": "Jharsuguda", "state": "Odisha", "type": "Opencast", "target": 21.00}
        ]

        mine_objs = {}
        for m in mines_data:
            mine = Mine(
                subsidiary_id=sub_objs[m["sub"]].id,
                name=m["name"],
                code=m["code"],
                coalfield=m["field"],
                district=m["dist"],
                state=m["state"],
                mine_type=m["type"],
                target_annual_mt=m["target"],
                current_status="Operational"
            )
            db.add(mine)
            db.flush()
            mine_objs[m["code"]] = mine

        print("Seeding Parliamentary Query Module Records...")
        pq_items = [
            {
                "no": "PQ-LS-2025-1428",
                "title": "Coal Offtake to Thermal Power Stations and Pithead Stock Reserves",
                "subject": "Adequacy of Fuel Supply Agreements (FSA) and Dispatches to Power Utilities",
                "ministry": "Ministry of Coal",
                "priority": "PARLIAMENTARY_STARRED",
                "deadline": datetime.datetime.utcnow() + datetime.timedelta(days=2),
                "text": "Will the Minister of Coal be pleased to state: (a) whether Coal India Limited achieved its scheduled production and dispatch targets to thermal power stations in Q3 FY 2024-25; (b) the mine-wise coal stock status at pithead sidings; and (c) steps taken to avert supply deficits?",
                "ai_draft": "1. In Q3 FY 2024-25, Coal India achieved 206.2 MT of dispatches to thermal power plants against the target of 200.0 MT (103.1% achievement).\n2. Pithead coal stock stands at a resilient 48.2 MT across CIL subsidiaries as of Jan 2025.\n3. Continuous coordination with Ministry of Railways through the Joint Sub-Group ensures over 360 rakes/day deployment.",
                "status": "UNDER_REVIEW",
                "sub": "CMPDI"
            },
            {
                "no": "PQ-RS-2025-0914",
                "title": "Implementation of Surface Miners and Eco-Friendly Excavation in SECL",
                "subject": "Reduction of Blast Vibrations and Dust Control in Gevra and Kusmunda",
                "ministry": "Ministry of Coal",
                "priority": "HIGH",
                "deadline": datetime.datetime.utcnow() + datetime.timedelta(days=4),
                "text": "Details regarding proportion of coal extracted using blast-free Surface Miners in opencast mines of SECL, and environmental reclamation expenditure.",
                "ai_draft": "Over 78% of opencast production in Gevra and Kusmunda is extracted using high-capacity Surface Miners eliminating blast vibration. Environmental plantation covers 420 hectares in FY 2024-25.",
                "status": "APPROVED",
                "sub": "SECL"
            }
        ]

        for p in pq_items:
            pq = ParliamentaryQuery(
                query_no=p["no"],
                title=p["title"],
                subject=p["subject"],
                ministry=p["ministry"],
                priority=p["priority"],
                deadline=p["deadline"],
                department="Parliamentary Cell / Production Monitoring",
                subsidiary_id=sub_objs[p["sub"]].id,
                assigned_user_id=user_objs["director_geology"].id,
                status=p["status"],
                query_text=p["text"],
                ai_draft_response=p["ai_draft"],
                sources_json=[{"document_name": "CIL_Annual_Production_2024-25.pdf", "page": 4, "confidence": 0.95}],
                confidence_score=0.94
            )
            db.add(pq)

        print("Seeding Document Catalog (Geological, Production, Parliamentary, Mining)...")
        # Seed 105 realistic documents across categories
        doc_categories = [
            ("Geological Report", "CMPDI_Geological_Exploration_Seam_Assessment_Block_IV.pdf", "CCL", "CCL-PIP-02"),
            ("Production Report", "CCL_Rajrappa_Monthly_Production_Jan2025.pdf", "CCL", "CCL-RAJ-01"),
            ("Mining Report", "SECL_Gevra_Mega_Project_Operational_Audit.pdf", "SECL", "SECL-GEV-01"),
            ("Exploration Report", "CMPDI_RI_III_Drilling_Borehole_Lithology_Log.pdf", "CMPDI", "CCL-AMR-04"),
            ("Annual Report", "CIL_Annual_Production_and_Sustainability_2024-25.pdf", "CMPDI", None),
            ("Quarterly Report", "WCL_Quarterly_HEMM_Availability_and_Stripping.pdf", "WCL", "WCL-PAD-01"),
            ("Parliamentary Query", "MoC_Parliamentary_Starred_Inquiry_Dispatches_Response.pdf", "CMPDI", None),
            ("Environmental Report", "ECL_Sonepur_Bazari_Afforestation_and_EC_Compliance.pdf", "ECL", "ECL-SBZ-01"),
            ("Safety Report", "DGMS_Statutory_Safety_Inspection_Moonidih_UG.pdf", "BCCL", "BCCL-MOO-01"),
            ("Financial Data", "NCL_Capital_Expenditure_Heavy_Machinery_FY25.pdf", "NCL", "NCL-JAY-01")
        ]

        doc_count = 0
        for i in range(1, 110):
            cat_tuple = doc_categories[(i - 1) % len(doc_categories)]
            cat_name = cat_tuple[0]
            base_fname = cat_tuple[1].replace(".pdf", f"_v{i}.pdf")
            sub_code = cat_tuple[2]
            mine_code = cat_tuple[3]
            
            sub_id = sub_objs[sub_code].id
            mine_id = mine_objs[mine_code].id if mine_code else None

            doc = Document(
                file_name=base_fname,
                file_type="PDF",
                file_size=1024 * (450 + (i * 25)),
                file_path=f"/storage/uploads/{base_fname}",
                upload_date=datetime.datetime.utcnow() - datetime.timedelta(days=(110 - i)),
                uploaded_by_id=user_objs["doc_officer"].id,
                department="Geology & Exploration" if "Geological" in cat_name else "Production Monitoring",
                subsidiary_id=sub_id,
                mine_id=mine_id,
                document_category=cat_name,
                document_year=2024 if i % 2 == 0 else 2025,
                financial_year="2024-25" if i % 3 != 0 else "2023-24",
                source="CMPDI Central Archive" if i % 2 == 0 else "Subsidiary Upload Portal",
                version=1,
                processing_status="VALIDATED" if i % 6 != 0 else "VALIDATION_REQUIRED",
                confidence_score=round(0.92 + (i % 7) * 0.01, 2),
                ocr_engine_used="Tesseract-PaddleOCR-Hybrid",
                processing_progress=100
            )
            db.add(doc)
            db.flush()
            doc_count += 1

            # Seed Document Page & OCR Result
            page_text = (
                f"CENTRAL MINE PLANNING & DESIGN INSTITUTE / {sub_objs[sub_code].name}\n"
                f"Official Technical Documentation: {base_fname}\n"
                f"Financial Year: {doc.financial_year} | Category: {cat_name}\n"
                f"Recorded Coal Production: {round(3.5 + (i * 0.15), 2)} Million Tonnes | Target: {round(3.8 + (i * 0.15), 2)} MT\n"
                f"Overburden Stripping: {round(8.2 + (i * 0.25), 2)} Million cu.m | Dispatch: {round(3.4 + (i * 0.15), 2)} MT\n"
                f"Proved Reserves evaluated at {round(150.0 + (i * 2.5), 2)} MT with GCV Grade G-10."
            )
            
            p1 = DocumentPage(
                document_id=doc.document_id,
                page_number=1,
                width=800.0,
                height=1100.0,
                raw_text=page_text
            )
            db.add(p1)

            ocr_res = OCRResult(
                document_id=doc.document_id,
                page_number=1,
                text=page_text,
                bounding_box_json={"x": 50, "y": 80, "w": 700, "h": 220, "page": 1},
                ocr_engine="PaddleOCR",
                ocr_confidence=0.96
            )
            db.add(ocr_res)

            # Seed Extracted Entities
            ent1 = ExtractedEntity(
                document_id=doc.document_id,
                page_number=1,
                entity_type="Production",
                raw_value=f"{round(3.5 + (i * 0.15), 2)} MT",
                normalized_value=str(round(3.5 + (i * 0.15), 2)),
                unit="Million Tonnes",
                conversion_method="Direct MT Value",
                bounding_box_json={"x": 60, "y": 140, "w": 280, "h": 22, "page": 1},
                ocr_confidence=0.97,
                extraction_confidence=0.96,
                is_validated=True,
                validation_status="ACCEPTED" if doc.processing_status == "VALIDATED" else "PENDING",
                reviewer_id=user_objs["reviewer_hq"].id
            )
            db.add(ent1)

            ent2 = ExtractedEntity(
                document_id=doc.document_id,
                page_number=1,
                entity_type="Target",
                raw_value=f"{round(3.8 + (i * 0.15), 2)} MT",
                normalized_value=str(round(3.8 + (i * 0.15), 2)),
                unit="Million Tonnes",
                conversion_method="Direct MT Value",
                bounding_box_json={"x": 380, "y": 140, "w": 280, "h": 22, "page": 1},
                ocr_confidence=0.95,
                extraction_confidence=0.95,
                is_validated=True,
                validation_status="ACCEPTED"
            )
            db.add(ent2)

            # Seed Embedding
            emb_vec = VectorEmbedder.get_embedding(page_text)
            doc_emb = DocumentEmbedding(
                document_id=doc.document_id,
                chunk_index=0,
                page_number=1,
                content=page_text,
                embedding_vector_json=emb_vec,
                metadata_json={"category": cat_name, "subsidiary": sub_code, "fy": doc.financial_year}
            )
            db.add(doc_emb)

            # Seed some validation discrepancies
            if i in [6, 12, 18, 24]:
                val = ValidationResult(
                    document_id=doc.document_id,
                    rule_name="Cross-Document Reconciliation Check",
                    validation_type="CROSS_DOCUMENT",
                    severity="WARNING",
                    message=f"Variance of 0.42 MT identified between monthly dispatch log and quarterly siding ledger for {base_fname}.",
                    field_name="Production",
                    expected_value="3.85 MT",
                    actual_value="4.27 MT",
                    status="REQUIRES_REVIEW"
                )
                db.add(val)

        print(f"Successfully seeded {doc_count} documents with full pages, OCR, entities, and embeddings.")

        print("Seeding AI Recommendations...")
        recs = [
            {
                "category": "PRODUCTION_ANOMALY",
                "fact": "SECL Gevra Mega OC exceeded planned production target by 4.8% (52.4 MT achieved vs 50.0 MT target).",
                "ai_interpretation": "Continuous operation of in-pit crushing and conveying (IPCC) eliminated dumper haulage bottlenecks.",
                "suggested_action": "Replicate IPCC continuous loading protocol at Kusmunda and Dipka pits for FY 2025-26 planning.",
                "severity": "LOW",
                "sub": "SECL"
            },
            {
                "category": "DATA_INCONSISTENCY",
                "fact": "Discrepancy of 0.7 MT noted between ECL monthly submission and annual compilation sheet.",
                "ai_interpretation": "Inter-subsidiary emergency coal transfer to Mejia Thermal Power not reflected in local subsidiary dispatch account.",
                "suggested_action": "Conduct cross-departmental reconciliation before final parliamentary audit report closure.",
                "severity": "HIGH",
                "sub": "ECL"
            }
        ]

        for r in recs:
            rec_obj = AIRecommendation(
                category=r["category"],
                fact=r["fact"],
                ai_interpretation=r["ai_interpretation"],
                suggested_action=r["suggested_action"],
                confidence=0.93,
                severity=r["severity"],
                subsidiary_id=sub_objs[r["sub"]].id
            )
            db.add(rec_obj)

        print("Seeding Audit Log Cryptographic Blockchain...")
        AuditLog.create_log(
            db,
            user_id=user_objs["admin"].id,
            user_name="admin",
            action="SYSTEM_INITIALIZATION",
            entity_type="SYSTEM",
            entity_id="ROOT",
            old_val=None,
            new_val="CMPDI Platform Bootstrapped",
            reason="Platform bootstrap and master seed deployment",
            ip="127.0.0.1"
        )

        db.commit()
        print("Database seed completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
