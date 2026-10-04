import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# User & Auth
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str
    department: Optional[str] = "Geology & Exploration"
    subsidiary_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: str
    organization: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Subsidiary & Mine
class SubsidiaryResponse(BaseModel):
    id: str
    name: str
    code: str
    state: str
    hq_location: str
    contact_email: Optional[str] = None
    annual_target_mt: float

    class Config:
        from_attributes = True

class MineResponse(BaseModel):
    id: str
    subsidiary_id: str
    name: str
    code: str
    coalfield: str
    district: str
    state: str
    mine_type: str
    target_annual_mt: float
    current_status: str

    class Config:
        from_attributes = True

# Documents
class DocumentBase(BaseModel):
    file_name: str
    file_type: str
    file_size: int
    department: str
    subsidiary_id: Optional[str] = None
    mine_id: Optional[str] = None
    document_category: str
    document_year: int
    financial_year: str
    source: str

class DocumentResponse(DocumentBase):
    document_id: str
    upload_date: datetime.datetime
    uploaded_by_id: Optional[str] = None
    version: int
    processing_status: str
    confidence_score: float
    ocr_engine_used: Optional[str] = None
    processing_progress: int
    error_message: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
    subsidiary_name: Optional[str] = None
    mine_name: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentStatusResponse(BaseModel):
    document_id: str
    processing_status: str
    processing_progress: int
    stages: Dict[str, str] # e.g. {"upload": "COMPLETE", "ocr": "COMPLETE", "extraction": "PROGRESS", ...}
    confidence_score: float
    error_message: Optional[str] = None

# Extracted Entities & Tables
class BoundingBox(BaseModel):
    x: float
    y: float
    w: float
    h: float
    page: int

class ExtractedEntityResponse(BaseModel):
    id: str
    document_id: str
    page_number: int
    entity_type: str
    raw_value: str
    normalized_value: str
    unit: Optional[str] = None
    conversion_method: Optional[str] = None
    bounding_box_json: Optional[Dict[str, Any]] = None
    ocr_confidence: float
    extraction_confidence: float
    is_validated: bool
    validation_status: str
    reviewer_id: Optional[str] = None
    review_notes: Optional[str] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class ExtractedTableResponse(BaseModel):
    id: str
    document_id: str
    page_number: int
    table_title: str
    headers_json: List[str]
    rows_json: List[List[str]]
    normalized_data_json: List[Dict[str, Any]]
    confidence: float
    bounding_box_json: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class EntityCorrectionRequest(BaseModel):
    entity_id: str
    corrected_value: str
    unit: Optional[str] = None
    action: str = Field(..., description="ACCEPT, EDIT, REJECT, or FLAG")
    notes: Optional[str] = None

# Validation
class ValidationResultResponse(BaseModel):
    id: str
    document_id: str
    rule_name: str
    validation_type: str
    severity: str
    message: str
    field_name: Optional[str] = None
    expected_value: Optional[str] = None
    actual_value: Optional[str] = None
    status: str
    reviewed_by_id: Optional[str] = None
    reviewed_at: Optional[datetime.datetime] = None
    comments: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ValidationActionRequest(BaseModel):
    validation_id: str
    action: str = Field(..., description="ACCEPT, REJECT, or FLAG")
    comments: Optional[str] = None

# Search & RAG
class SearchFilter(BaseModel):
    document_category: Optional[str] = None
    subsidiary_id: Optional[str] = None
    mine_id: Optional[str] = None
    year: Optional[int] = None
    financial_year: Optional[str] = None
    min_confidence: Optional[float] = 0.0

class SearchRequest(BaseModel):
    query: str
    search_type: str = "HYBRID" # KEYWORD, SEMANTIC, HYBRID
    filters: Optional[SearchFilter] = None
    limit: int = 15

class SearchResultItem(BaseModel):
    document_id: str
    file_name: str
    document_category: str
    page_number: int
    subsidiary: str
    mine: Optional[str] = None
    financial_year: str
    snippet: str
    highlighted_evidence: str
    score: float
    confidence: float
    bounding_box: Optional[Dict[str, Any]] = None

class SearchResponse(BaseModel):
    total_results: int
    query: str
    execution_time_ms: float
    results: List[SearchResultItem]

class AICitation(BaseModel):
    document_id: str
    document_name: str
    page_number: int
    subsidiary: str
    extracted_evidence: str
    bounding_box: Optional[Dict[str, Any]] = None
    confidence: float
    timestamp: str

class AIQueryRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    subsidiary_id: Optional[str] = None
    financial_year: Optional[str] = None
    policy: Optional[str] = "LOCAL_ONLY" # LOCAL_ONLY, PRIVATE_CLOUD, APPROVED_CLOUD

class AIQueryResponse(BaseModel):
    answer: str
    sources: List[AICitation]
    confidence: float
    model_used: str
    execution_time_ms: float
    data_timestamp: str
    insufficient_evidence: bool = False
    governance_policy_applied: str

# Parliamentary Query Module
class ParliamentaryQueryCreate(BaseModel):
    query_no: str
    title: str
    subject: str
    ministry: Optional[str] = "Ministry of Coal"
    priority: str = "PARLIAMENTARY_STARRED"
    deadline: datetime.datetime
    department: str = "Parliamentary Affairs"
    subsidiary_id: Optional[str] = None
    query_text: str

class ParliamentaryQueryUpdate(BaseModel):
    status: Optional[str] = None
    ai_draft_response: Optional[str] = None
    final_response: Optional[str] = None
    assigned_user_id: Optional[str] = None

class ParliamentaryQueryResponse(BaseModel):
    id: str
    query_no: str
    title: str
    subject: str
    ministry: str
    priority: str
    received_date: datetime.datetime
    deadline: datetime.datetime
    department: str
    subsidiary_id: Optional[str] = None
    assigned_user_id: Optional[str] = None
    status: str
    query_text: str
    ai_draft_response: Optional[str] = None
    final_response: Optional[str] = None
    sources_json: List[Dict[str, Any]]
    confidence_score: float
    reviewer_id: Optional[str] = None
    approver_id: Optional[str] = None
    approval_date: Optional[datetime.datetime] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Reports
class ReportGenerateRequest(BaseModel):
    title: str
    report_type: str # DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL, CUSTOM, PARLIAMENTARY_DRAFT, EXECUTIVE_SUMMARY
    template_id: Optional[str] = None
    subsidiary_id: Optional[str] = None
    mine_id: Optional[str] = None
    financial_year: Optional[str] = "2024-25"
    date_range_start: Optional[datetime.datetime] = None
    date_range_end: Optional[datetime.datetime] = None
    metrics_to_include: List[str] = ["Production", "Target", "Dispatch", "Overburden", "Efficiency"]
    custom_instructions: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    title: str
    report_type: str
    subsidiary_id: Optional[str] = None
    mine_id: Optional[str] = None
    financial_year: str
    executive_summary: Optional[str] = None
    content_markdown: str
    metrics_summary_json: Dict[str, Any]
    ai_insights_json: List[str]
    observations_json: List[str]
    exceptions_json: List[str]
    source_references_json: List[Dict[str, Any]]
    status: str
    pdf_path: Optional[str] = None
    docx_path: Optional[str] = None
    xlsx_path: Optional[str] = None
    csv_path: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ReportTemplateResponse(BaseModel):
    id: str
    name: str
    report_type: str
    header_text: str
    footer_text: str
    confidentiality_level: str
    approval_required: bool

    class Config:
        from_attributes = True

# Dashboard & Analytics KPIs
class DashboardKPIs(BaseModel):
    documents_processed: int
    extraction_accuracy: float # Real calculated percentage
    reports_generated: int
    queries_resolved: int
    automation_rate: float # Real calculated percentage
    time_reduction_percentage: float # Calculated ((Manual - Auto) / Manual) * 100
    average_processing_time_sec: float
    validation_errors_count: int
    pending_reviews_count: int
    avg_query_response_time_sec: float

class AnalyticsOverview(BaseModel):
    kpis: DashboardKPIs
    production_trends: List[Dict[str, Any]]
    subsidiary_performance: List[Dict[str, Any]]
    processing_trends: List[Dict[str, Any]]
    accuracy_trends: List[Dict[str, Any]]
    anomalies: List[Dict[str, Any]]

# Word Cloud & Topics
class WordCloudItem(BaseModel):
    text: str
    value: int
    category: str
    tf_idf: float

class TopicResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    frequency: int
    keywords: List[str]
    cluster_id: int
    year: int

# Audit Trail
class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    user_name: str
    action: str
    timestamp: datetime.datetime
    entity_type: str
    entity_id: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    reason: Optional[str] = None
    ip_address: str
    hash_signature: str

    class Config:
        from_attributes = True

# AI Recommendations
class AIRecommendationResponse(BaseModel):
    id: str
    category: str
    fact: str
    ai_interpretation: str
    suggested_action: str
    confidence: float
    severity: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
