import datetime
import uuid
import hashlib
import json
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), default="ANALYST", index=True) # SUPER_ADMIN, ADMIN, ANALYST, DOCUMENT_OFFICER, REVIEWER, APPROVER, VIEWER
    organization = Column(String(100), default="CMPDI/CIL")
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=True)
    department = Column(String(100), default="Geology & Exploration")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    subsidiary = relationship("Subsidiary", back_populates="users")
    uploaded_documents = relationship("Document", back_populates="uploader")

class Subsidiary(Base):
    __tablename__ = "subsidiaries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, index=True, nullable=False) # ECL, BCCL, CCL, WCL, SECL, NCL, MCL, CMPDI
    state = Column(String(50), nullable=False)
    hq_location = Column(String(100), nullable=False)
    contact_email = Column(String(100), nullable=True)
    annual_target_mt = Column(Float, default=0.0)
    
    mines = relationship("Mine", back_populates="subsidiary")
    users = relationship("User", back_populates="subsidiary")
    documents = relationship("Document", back_populates="subsidiary")

class Mine(Base):
    __tablename__ = "mines"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=False)
    name = Column(String(100), nullable=False, index=True)
    code = Column(String(30), unique=True, index=True, nullable=False)
    coalfield = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    mine_type = Column(String(50), default="Opencast") # Opencast, Underground, Mixed
    target_annual_mt = Column(Float, default=0.0)
    current_status = Column(String(50), default="Operational") # Operational, Under Development, Non-Operational
    
    subsidiary = relationship("Subsidiary", back_populates="mines")
    documents = relationship("Document", back_populates="mine")
    metrics = relationship("ExtractedMetric", back_populates="mine")

class Document(Base):
    __tablename__ = "documents"
    
    document_id = Column(String(36), primary_key=True, default=generate_uuid)
    file_name = Column(String(255), nullable=False, index=True)
    file_type = Column(String(20), nullable=False) # PDF, DOCX, XLSX, CSV, JPG, PNG, TIFF, TXT
    file_size = Column(Integer, default=0) # in bytes
    file_path = Column(String(500), nullable=False)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    uploaded_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    department = Column(String(100), default="Geology & Exploration")
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=True)
    mine_id = Column(String(36), ForeignKey("mines.id"), nullable=True)
    
    # Classification & Metadata
    document_category = Column(String(50), default="Mining Report", index=True) 
    # Geological Report, Mining Report, Production Report, Exploration Report, Administrative Report, Parliamentary Query, Monthly Report, Quarterly Report, Annual Report, Financial Data, Environmental Report, Safety Report, Other
    document_year = Column(Integer, default=2025, index=True)
    financial_year = Column(String(20), default="2024-25", index=True) # e.g. 2024-25
    source = Column(String(100), default="Internal Subsidiary Upload")
    version = Column(Integer, default=1)
    
    # State tracking
    processing_status = Column(String(40), default="UPLOADED", index=True)
    # UPLOADED, QUEUED, PROCESSING, OCR_COMPLETE, EXTRACTION_COMPLETE, VALIDATION_REQUIRED, VALIDATED, FAILED, ARCHIVED
    confidence_score = Column(Float, default=0.0) # 0.0 to 1.0
    ocr_engine_used = Column(String(50), default="Tesseract-PaddleOCR-Hybrid")
    processing_progress = Column(Integer, default=0) # 0 to 100%
    error_message = Column(Text, nullable=True)
    
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    uploader = relationship("User", back_populates="uploaded_documents")
    subsidiary = relationship("Subsidiary", back_populates="documents")
    mine = relationship("Mine", back_populates="documents")
    pages = relationship("DocumentPage", back_populates="document", cascade="all, delete-orphan")
    ocr_results = relationship("OCRResult", back_populates="document", cascade="all, delete-orphan")
    extracted_entities = relationship("ExtractedEntity", back_populates="document", cascade="all, delete-orphan")
    extracted_tables = relationship("ExtractedTable", back_populates="document", cascade="all, delete-orphan")
    validation_results = relationship("ValidationResult", back_populates="document", cascade="all, delete-orphan")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")
    embeddings = relationship("DocumentEmbedding", back_populates="document", cascade="all, delete-orphan")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    changes_summary = Column(Text, nullable=True)
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="versions")

class DocumentPage(Base):
    __tablename__ = "document_pages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    width = Column(Float, default=800.0)
    height = Column(Float, default=1100.0)
    raw_text = Column(Text, nullable=True)
    page_image_path = Column(String(500), nullable=True)
    
    document = relationship("Document", back_populates="pages")

class OCRResult(Base):
    __tablename__ = "ocr_results"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    bounding_box_json = Column(JSON, default=dict) # {"x": ..., "y": ..., "w": ..., "h": ...}
    ocr_engine = Column(String(50), default="PaddleOCR")
    ocr_confidence = Column(Float, default=0.95)
    layout_type = Column(String(50), default="paragraph") # heading, paragraph, table, figure, caption
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="ocr_results")

class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    entity_type = Column(String(50), nullable=False, index=True) 
    # Coal Mine, Coalfield, Subsidiary, Project, Location, District, State, Production, Target, Dispatch, Stock, Overburden, Manpower, Excavation, Drilling, Reserves, Resources, Grade, Quality, Year, Month, Financial Year, Cost, Revenue, Equipment, Machinery, Safety Incident, Project Status
    
    raw_value = Column(String(255), nullable=False)
    normalized_value = Column(String(255), nullable=False)
    unit = Column(String(50), nullable=True) # tonnes, MT, cu.m, meters, persons, INR Lakhs, etc.
    conversion_method = Column(String(100), default="Direct string normalization")
    bounding_box_json = Column(JSON, default=dict) # exact bounding box for split-screen traceability
    
    ocr_confidence = Column(Float, default=0.95)
    extraction_confidence = Column(Float, default=0.92)
    
    # Human-in-the-loop review
    is_validated = Column(Boolean, default=False)
    validation_status = Column(String(30), default="PENDING") # PENDING, ACCEPTED, EDITED, REJECTED, FLAGGED
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    review_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="extracted_entities")

class ExtractedTable(Base):
    __tablename__ = "extracted_tables"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    table_title = Column(String(255), default="Operational Statistics Table")
    headers_json = Column(JSON, default=list) # List of column headers
    rows_json = Column(JSON, default=list) # 2D array of extracted cells
    raw_html = Column(Text, nullable=True)
    normalized_data_json = Column(JSON, default=list) # List of dict records
    confidence = Column(Float, default=0.94)
    bounding_box_json = Column(JSON, default=dict)
    
    document = relationship("Document", back_populates="extracted_tables")

class ExtractedMetric(Base):
    __tablename__ = "extracted_metrics"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    mine_id = Column(String(36), ForeignKey("mines.id"), nullable=True)
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=True)
    
    metric_name = Column(String(100), nullable=False, index=True) # Production, Target, Dispatch, Overburden, Manpower, Reserves
    raw_value = Column(Float, nullable=False)
    normalized_value = Column(Float, nullable=False)
    unit = Column(String(50), default="Million Tonnes")
    period_month = Column(Integer, nullable=True)
    period_year = Column(Integer, nullable=False, default=2025)
    financial_year = Column(String(20), default="2024-25", index=True)
    confidence = Column(Float, default=0.95)
    validation_status = Column(String(30), default="VALIDATED")
    
    mine = relationship("Mine", back_populates="metrics")

class ValidationResult(Base):
    __tablename__ = "validation_results"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    rule_name = Column(String(100), nullable=False)
    validation_type = Column(String(50), default="RULE_BASED") # RULE_BASED, CROSS_DOCUMENT
    severity = Column(String(20), default="WARNING") # ERROR, WARNING, INFO
    message = Column(Text, nullable=False)
    field_name = Column(String(100), nullable=True)
    expected_value = Column(String(255), nullable=True)
    actual_value = Column(String(255), nullable=True)
    
    status = Column(String(30), default="REQUIRES_REVIEW") # PENDING, REQUIRES_REVIEW, ACCEPTED, REJECTED, FLAGGED
    reviewed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="validation_results")

class ParliamentaryQuery(Base):
    __tablename__ = "parliamentary_queries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    query_no = Column(String(50), unique=True, index=True, nullable=False) # e.g. PQ-LS-2025-1428
    title = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    ministry = Column(String(100), default="Ministry of Coal")
    priority = Column(String(50), default="PARLIAMENTARY_STARRED") # HIGH, URGENT, PARLIAMENTARY_STARRED, PARLIAMENTARY_UNSTARRED
    received_date = Column(DateTime, default=datetime.datetime.utcnow)
    deadline = Column(DateTime, nullable=False)
    department = Column(String(100), default="Parliamentary Affairs / Production")
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=True)
    assigned_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    status = Column(String(40), default="NEW", index=True)
    # NEW, IN_PROGRESS, AI_DRAFT_READY, UNDER_REVIEW, APPROVED, SENT, CLOSED
    query_text = Column(Text, nullable=False)
    ai_draft_response = Column(Text, nullable=True)
    final_response = Column(Text, nullable=True)
    sources_json = Column(JSON, default=list) # List of document_ids, pages, citations
    confidence_score = Column(Float, default=0.91)
    
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    approver_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    approval_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ReportTemplate(Base):
    __tablename__ = "report_templates"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    report_type = Column(String(50), nullable=False) # DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL, PARLIAMENTARY_DRAFT, EXECUTIVE_SUMMARY
    header_text = Column(String(255), default="GOVERNMENT OF INDIA - MINISTRY OF COAL / CMPDI")
    footer_text = Column(String(255), default="CONFIDENTIAL - FOR OFFICIAL USE ONLY")
    logo_path = Column(String(255), default="/assets/cmpdi-cil-logo.png")
    sections_json = Column(JSON, default=list) # List of section titles & structures
    confidentiality_level = Column(String(50), default="RESTRICTED") # OFFICIAL, RESTRICTED, CONFIDENTIAL, SECRET
    approval_required = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    report_type = Column(String(50), nullable=False)
    template_id = Column(String(36), ForeignKey("report_templates.id"), nullable=True)
    subsidiary_id = Column(String(36), ForeignKey("subsidiaries.id"), nullable=True)
    mine_id = Column(String(36), ForeignKey("mines.id"), nullable=True)
    financial_year = Column(String(20), default="2024-25")
    date_range_start = Column(DateTime, nullable=True)
    date_range_end = Column(DateTime, nullable=True)
    
    executive_summary = Column(Text, nullable=True)
    content_markdown = Column(Text, nullable=False)
    metrics_summary_json = Column(JSON, default=dict)
    ai_insights_json = Column(JSON, default=list)
    observations_json = Column(JSON, default=list)
    exceptions_json = Column(JSON, default=list)
    source_references_json = Column(JSON, default=list)
    
    status = Column(String(40), default="DRAFT") # DRAFT, UNDER_REVIEW, APPROVED, PUBLISHED
    generated_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    pdf_path = Column(String(500), nullable=True)
    docx_path = Column(String(500), nullable=True)
    xlsx_path = Column(String(500), nullable=True)
    csv_path = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(50), nullable=False) # REPORT, PARLIAMENTARY_QUERY, VALIDATION_DISCREPANCY
    entity_id = Column(String(36), nullable=False, index=True)
    approver_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    status = Column(String(30), default="PENDING") # PENDING, APPROVED, REJECTED, CHANGES_REQUESTED
    remarks = Column(Text, nullable=True)
    signature_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    user_name = Column(String(100), default="SYSTEM")
    action = Column(String(100), nullable=False, index=True) 
    # DOCUMENT_UPLOAD, OCR_EXECUTION, EXTRACTION, VALUE_MODIFIED, VALUE_ACCEPTED, VALUE_REJECTED, REPORT_GENERATED, AI_QUERY_EXECUTED, REPORT_APPROVED, EXPORT_DOWNLOADED, DOCUMENT_DELETED
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(36), nullable=True)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    session_id = Column(String(100), nullable=True)
    prev_hash = Column(String(64), nullable=True) # Blockchain-style cryptographic immutable log chain
    hash_signature = Column(String(64), nullable=False)

    @classmethod
    def create_log(cls, db_session, user_id, user_name, action, entity_type, entity_id=None, old_val=None, new_val=None, reason=None, ip="127.0.0.1", session_id=None):
        # Find previous log hash
        last_log = db_session.query(cls).order_by(cls.timestamp.desc()).first()
        prev_hash = last_log.hash_signature if last_log else "0000000000000000000000000000000000000000000000000000000000000000"
        
        ts = datetime.datetime.utcnow()
        raw_to_hash = f"{prev_hash}|{user_id}|{action}|{ts.isoformat()}|{entity_type}|{entity_id}|{old_val}|{new_val}|{reason}"
        sig = hashlib.sha256(raw_to_hash.encode()).hexdigest()
        
        log_entry = cls(
            id=generate_uuid(),
            user_id=user_id,
            user_name=user_name,
            action=action,
            timestamp=ts,
            entity_type=entity_type,
            entity_id=entity_id,
            old_value=str(old_val) if old_val is not None else None,
            new_value=str(new_val) if new_val is not None else None,
            reason=reason,
            ip_address=ip,
            session_id=session_id,
            prev_hash=prev_hash,
            hash_signature=sig
        )
        db_session.add(log_entry)
        return log_entry

class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.document_id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding_vector_json = Column(JSON, nullable=False) # List of floats
    metadata_json = Column(JSON, default=dict)
    
    document = relationship("Document", back_populates="embeddings")

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    frequency = Column(Integer, default=1)
    keywords_json = Column(JSON, default=list)
    cluster_id = Column(Integer, default=0)
    year = Column(Integer, default=2025)
    subsidiary_id = Column(String(36), nullable=True)

class Keyword(Base):
    __tablename__ = "keywords"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    word = Column(String(100), nullable=False, unique=True, index=True)
    tf_idf_score = Column(Float, default=0.0)
    frequency = Column(Integer, default=1)
    category = Column(String(50), default="Mining")
    document_count = Column(Integer, default=1)

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(100), nullable=False) # DATA_INCONSISTENCY, MISSING_DOCUMENT, PRODUCTION_ANOMALY, REPEATED_ISSUE, HISTORICAL_PATTERN, REPORTING_DELAY
    fact = Column(Text, nullable=False) # Observed Fact
    ai_interpretation = Column(Text, nullable=False) # AI Interpretation
    suggested_action = Column(Text, nullable=False) # Suggested Action
    confidence = Column(Float, default=0.90)
    severity = Column(String(20), default="MEDIUM") # HIGH, MEDIUM, LOW
    status = Column(String(30), default="ACTIVE") # ACTIVE, REVIEWED, DISMISSED, ACTIONED
    subsidiary_id = Column(String(36), nullable=True)
    mine_id = Column(String(36), nullable=True)
    document_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="INFO") # SUCCESS, WARNING, ERROR, INFO
    is_read = Column(Boolean, default=False)
    link_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
