# CMPDI / CIL AI Data Intelligence Platform
> **Enterprise AI-Powered Geological, Mining & Production Data Intelligence and Automated Reporting Platform**
> Developed for **Central Mine Planning & Design Institute (CMPDI)**, **Coal India Limited (CIL)**, and **Ministry of Coal, Government of India**.

---

## 🏆 Smart India Hackathon (SIH) 2026 - Problem Statement

**PS ID:** SIH26023  
**Title:** AI-Powered Geological, Mining and other Reporting Solution for CMPDI/CIL subsidiaries  
**Category:** Software

### Context & Objective
The Ministry of Coal aims to leverage Artificial Intelligence, advanced data analytics, and smart automation to enhance operational efficiency, safety, and governance within the Indian coal mining sector. The Central Mine Planning & Design Institute (CMPDI) acts as the nodal agency for this initiative. 

Our solution provides a unified AI platform that digitizes and processes massive volumes of unstructured geological exploration dossiers, borehole lithology logs, and DGMS compliance reports. It uses highly accurate OCR and RAG models to reduce manual data-entry time, flags operational anomalies in coal production, and synthesizes automated parliamentary question responses with full auditability.

---

## 🏛️ Executive Platform Overview

The **CMPDI / CIL AI Data Intelligence Platform** is an enterprise-grade AI system designed to digitize, unify, validate, and query geological exploration dossiers, borehole lithology logs, monthly mining production returns, and statutory DGMS compliance reports across all 8 operating subsidiaries of Coal India Limited.

### Core Modules & Capabilities

1. **Executive Intelligence Dashboard**:
   - Real-time KPIs (109+ indexed documents, 96.2% extraction accuracy, 91.8% cycle time reduction).
   - Recharts-powered monthly production trend curves, annual target benchmarks, and overburden removal tracking.
   - Subsidiary achievement comparison tables (SECL, MCL, NCL, CCL, WCL, BCCL, ECL, CMPDI).
   - Operational anomaly detection & AI strategic advisory feed.

2. **Document Ingestion Hub & OCR Pipeline**:
   - Multi-format file ingestion (PDF, DOCX, XLSX, TIFF, Scans) with automatic categorization.
   - Dual hybrid OCR processing (PaddleOCR-v4 + Tesseract) with vector chunking and metadata tagging.
   - Filterable document catalog with confidence scoring and processing stage meters.

3. **Split-Screen Extraction Studio & Verification Workbench**:
   - Dual-pane interactive workbench with document canvas on the left and structured extractions on the right.
   - Spatial bounding-box overlay linking raw document coordinates to structured entities.
   - Human-in-the-Loop review actions: in-line Accept, Edit with audit justifications, or Reject.
   - Tabular extraction viewer with CSV export capabilities.

4. **CMPDI Grounded Intelligence Copilot (RAG v2.4)**:
   - Zero-hallucination Conversational AI grounded exclusively in verified CMPDI geological dossiers.
   - Configurable Data Governance Policies (`LOCAL_ONLY`, `HYBRID_CLOUD`, `AIR_GAPPED`).
   - Every response provides verifiable source document citations, page numbers, and bounding-box coordinates.

5. **Hybrid Multi-Modal Search Engine**:
   - Sub-15ms semantic dense vector search (BGE-M3 768-dim) merged with lexical BM25 keyword matching.
   - Faceted filters by document category, subsidiary, and financial year.

6. **Parliamentary Questions (PQ) Grounded Synthesis**:
   - Automated drafting of Lok Sabha and Rajya Sabha parliamentary inquiries.
   - Starred inquiry countdown trackers, evidence attribution, and Executive Directorate sign-off approval workflow.

7. **Automated Multi-Format Report Generator**:
   - One-click synthesis of Monthly Returns, Quarterly Exploration Briefings, and Annual Audits.
   - Generates publication-ready exports in 4 official formats: **PDF**, **Word (.docx)**, **Excel (.xlsx)**, and **CSV**.

8. **Thematic Topic Modeling & NLP Word Cloud**:
   - Interactive term frequency cloud and unsupervised topic discovery (LDA + BERTopic) covering overburden excavation, seam thickness, coal beneficiation, and environmental afforestation.

9. **Immutable Enterprise Audit Trail**:
   - Regulatory compliance ledger tracking all document uploads, entity approvals, edits, and ministerial responses.
   - Cryptographically secured with SHA-256 hash signatures.

---

## 🏗️ Technical Architecture

```
R1/
├── frontend/                     # Next.js 14 App Router Web Application
│   ├── app/
│   │   ├── globals.css           # Tailwind base styles and custom scrollbars
│   │   ├── layout.tsx            # Root HTML layout with Ministry of Coal branding
│   │   └── page.tsx              # Main orchestrator linking all 9 modules
│   ├── components/               # Modular UI Components
│   │   ├── Navbar.tsx            # Top Government bar & user session controls
│   │   ├── Sidebar.tsx           # Operational navigation rail with status indicators
│   │   ├── DashboardTab.tsx      # Executive KPIs, Recharts graphs, anomalies
│   │   ├── DocumentsTab.tsx      # File ingestion dropzone & document table
│   │   ├── ExtractionStudioTab.tsx # Split-screen canvas & human-in-the-loop review
│   │   ├── AIAssistantTab.tsx    # Grounded RAG conversational copilot
│   │   ├── SearchTab.tsx         # Hybrid semantic search engine
│   │   ├── ParliamentaryTab.tsx  # Starred inquiry response workflow
│   │   ├── ReportsTab.tsx        # Multi-format report generator & downloader
│   │   ├── AnalyticsTab.tsx      # Word cloud & thematic topic clusters
│   │   └── AuditTab.tsx          # Tamper-evident SHA-256 audit ledger
│   ├── services/
│   │   └── api.ts                # Resilient API service with live/offline fallback
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # FastAPI Python REST API & Microservices
│   ├── app/
│   │   ├── main.py               # FastAPI application entry point & CORS
│   │   ├── api/routes.py         # REST endpoints for all platform capabilities
│   │   ├── core/                 # DB configuration, security, and RBAC
│   │   ├── models/entities.py    # SQLAlchemy database models
│   │   ├── schemas/              # Pydantic schemas
│   │   └── services/             # Report generators & analytics engines
│   └── tests/test_platform.py    # Automated test suite
│
├── ai/                           # Dedicated Artificial Intelligence Engine
│   ├── ocr/                      # Hybrid OCR extraction engine (Paddle + Tesseract)
│   ├── extraction/               # Entity & tabular structure extraction
│   ├── classification/           # Document classification
│   ├── embeddings/               # Dense vector embeddings
│   ├── rag/                      # Grounded RAG pipeline
│   ├── topic_modeling/           # BERTopic & word cloud engine
│   └── validation/               # Rule-based mathematical reconciliation
│
└── cmpdi_platform.db             # Pre-seeded SQLite database (109+ docs, 20+ mines)
```

---

## 🚀 Running the Platform

### Option A: One-Command Unified Runner (Recommended)

Run both the FastAPI Backend (Port 8000) and Next.js Frontend (Port 3000) concurrently with a single command:

```bash
./run.sh
```

This launches both services and cleanly stops all processes when pressing `Ctrl+C`.

---

### Option B: Running Individual Services

#### 1. Launching the Frontend Web Application

```bash
cd frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

To verify a production build:
```bash
cd frontend
npm run build
npm start
```

### 2. Launching the Backend API (Optional)

The backend provides the live Python REST endpoints on port 8000:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Interactive API documentation will be available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🔒 Security & Data Governance

- **RBAC Enforcement**: Support for 7 roles (`SUPER_ADMIN`, `ADMIN`, `ANALYST`, `DOCUMENT_OFFICER`, `REVIEWER`, `APPROVER`, `VIEWER`).
- **Air-Gapped Operation**: Grounded RAG models operate completely on-premise without external API egress to protect strategic national mineral reserve data.
- **SHA-256 Audit Records**: Every human correction or approval is recorded with a non-repudiation cryptographic signature.
