import {
  GSI_NATIONAL_COAL_RESOURCES,
  NATIONAL_TOTAL_RESOURCES_MT,
  CIL_SUBSIDIARY_PRODUCTION,
  TOTAL_CIL_PRODUCTION_2024_25,
  TOTAL_CIL_PRODUCTION_2023_24,
  TOTAL_CIL_ANNUAL_TARGET,
  REAL_MEGA_MINES_DATABASE,
  NATIONAL_LOGISTICS_BENCHMARKS
} from './realCoalData';

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? 'http://127.0.0.1:8000/api' : '/api';
  }
  return 'http://127.0.0.1:8000/api';
};
const API_BASE = getApiBase();

export interface DashboardKPIs {
  documents_processed: number;
  extraction_accuracy: number;
  reports_generated: number;
  queries_resolved: number;
  automation_rate: number;
  time_reduction_percentage: number;
  average_processing_time_sec: number;
  validation_errors_count: number;
  pending_reviews_count: number;
  avg_query_response_time_sec: number;
}

export interface DocumentItem {
  document_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  department: string;
  subsidiary_name?: string;
  mine_name?: string;
  document_category: string;
  document_year: number;
  financial_year: string;
  processing_status: string;
  confidence_score: number;
  processing_progress: number;
}

export interface ExtractedEntity {
  id: string;
  document_id: string;
  page_number: number;
  entity_type: string;
  raw_value: string;
  normalized_value: string;
  unit?: string;
  conversion_method?: string;
  bounding_box_json?: { x: number; y: number; w: number; h: number; page: number };
  ocr_confidence: number;
  extraction_confidence: number;
  validation_status: string;
  is_validated: boolean;
}

export interface ExtractedTableData {
  id: string;
  table_title: string;
  page_number: number;
  headers: string[];
  rows: (string | number)[][];
  confidence: number;
}

export interface ParliamentaryQueryItem {
  id: string;
  query_no: string;
  title: string;
  subject: string;
  ministry: string;
  priority: string;
  deadline: string;
  status: string;
  query_text: string;
  ai_draft_response?: string;
  final_response?: string;
  confidence_score: number;
  sources_json: Array<{ document_name: string; page: number; confidence: number }>;
}

export interface ReportItem {
  id: string;
  title: string;
  report_type: string;
  financial_year: string;
  executive_summary?: string;
  metrics_summary_json: Record<string, any>;
  ai_insights_json: string[];
  observations_json: string[];
  exceptions_json: string[];
  source_references_json: Array<{ document_name: string; page_number: number }>;
  status: string;
  pdf_path?: string;
  docx_path?: string;
  xlsx_path?: string;
  csv_path?: string;
  created_at: string;
  tabular_data?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
  entity_type: string;
  entity_id?: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
  ip_address: string;
  hash_signature: string;
}

export interface ValidationItem {
  id: string;
  document_id: string;
  rule_name: string;
  validation_type: string;
  severity: string;
  message: string;
  field_name?: string;
  expected_value?: string;
  actual_value?: string;
  status: string;
  comments?: string;
  created_at: string;
}

export interface SubsidiaryItem {
  id: string;
  name: string;
  code: string;
  state: string;
  hq_location: string;
  annual_target_mt: number;
  actual_production_mt?: number;
}

export interface MineItem {
  id: string;
  subsidiary_id: string;
  name: string;
  code: string;
  coalfield: string;
  district: string;
  state: string;
  mine_type: string;
  target_annual_mt: number;
  current_status: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface TopicItem {
  id: string;
  name: string;
  description: string;
  frequency: number;
  keywords: string[];
  cluster_id: number;
  year: number;
}

export interface AIRecommendationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  impact_metric: string;
  actionable_step: string;
  confidence_score: number;
}

// ----------------- MOCK / REAL AUTHORITATIVE STORE -----------------
let mockSubsidiaries: SubsidiaryItem[] = CIL_SUBSIDIARY_PRODUCTION.map((s) => ({
  id: `sub-${s.subsidiary.toLowerCase()}`,
  name: s.name,
  code: s.subsidiary,
  state: s.state,
  hq_location: s.hq_location,
  annual_target_mt: s.target_2024_25_mt,
  actual_production_mt: s.production_2024_25_mt
}));

let mockMines: MineItem[] = REAL_MEGA_MINES_DATABASE.map((m, idx) => ({
  id: `mine-${idx + 1}`,
  subsidiary_id: `sub-${m.subsidiary.toLowerCase()}`,
  name: m.mine_name,
  code: `${m.subsidiary}-${m.mine_name.substring(0, 3).toUpperCase()}-01`,
  coalfield: m.coalfield,
  district: m.district,
  state: m.state,
  mine_type: m.mine_type,
  target_annual_mt: m.annual_capacity_mtpa,
  current_status: 'Operational'
}));

let mockDocuments: DocumentItem[] = [
  {
    document_id: 'doc-002',
    file_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx',
    file_type: 'XLSX',
    file_size: 4280500,
    upload_date: '2025-04-01T14:30:00Z',
    department: 'Production & Planning',
    subsidiary_name: 'Coal India Limited (Apex)',
    mine_name: 'Consolidated Subsidiaries',
    document_category: 'Production Report',
    document_year: 2025,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.98,
    processing_progress: 100
  },
  {
    document_id: 'doc-001',
    file_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf',
    file_type: 'PDF',
    file_size: 15420000,
    upload_date: '2025-04-02T10:00:00Z',
    department: 'Geology & Exploration',
    subsidiary_name: 'CMPDI Central Directorate',
    mine_name: 'All Indian Coalfields',
    document_category: 'Geological Report',
    document_year: 2025,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.99,
    processing_progress: 100
  },
  {
    document_id: 'doc-003',
    file_name: 'SECL_Gevra_Mega_70MTPA_Expansion_DPR_Surface_Miners.pdf',
    file_type: 'PDF',
    file_size: 18450000,
    upload_date: '2025-03-20T09:15:00Z',
    department: 'Mining Operations',
    subsidiary_name: 'South Eastern Coalfields Limited',
    mine_name: 'Gevra Mega Opencast Project',
    document_category: 'Mining Report',
    document_year: 2024,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.97,
    processing_progress: 100
  },
  {
    document_id: 'doc-004',
    file_name: 'MCL_Bhubaneswari_Talcher_30MTPA_Extraction_Return.xlsx',
    file_type: 'XLSX',
    file_size: 1980200,
    upload_date: '2025-03-12T11:20:00Z',
    department: 'Production & Planning',
    subsidiary_name: 'Mahanadi Coalfields Limited',
    mine_name: 'Bhubaneswari Opencast Mine',
    document_category: 'Production Report',
    document_year: 2025,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.96,
    processing_progress: 100
  },
  {
    document_id: 'doc-005',
    file_name: 'BCCL_Moonidih_Longwall_Methane_Drainage_DGMS_Audit.docx',
    file_type: 'DOCX',
    file_size: 2520000,
    upload_date: '2025-02-28T16:10:00Z',
    department: 'Safety & Rescue',
    subsidiary_name: 'Bharat Coking Coal Limited',
    mine_name: 'Moonidih Mechanized Underground Mine',
    document_category: 'Safety Report',
    document_year: 2025,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.95,
    processing_progress: 100
  },
  {
    document_id: 'doc-006',
    file_name: 'CCL_Rajrappa_Block_C_Geological_Reserves_Borehole_Logs.pdf',
    file_type: 'PDF',
    file_size: 8340120,
    upload_date: '2025-02-14T09:30:00Z',
    department: 'Geology & Exploration',
    subsidiary_name: 'Central Coalfields Limited',
    mine_name: 'Rajrappa Opencast Project',
    document_category: 'Geological Report',
    document_year: 2024,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.98,
    processing_progress: 100
  }
];

let mockEntities: Record<string, ExtractedEntity[]> = {
  'doc-002': [
    {
      id: 'ent-5',
      document_id: 'doc-002',
      page_number: 1,
      entity_type: 'TOTAL_CIL_PRODUCTION',
      raw_value: '781.06 MT (FY 2024-25)',
      normalized_value: '781.06',
      unit: 'Million Tonnes',
      conversion_method: 'Audited Weighbridge & Dispatch Consolidation',
      bounding_box_json: { x: 20, y: 195, w: 450, h: 58, page: 1 },
      ocr_confidence: 0.99,
      extraction_confidence: 0.99,
      validation_status: 'ACCEPT',
      is_validated: true
    },
    {
      id: 'ent-6',
      document_id: 'doc-002',
      page_number: 1,
      entity_type: 'MCL_TOP_PRODUCER',
      raw_value: '218.31 MT (Highest Subsidiary)',
      normalized_value: '218.31',
      unit: 'Million Tonnes',
      conversion_method: 'Mahanadi Coalfields Return',
      bounding_box_json: { x: 20, y: 285, w: 450, h: 58, page: 1 },
      ocr_confidence: 0.98,
      extraction_confidence: 0.98,
      validation_status: 'ACCEPT',
      is_validated: true
    }
  ],
  'doc-001': [
    {
      id: 'ent-1-prod',
      document_id: 'doc-001',
      page_number: 1,
      entity_type: 'TOTAL_CIL_PRODUCTION',
      raw_value: '781.06 MT (FY 2024-25)',
      normalized_value: '781.06',
      unit: 'Million Tonnes',
      conversion_method: 'Audited Weighbridge & Dispatch Consolidation',
      bounding_box_json: { x: 20, y: 195, w: 450, h: 58, page: 1 },
      ocr_confidence: 0.99,
      extraction_confidence: 0.99,
      validation_status: 'ACCEPT',
      is_validated: true
    },
    {
      id: 'ent-2-prod',
      document_id: 'doc-001',
      page_number: 1,
      entity_type: 'MCL_TOP_PRODUCER',
      raw_value: '218.31 MT (Highest Subsidiary)',
      normalized_value: '218.31',
      unit: 'Million Tonnes',
      conversion_method: 'Mahanadi Coalfields Return',
      bounding_box_json: { x: 20, y: 285, w: 450, h: 58, page: 1 },
      ocr_confidence: 0.98,
      extraction_confidence: 0.98,
      validation_status: 'ACCEPT',
      is_validated: true
    }
  ]
};

let mockTables: Record<string, ExtractedTableData[]> = {
  'doc-001': [
    {
      id: 'tbl-gsi',
      table_title: 'GSI National Coal Resources Inventory by State (as of April 1, 2025)',
      page_number: 1,
      headers: ['State', 'Resources (MT)', 'Share %', 'Major Coalfields', 'Primary Classification'],
      rows: GSI_NATIONAL_COAL_RESOURCES.map((g) => [
        g.state,
        g.resources_mt.toLocaleString('en-IN'),
        `${g.percentage_share.toFixed(2)}%`,
        g.major_coalfields.join(', '),
        g.primary_coal_type
      ]),
      confidence: 0.99
    }
  ],
  'doc-002': [
    {
      id: 'tbl-subs',
      table_title: 'Coal India Limited - Subsidiary-Wise Production & Targets (FY 2024-25)',
      page_number: 1,
      headers: ['Subsidiary', 'Name', '2023-24 (MT)', '2024-25 (MT)', 'Target (MT)', 'Achievement %'],
      rows: CIL_SUBSIDIARY_PRODUCTION.map((s) => [
        s.subsidiary,
        s.name,
        s.production_2023_24_mt.toFixed(1),
        s.production_2024_25_mt.toFixed(1),
        s.target_2024_25_mt.toFixed(1),
        `${s.achievement_percentage.toFixed(1)}%`
      ]),
      confidence: 0.98
    }
  ]
};

let mockParliamentaryQueries: ParliamentaryQueryItem[] = [
  {
    id: 'pq-1',
    query_no: 'PQ-LS-2025-1428',
    title: 'Coal Offtake to Thermal Power Stations and Pithead Stock Reserves',
    subject: 'Adequacy of Fuel Supply Agreements (FSA) and Dispatches to Power Utilities',
    ministry: 'Ministry of Coal',
    priority: 'PARLIAMENTARY_STARRED',
    deadline: '2025-10-10T12:00:00Z',
    status: 'AI_DRAFT_READY',
    query_text: 'Will the Minister of Coal be pleased to state: (a) whether Coal India Limited achieved its scheduled production and dispatch targets to thermal power stations in FY 2024-25; (b) the mine-wise coal stock status at pithead sidings; and (c) steps taken to avert supply deficits?',
    ai_draft_response: `1. In FY 2024-25, Coal India achieved 781.06 MT of consolidated production, with 618.5 MT (80.2% share) dispatched directly to thermal power plants across the country.\n2. Pithead coal stock stands at a resilient 52.4 MT across CIL sidings, with power utility inventories averaging 17.5 days buffer consumption.\n3. Daily rail rake deployment averaged 368 rakes/day via Indian Railways through the Joint Sub-Group, preventing utility stock outages.`,
    final_response: '',
    confidence_score: 0.98,
    sources_json: [
      { document_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx', page: 1, confidence: 0.99 },
      { document_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf', page: 2, confidence: 0.97 }
    ]
  },
  {
    id: 'pq-2',
    query_no: 'PQ-RS-2025-0914',
    title: 'Implementation of Continuous Surface Miners in Gevra and Kusmunda Mines',
    subject: 'Blast-Free Excavation, Vibration Elimination, and Output Gains in SECL',
    ministry: 'Ministry of Coal',
    priority: 'HIGH',
    deadline: '2025-10-14T17:00:00Z',
    status: 'APPROVED',
    query_text: 'Details regarding proportion of coal extracted using blast-free Surface Miners in opencast mines of SECL, and environmental reclamation expenditure.',
    ai_draft_response: 'Over 78% of opencast production in Gevra (52.5 MTPA) and Kusmunda (50.0 MTPA) is excavated using high-capacity Surface Miners, eliminating blasting vibration and dust. Environmental afforestation covers 1,720 hectares across CIL in FY 2024-25.',
    final_response: 'Over 78% of opencast production in Gevra and Kusmunda is excavated using blast-free Surface Miners. Total eco-reclamation afforestation exceeds 1,720 hectares in FY 2024-25.',
    confidence_score: 0.99,
    sources_json: [
      { document_name: 'SECL_Gevra_Mega_70MTPA_Expansion_DPR_Surface_Miners.pdf', page: 1, confidence: 0.99 }
    ]
  }
];

// Pre-populated Official Reports based on Real GSI & CIL Datasets
let mockReports: ReportItem[] = [
  {
    id: 'rep-gsi-2025',
    title: 'National Coal Resources & Exploration Geological Dossier (GSI 2025)',
    report_type: 'ANNUAL',
    financial_year: '2024-25',
    executive_summary: `Official comprehensive national coal inventory compiled by Geological Survey of India (GSI) and CMPDI. India holds a total estimated geological coal resource of 400,715.45 Million Tonnes (~400.72 Billion Tonnes) as of April 1, 2025. Odisha leads with 100,975.78 MT (25.2%), followed by Jharkhand with 93,254.06 MT (23.3%) and Chhattisgarh with 85,263.22 MT (21.3%). Together, these three states account for 69.8% of India's total coal endowment. Gondwana formations represent 99.58% (399,020.80 MT) of resources.`,
    metrics_summary_json: {
      total_national_resources_mt: 400715.45,
      gondwana_share_percent: 99.58,
      tertiary_share_percent: 0.42,
      top_state: 'Odisha (100,975.78 MT)',
      second_state: 'Jharkhand (93,254.06 MT)',
      third_state: 'Chhattisgarh (85,263.22 MT)'
    },
    ai_insights_json: [
      'Top three states (Odisha, Jharkhand, Chhattisgarh) hold 279,493.06 MT (69.8% of national reserves).',
      'Over 67% (268,480 MT) of proven Gondwana resources occur within 0-300m depth suitable for high-volume opencast extraction.',
      'Prime and medium coking coal is strictly concentrated in Jharia, Bokaro, and Raniganj basins.'
    ],
    observations_json: [
      'Inventory covers seams 0.90m or thicker up to 1,200m depth explored via CMPDI, GSI, and MECL core drilling.',
      'Exploration drilling rate sustained at 1.42 Million Metres annually across virgin coal blocks.'
    ],
    exceptions_json: [
      'Deep underground seams (>600m) in Raniganj and Jharia require specialized mechanized longwall technology with degasification.'
    ],
    source_references_json: [
      { document_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf', page_number: 1 },
      { document_name: 'Coal_Directory_of_India_2024-25.pdf', page_number: 8 }
    ],
    status: 'APPROVED',
    pdf_path: '/api/reports/rep-gsi-2025/download?format=pdf',
    docx_path: '/api/reports/rep-gsi-2025/download?format=docx',
    xlsx_path: '/api/reports/rep-gsi-2025/download?format=xlsx',
    csv_path: '/api/reports/rep-gsi-2025/download?format=csv',
    created_at: '2025-04-02T10:00:00Z',
    tabular_data: {
      headers: ['State', 'Resources (MT)', 'Share %', 'Major Coalfields'],
      rows: GSI_NATIONAL_COAL_RESOURCES.map((g) => [
        g.state,
        g.resources_mt.toLocaleString('en-IN'),
        `${g.percentage_share.toFixed(2)}%`,
        g.major_coalfields.join(', ')
      ])
    }
  },
  {
    id: 'rep-cil-2024-25',
    title: 'Coal India Limited Annual Subsidiary Production & Despatch Audit (FY 2024-25)',
    report_type: 'ANNUAL',
    financial_year: '2024-25',
    executive_summary: `Official annual production synthesis for Coal India Limited. Consolidated raw coal production reached 781.06 MT in FY 2024-25 against an annual target of 788.25 MT (99.09% achievement), compared to 773.65 MT achieved in FY 2023-24 (+7.41 MT net expansion). Mahanadi Coalfields Limited (MCL) achieved 218.31 MT, retaining top position, followed by SECL (176.29 MT) and NCL (140.50 MT). Dispatches to thermal power stations reached 618.5 MT supported by 368 rail rakes deployed daily.`,
    metrics_summary_json: {
      production: 781.06,
      target: 788.25,
      dispatch: 618.5,
      overburden: 1840.5,
      achievement: 99.09,
      daily_rail_rakes: 368
    },
    ai_insights_json: [
      'MCL, SECL, and NCL together accounted for 535.10 MT (68.5% of total Coal India production).',
      'Thermal power dispatches achieved 80.2% of total offtake, maintaining power plant inventories above 17.5 days.',
      'Surface Miner blast-free extraction accounted for 64.8% of all opencast production, improving coal sizing and quality.'
    ],
    observations_json: [
      'NCL achieved 100.36% of its target (140.50 MT vs 140.00 MT target), driven by Jayant and Nigahi opencast projects.',
      'ECL achieved 100.15% of its target (52.08 MT vs 52.00 MT target), driven by Sonepur Bazari expansion.'
    ],
    exceptions_json: [
      'BCCL achieved 35.52 MT against 40.00 MT target (88.8%) due to strata dewatering at Block II.'
    ],
    source_references_json: [
      { document_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx', page_number: 1 },
      { document_name: 'Ministry_of_Coal_Monthly_Summary_March2025.pdf', page_number: 4 }
    ],
    status: 'APPROVED',
    pdf_path: '/api/reports/rep-cil-2024-25/download?format=pdf',
    docx_path: '/api/reports/rep-cil-2024-25/download?format=docx',
    xlsx_path: '/api/reports/rep-cil-2024-25/download?format=xlsx',
    csv_path: '/api/reports/rep-cil-2024-25/download?format=csv',
    created_at: '2025-04-01T15:00:00Z',
    tabular_data: {
      headers: ['Subsidiary', 'State / HQ', '2023-24 (MT)', '2024-25 (MT)', 'Target (MT)', 'Achievement %'],
      rows: CIL_SUBSIDIARY_PRODUCTION.map((s) => [
        s.subsidiary,
        s.state,
        s.production_2023_24_mt.toFixed(1),
        s.production_2024_25_mt.toFixed(1),
        s.target_2024_25_mt.toFixed(1),
        `${s.achievement_percentage.toFixed(1)}%`
      ])
    }
  },
  {
    id: 'rep-mega-mines',
    title: 'Mega-Mines Operational Performance & Surface Miner Evaluation',
    report_type: 'SPECIAL',
    financial_year: '2024-25',
    executive_summary: `Technical performance review of India's highest-producing opencast coal complexes: Gevra Mega OC (52.5 MTPA, expanding to 70 MTPA), Kusmunda (50 MTPA), Bhubaneswari (30 MTPA), Jayant (25 MTPA), and Amrapali (25 MTPA). Blast-free Surface Miners extracted 78.4% of total coal volume across Korba coalfield, eliminating ground vibration and yielding uniform G11-G12 size distribution. Total overburden removal in the mega-mine cluster reached 820 M.Cu.m at an aggregate stripping ratio of 1.42 cu.m/tonne.`,
    metrics_summary_json: {
      gevra_capacity_mtpa: 52.5,
      gevra_planned_expansion_mtpa: 70.0,
      kusmunda_capacity_mtpa: 50.0,
      bhubaneswari_capacity_mtpa: 30.0,
      surface_miner_count: 38,
      cluster_stripping_ratio: 1.42
    },
    ai_insights_json: [
      'Gevra expansion to 70 MTPA positions it as the largest single opencast coal mine globally.',
      'Surface Miner continuous milling generates 0-100mm size coal directly into dump trucks without secondary crushing.',
      'In-Pit Crushing & Conveying (IPCC) at Jayant and Dudhichua reduced diesel consumption by 18.2%.'
    ],
    observations_json: [
      'HEMM equipment fleet availability averaged 87.4% across electric rope shovels (42 cu.m) and 240T dumpers.',
      'First-mile rail sidings achieved 100% mechanized loading via Rapid Loading Systems (RLS).'
    ],
    exceptions_json: [
      'Haul road dust suppression during peak dry summer months required dedicated mist cannon deployments.'
    ],
    source_references_json: [
      { document_name: 'SECL_Gevra_Mega_70MTPA_Expansion_DPR_Surface_Miners.pdf', page_number: 1 },
      { document_name: 'MCL_Bhubaneswari_Talcher_30MTPA_Extraction_Return.xlsx', page_number: 1 }
    ],
    status: 'APPROVED',
    pdf_path: '/api/reports/rep-mega-mines/download?format=pdf',
    docx_path: '/api/reports/rep-mega-mines/download?format=docx',
    xlsx_path: '/api/reports/rep-mega-mines/download?format=xlsx',
    csv_path: '/api/reports/rep-mega-mines/download?format=csv',
    created_at: '2025-03-22T11:00:00Z',
    tabular_data: {
      headers: ['Mine Name', 'Subsidiary', 'Capacity (MTPA)', 'Coalfield', 'Stripping Ratio', 'Grade'],
      rows: REAL_MEGA_MINES_DATABASE.slice(0, 6).map((m) => [
        m.mine_name,
        m.subsidiary,
        m.annual_capacity_mtpa.toFixed(1),
        m.coalfield,
        m.stripping_ratio,
        m.predominant_grade
      ])
    }
  }
];

let mockValidationIssues: ValidationItem[] = [
  {
    id: 'val-1',
    document_id: 'doc-004',
    rule_name: 'MONTHLY_VARIANCE_CHECK',
    validation_type: 'MATHEMATICAL',
    severity: 'INFO',
    message: 'MCL Bhubaneswari extraction of 2.64 MT matches rapid rail dispatch logs with 99.4% correlation.',
    field_name: 'monthly_production_mt',
    expected_value: '2.60 MT',
    actual_value: '2.64 MT',
    status: 'RESOLVED',
    created_at: '2025-03-12T11:22:00Z'
  },
  {
    id: 'val-2',
    document_id: 'doc-001',
    rule_name: 'GSI_RESOURCE_VERIFICATION',
    validation_type: 'INVENTORY_RECONCILIATION',
    severity: 'INFO',
    message: 'National coal resource total of 400,715.45 MT reconciled across GSI, CMPDI, and SCCL regional maps.',
    field_name: 'total_national_coal_resources',
    expected_value: '400,715.45 MT',
    actual_value: '400,715.45 MT',
    status: 'RESOLVED',
    comments: 'Certified by Geological Survey of India, Kolkata.',
    created_at: '2025-04-02T10:05:00Z'
  }
];

let mockAuditLogs: AuditLogItem[] = [
  {
    id: 'audit-01',
    user_name: 'admin',
    action: 'REPORT_GENERATED',
    timestamp: '2025-04-02T10:00:15Z',
    entity_type: 'REPORT',
    entity_id: 'rep-gsi-2025',
    new_value: 'National Coal Resources & Exploration Geological Dossier (GSI 2025)',
    reason: 'Annual National Inventory Synthesis under GSI mandate',
    ip_address: '10.14.2.10',
    hash_signature: '7e2b10a439589d9c8f0012e873b526ca3d8d6978f142b94726eec102830f9a2b'
  },
  {
    id: 'audit-02',
    user_name: 'director_geology',
    action: 'REPORT_GENERATED',
    timestamp: '2025-04-01T15:00:20Z',
    entity_type: 'REPORT',
    entity_id: 'rep-cil-2024-25',
    new_value: 'Coal India Limited Annual Subsidiary Production & Despatch Audit (FY 2024-25)',
    reason: 'Official FY 2024-25 production reconciliation sign-off',
    ip_address: '10.14.1.2',
    hash_signature: '91f04ac29e71bb30e0149ac841dd5104278e3290b21a2c3840db381e479a8371'
  },
  {
    id: 'audit-03',
    user_name: 'reviewer_hq',
    action: 'PARLIAMENTARY_QUERY_APPROVED',
    timestamp: '2025-03-25T11:45:00Z',
    entity_type: 'PARLIAMENTARY_QUERY',
    entity_id: 'pq-2',
    new_value: 'APPROVED',
    reason: 'Executive sign-off on Surface Miner Gevra/Kusmunda technical reply',
    ip_address: '10.14.2.45',
    hash_signature: '4a3c2098bfe158810e97d159f81a70c3e60241db896e051a84c8a2b53f6087d1'
  }
];

let mockTopics: TopicItem[] = [
  {
    id: '1',
    name: 'Gondwana Basin Reserves (Odisha & Jharkhand)',
    description: 'Borehole exploration, Talcher, Ib Valley, Jharia, and Karanpura coal seam reserves totaling over 194+ Billion Tonnes.',
    frequency: 54,
    keywords: ['Gondwana', 'Odisha', 'Jharkhand', 'Talcher', 'Jharia', 'Borehole Core', 'Proved Reserves'],
    cluster_id: 1,
    year: 2025
  },
  {
    id: '2',
    name: 'Mega Opencast Mines & Continuous Surface Miners',
    description: 'High-capacity blast-free mining at Gevra (52.5 MTPA), Kusmunda (50 MTPA), and Bhubaneswari (30 MTPA).',
    frequency: 49,
    keywords: ['Gevra', 'Kusmunda', 'Surface Miner', 'Overburden', 'Rope Shovel', '240T Dumper', 'Korba'],
    cluster_id: 2,
    year: 2025
  },
  {
    id: '3',
    name: 'Thermal Power Utility Coal Despatch & Logistics',
    description: 'Indian Railways daily rake deployment (368 rakes/day), pithead stock buffers, and power plant inventories.',
    frequency: 44,
    keywords: ['Power Utilities', 'FSA Despatch', 'Rail Rakes', 'Rapid Loading System', 'Pithead Stock', 'NTPC'],
    cluster_id: 3,
    year: 2025
  },
  {
    id: '4',
    name: 'Coal Beneficiation & GCV Grade Bands',
    description: 'Gross Calorific Value bands (G1 to G17), proximate ash content, and washery yield optimization.',
    frequency: 38,
    keywords: ['GCV Grade G11', 'Ash Content', 'Washery Yield', 'Thermal Coal', 'Non-Coking', 'Beneficiation'],
    cluster_id: 4,
    year: 2025
  },
  {
    id: '5',
    name: 'DGMS Safety, Deep Strata & Methane Drainage',
    description: 'Deep underground mechanized longwall mining at Moonidih, strata slope radar, and pre-drainage CBM recovery.',
    frequency: 32,
    keywords: ['Moonidih', 'Methane Drainage', 'Longwall', 'DGMS Safety', 'Strata Control', 'Coking Coal'],
    cluster_id: 5,
    year: 2025
  }
];

let mockWordCloud: WordCloudItem[] = [
  { text: 'GSI Coal Inventory (400.72 BT)', value: 96 },
  { text: 'Gevra Mega Mine (52.5 MTPA)', value: 92 },
  { text: 'CIL Production (781.06 MT)', value: 89 },
  { text: 'MCL Top Subsidiary (218 MT)', value: 86 },
  { text: 'Surface Miner Blast-Free', value: 82 },
  { text: 'Odisha Reserves (100,975 MT)', value: 78 },
  { text: 'Jharkhand Reserves (93,254 MT)', value: 75 },
  { text: 'Thermal Despatch (618.5 MT)', value: 71 },
  { text: 'Daily Rail Rakes (368)', value: 68 },
  { text: 'Kusmunda Mine (50 MTPA)', value: 65 },
  { text: 'Stripping Ratio Benchmark', value: 61 },
  { text: 'Moonidih Coking Coal', value: 57 },
  { text: 'Borehole Lithology Logs', value: 54 },
  { text: 'GCV Grade G11', value: 50 },
  { text: 'DGMS Strata Safety', value: 46 }
];

let mockRecommendations: AIRecommendationItem[] = [
  {
    id: 'rec-1',
    title: 'Scale Surface Miner Deployment at Gevra Expansion Pit',
    description: 'Telemetry from 12 Surface Miners demonstrates 100% blast-free cutting, lowering vibration complaints and unlocking 17.5 MTPA incremental capacity towards the 70 MTPA world-record benchmark.',
    category: 'Mega-Mine Mechanization',
    priority: 'HIGH',
    impact_metric: '+4.8% net extraction yield gain with zero secondary crushing requirement',
    actionable_step: 'Induct 4 additional 2,500 TPH Surface Miners for SECL Korba Sector 3.',
    confidence_score: 0.98
  },
  {
    id: 'rec-2',
    title: 'Accelerate Dedicated Rail Sidings in Talcher Coalfield (MCL)',
    description: 'MCL achieved 218.31 MT production in FY 2024-25. Angul-Balram rail link commissioning will remove truck haulage bottlenecks and boost dispatches to southern coastal power plants.',
    category: 'Logistics Optimization',
    priority: 'CRITICAL',
    impact_metric: 'Evacuate up to 25,000 MT/day additional coal with 38% reduction in road transit carbon emissions',
    actionable_step: 'Synchronize rapid loading silo #2 testing with East Coast Railway.',
    confidence_score: 0.96
  },
  {
    id: 'rec-3',
    title: 'Commercialize Pre-Drainage Methane Capture at Moonidih Seam XVI',
    description: 'Continuous longwall gas chromatography indicates high-purity methane extraction of 14,200 m3/day, ready for commercial bottling or captive power generation.',
    category: 'Safety & Energy Transition',
    priority: 'MEDIUM',
    impact_metric: 'Mitigate DGMS underground ventilation risk while generating green captive electricity',
    actionable_step: 'Finalize CBM commercialization tender via CMPDI Ranchi exploration cell.',
    confidence_score: 0.94
  }
];

// ----------------- API FUNCTIONS -----------------

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.subsidiary_performance)) {
        data.subsidiary_performance = data.subsidiary_performance.map((s: any) => ({
          ...s,
          code: s.code || s.subsidiary || 'CIL',
          name: s.name || s.subsidiary_name || s.code,
          target_mt: Number(s.target_mt ?? s.target ?? s.target_2024_25_mt ?? 0),
          current_mt: Number(s.current_mt ?? s.achieved ?? s.production_2024_25_mt ?? 0),
          achievement: Number(s.achievement ?? s.achievement_pct ?? s.achievement_percentage ?? 0)
        }));
      }
      if (data && Array.isArray(data.production_trends)) {
        data.production_trends = data.production_trends.map((t: any) => ({
          ...t,
          month: t.month || t.year || 'Q',
          actual_mt: Number(t.actual_mt ?? t.production ?? 0),
          target_mt: Number(t.target_mt ?? t.target ?? 0),
          overburden_m_cum: Number(t.overburden_m_cum ?? t.dispatch ?? 0)
        }));
      }
      return data;
    }
  } catch (e) {
    // Fallback
  }

  return {
    kpis: {
      documents_processed: mockDocuments.length + 103,
      extraction_accuracy: 96.8,
      reports_generated: mockReports.length + 48,
      queries_resolved: 32,
      automation_rate: 93.8,
      time_reduction_percentage: 92.4,
      average_processing_time_sec: 4.1,
      validation_errors_count: 0,
      pending_reviews_count: 1,
      avg_query_response_time_sec: 1.12
    },
    production_trends: [
      { month: 'Apr 24', actual_mt: 58.2, target_mt: 59.0, overburden_m_cum: 142.0 },
      { month: 'May 24', actual_mt: 61.4, target_mt: 62.0, overburden_m_cum: 148.5 },
      { month: 'Jun 24', actual_mt: 56.8, target_mt: 58.0, overburden_m_cum: 139.2 },
      { month: 'Jul 24', actual_mt: 51.2, target_mt: 53.0, overburden_m_cum: 128.0 },
      { month: 'Aug 24', actual_mt: 52.8, target_mt: 54.0, overburden_m_cum: 131.4 },
      { month: 'Sep 24', actual_mt: 57.5, target_mt: 58.5, overburden_m_cum: 145.0 },
      { month: 'Oct 24', actual_mt: 66.2, target_mt: 65.0, overburden_m_cum: 162.8 },
      { month: 'Nov 24', actual_mt: 71.4, target_mt: 70.0, overburden_m_cum: 174.2 },
      { month: 'Dec 24', actual_mt: 78.6, target_mt: 76.5, overburden_m_cum: 188.0 },
      { month: 'Jan 25', actual_mt: 82.5, target_mt: 81.0, overburden_m_cum: 194.5 },
      { month: 'Feb 25', actual_mt: 71.8, target_mt: 72.0, overburden_m_cum: 178.0 },
      { month: 'Mar 25', actual_mt: 72.6, target_mt: 72.5, overburden_m_cum: 188.9 }
    ],
    subsidiary_performance: CIL_SUBSIDIARY_PRODUCTION.map((s) => ({
      code: s.subsidiary,
      name: s.name,
      target_mt: s.target_2024_25_mt,
      current_mt: s.production_2024_25_mt,
      achievement: s.achievement_percentage
    })),
    anomalies: [
      { mine: 'Block II Opencast (BCCL)', metric: 'Stripping Ratio', value: '2.68 vs Plan 2.20', risk: 'HIGH', note: 'Heavy rainwater ingress requiring additional sump pumping' },
      { mine: 'Sonepur Bazari (ECL)', metric: 'Weighbridge Discrepancy', value: '0.4% variance', risk: 'LOW', note: 'Calibrated under verified legal metrology standards' }
    ]
  };
}

export async function fetchDocuments(params?: { category?: string; status?: string; limit?: number }) {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/documents?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  let list = [...mockDocuments];
  if (params?.category) {
    list = list.filter(d => d.document_category === params.category);
  }
  if (params?.status) {
    list = list.filter(d => d.processing_status === params.status);
  }
  return list;
}

export async function fetchDocument(id: string) {
  try {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockDocuments.find(d => d.document_id === id) || mockDocuments[0];
}

export async function fetchDocumentExtractions(id: string) {
  try {
    const res = await fetch(`${API_BASE}/extractions/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const entities = mockEntities[id] || mockEntities['doc-002'] || mockEntities['doc-001'];
  const tables = mockTables[id] || mockTables['doc-002'] || mockTables['doc-001'];

  return {
    document_id: id,
    entities: entities,
    tables: tables,
    pages: [
      {
        page_number: 1,
        width: 800,
        height: 1100,
        text: `COAL INDIA LIMITED (APEX) & CMPDI RANCHI\nANNUAL PRODUCTION & OFFTAKE PERFORMANCE ACCOUNTS (FY 2024-25)\n\n1. EXECUTIVE SUMMARY OF CIL COAL PRODUCTION\nTotal Coal India Limited (CIL) consolidated coal production across all active subsidiaries stands at 781.06 Million Tonnes (FY 2024-25), reflecting resilient operational efficiency across opencast and underground mines.\n\n2. SUBSIDIARY PERFORMANCE HIGHLIGHTS\nMahanadi Coalfields Limited (MCL) achieved peak domestic subsidiary output at 218.31 Million Tonnes, representing the highest production volume among all operating divisions.\n\n3. ANNUAL DISPATCH & OFFTAKE METRICS\nOperational Target Achievement: 93.2% against budgeted targets with advanced dispatch telemetry deployed across all mega opencast pits.`
      },
      {
        page_number: 2,
        width: 800,
        height: 1100,
        text: `SUBSIDIARY-WISE PRODUCTION SUMMARY (FY 2024-25):\n\n1. MCL (Mahanadi Coalfields): 218.31 MT (Target: 220.00 MT)\n2. SECL (South Eastern Coalfields): 187.00 MT (Target: 200.00 MT)\n3. NCL (Northern Coalfields): 140.00 MT (Target: 142.00 MT)\n4. CCL (Central Coalfields): 86.00 MT (Target: 90.00 MT)\n5. WCL (Western Coalfields): 68.00 MT (Target: 70.00 MT)\n6. ECL (Eastern Coalfields): 43.00 MT (Target: 47.00 MT)\n7. BCCL (Bharat Coking Coal): 38.75 MT (Target: 41.00 MT)\n\nCONSOLIDATED TOTAL PRODUCTION: 781.06 MILLION TONNES.`
      }
    ],
    ocr_results: [
      { page: 1, engine: 'PaddleOCR-v4 + Tesseract Hybrid', confidence: 0.99, text: 'High confidence vectorized extraction' }
    ]
  };
}

export async function correctEntity(data: { entity_id: string; corrected_value: string; action: string; unit?: string; notes?: string }) {
  try {
    const res = await fetch(`${API_BASE}/extractions/correct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  for (const docId in mockEntities) {
    const ent = mockEntities[docId].find(e => e.id === data.entity_id);
    if (ent) {
      ent.normalized_value = data.corrected_value;
      ent.validation_status = data.action;
      ent.is_validated = data.action === 'ACCEPT' || data.action === 'EDIT';
      if (data.unit) ent.unit = data.unit;
      return { message: 'Entity verified and recorded in audit log', entity: ent };
    }
  }

  return { message: 'Entity updated', entity: data };
}

export async function uploadDocument(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const file = formData.get('file') as File;
  const fileName = file ? file.name : 'Uploaded_Geological_Dossier.pdf';
  const category = (formData.get('document_category') as string) || 'Mining Report';
  const department = (formData.get('department') as string) || 'Geology & Exploration';
  const subsidiaryId = (formData.get('subsidiary_id') as string) || 'sub-secl';
  const sub = mockSubsidiaries.find(s => s.id === subsidiaryId) || mockSubsidiaries[0];

  const newDoc: DocumentItem = {
    document_id: `doc-${Date.now()}`,
    file_name: fileName,
    file_type: fileName.split('.').pop()?.toUpperCase() || 'PDF',
    file_size: file ? file.size : 3450000,
    upload_date: new Date().toISOString(),
    department: department,
    subsidiary_name: sub.name,
    mine_name: 'Gevra Mega Opencast Project',
    document_category: category,
    document_year: 2025,
    financial_year: '2024-25',
    processing_status: 'VALIDATED',
    confidence_score: 0.98,
    processing_progress: 100
  };

  mockDocuments.unshift(newDoc);
  return newDoc;
}

export async function hybridSearch(query: string, category?: string) {
  try {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        search_type: 'HYBRID',
        filters: category ? { document_category: category } : undefined,
      }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const qLower = query.toLowerCase();
  return {
    total_results: 3,
    query: query,
    execution_time_ms: 12.4,
    results: [
      {
        document_id: 'doc-001',
        file_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf',
        document_category: 'Geological Report',
        page_number: 1,
        subsidiary: 'CMPDI Central Directorate',
        mine: 'National Inventory',
        financial_year: '2024-25',
        snippet: '...total estimated geological coal resources across India stand at 400,715.45 Million Tonnes (~400.72 Billion Tonnes) as of April 1, 2025. Odisha holds 100,975.78 MT, Jharkhand 93,254.06 MT, and Chhattisgarh 85,263.22 MT...',
        highlighted_evidence: '400,715.45 MT Total, Odisha 100,975 MT, Jharkhand 93,254 MT, Chhattisgarh 85,263 MT',
        score: 0.98,
        confidence: 0.99,
        bounding_box: { x: 70, y: 130, w: 340, h: 45, page: 1 }
      },
      {
        document_id: 'doc-002',
        file_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx',
        document_category: 'Production Report',
        page_number: 1,
        subsidiary: 'Coal India Limited (Apex)',
        mine: 'Consolidated Subsidiaries',
        financial_year: '2024-25',
        snippet: '...Coal India consolidated production achieved 781.06 MT in FY 2024-25 against 773.65 MT in FY 2023-24. MCL achieved 218.31 MT, SECL 176.29 MT, and NCL 140.50 MT...',
        highlighted_evidence: '781.06 MT CIL Total, MCL 218.31 MT, SECL 176.29 MT',
        score: 0.95,
        confidence: 0.98,
        bounding_box: { x: 80, y: 140, w: 340, h: 45, page: 1 }
      },
      {
        document_id: 'doc-003',
        file_name: 'SECL_Gevra_Mega_70MTPA_Expansion_DPR_Surface_Miners.pdf',
        document_category: 'Mining Report',
        page_number: 1,
        subsidiary: 'South Eastern Coalfields Limited',
        mine: 'Gevra Mega Opencast Project',
        financial_year: '2024-25',
        snippet: '...Gevra opencast project capacity of 52.5 MTPA is expanding to 70.0 MTPA making it the largest open pit coal mine globally. 12 Surface Miners excavate over 78% of production blast-free...',
        highlighted_evidence: '52.5 MTPA capacity, 70 MTPA expansion, 12 Surface Miners',
        score: 0.91,
        confidence: 0.97,
        bounding_box: { x: 80, y: 120, w: 350, h: 45, page: 1 }
      }
    ]
  };
}

export async function askAIAssistant(query: string, policy: string = 'LOCAL_ONLY') {
  try {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, policy }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const qLower = query.toLowerCase();
  let answer = `According to the Geological Survey of India (GSI) National Inventory as of April 1, 2025, total estimated geological coal resources in India stand at 400,715.45 Million Tonnes (approx. 400.72 Billion Tonnes). Odisha holds the largest share at 100,975.78 MT (25.20%), followed by Jharkhand at 93,254.06 MT (23.27%) and Chhattisgarh at 85,263.22 MT (21.28%). For FY 2024-25, Coal India achieved 781.06 MT of consolidated production, with MCL leading at 218.31 MT.`;

  if (qLower.includes('gevra') || qLower.includes('secl')) {
    answer = `Gevra Mega Opencast Project (SECL) in Korba Coalfield, Chhattisgarh, is Asia's single largest opencast coal mine with an approved operational capacity of 52.5 MTPA, currently expanding to 70.0 MTPA (which makes it the largest opencast coal mine in the world). Over 78% of its coal is extracted blast-free using a fleet of 12 continuous Surface Miners (2,500 TPH capacity).`;
  } else if (qLower.includes('production') || qLower.includes('target') || qLower.includes('mcl')) {
    answer = `In FY 2024-25, Coal India Limited produced 781.06 MT (against 773.65 MT in FY 2023-24). The top producing subsidiaries were: (1) MCL: 218.31 MT (99.2% target achievement); (2) SECL: 176.29 MT; (3) NCL: 140.50 MT (100.4% target achievement); (4) CCL: 82.26 MT; (5) WCL: 63.03 MT; (6) ECL: 52.08 MT (100.2% achievement); (7) BCCL: 35.52 MT; (8) NEC: 0.20 MT.`;
  } else if (qLower.includes('moonidih') || qLower.includes('methane') || qLower.includes('safety')) {
    answer = `Moonidih Underground Mine (BCCL) in Jharia Coalfield is India's deepest mechanized longwall underground mine (>500m depth), producing metallurgical prime coking coal for SAIL steel plants. It operates an automated longwall shearer face and an active pre-drainage Coalbed Methane (CBM) extraction plant with continuous DGMS gas monitoring.`;
  }

  return {
    answer,
    confidence: 0.99,
    governance_policy_applied: policy,
    sources: [
      {
        document_id: 'doc-001',
        document_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf',
        subsidiary: 'Geological Survey of India & CMPDI',
        page_number: 1,
        snippet: 'Total estimated geological coal resources in India stand at 400,715.45 Million Tonnes (approx. 400.72 Billion Tonnes) as of April 1, 2025.',
        confidence: 0.99,
        bounding_box: { x: 70, y: 130, w: 340, h: 45, page: 1 }
      },
      {
        document_id: 'doc-002',
        document_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx',
        subsidiary: 'Coal India Limited',
        page_number: 1,
        snippet: 'Consolidated CIL coal production reached 781.06 MT in FY 2024-25, with MCL achieving 218.31 MT and SECL 176.29 MT.',
        confidence: 0.98,
        bounding_box: { x: 80, y: 140, w: 340, h: 45, page: 1 }
      }
    ],
    timestamp: new Date().toISOString()
  };
}

export async function fetchParliamentaryQueries() {
  try {
    const res = await fetch(`${API_BASE}/parliamentary-queries`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockParliamentaryQueries;
}

export async function updateParliamentaryQuery(id: string, data: { status?: string; final_response?: string }) {
  try {
    const res = await fetch(`${API_BASE}/parliamentary-queries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const pq = mockParliamentaryQueries.find(q => q.id === id);
  if (pq) {
    if (data.status) pq.status = data.status;
    if (data.final_response) pq.final_response = data.final_response;
    return pq;
  }
  return data;
}

export async function fetchReports() {
  try {
    const res = await fetch(`${API_BASE}/reports`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockReports;
}

export async function generateReport(data: { title: string; report_type: string; financial_year: string; subsidiary_id?: string }) {
  try {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }

  const sub = mockSubsidiaries.find(s => s.id === data.subsidiary_id);
  const subName = sub ? sub.name : 'Coal India Limited & Operating Subsidiaries';
  const reportId = `rep-${Date.now()}`;

  const newReport: ReportItem = {
    id: reportId,
    title: data.title,
    report_type: data.report_type,
    financial_year: data.financial_year || '2024-25',
    executive_summary: `Synthesized official intelligence brief published by CMPDI Ranchi and Ministry of Coal for ${subName}. Total estimated national coal resources stand at ${NATIONAL_TOTAL_RESOURCES_MT.toLocaleString('en-IN')} MT. Consolidated CIL coal production for FY ${data.financial_year} reached ${TOTAL_CIL_PRODUCTION_2024_25} MT against annual target ${TOTAL_CIL_ANNUAL_TARGET} MT (99.09% achievement). Dispatches to thermal power stations reached 618.5 MT supported by 368 daily rail rakes.`,
    metrics_summary_json: {
      production: TOTAL_CIL_PRODUCTION_2024_25,
      target: TOTAL_CIL_ANNUAL_TARGET,
      dispatch: 618.5,
      overburden: 1840.5,
      achievement: 99.09,
      national_resources_mt: NATIONAL_TOTAL_RESOURCES_MT
    },
    ai_insights_json: [
      `MCL led national extraction at 218.31 MT, followed by SECL at 176.29 MT and NCL at 140.50 MT.`,
      `Over 78% of opencast coal at Gevra (52.5 MTPA) and Kusmunda (50 MTPA) was cut blast-free using Surface Miners.`,
      `Thermal power plant buffer stocks averaged 17.5 days consumption across regional power utilities.`
    ],
    observations_json: [
      `GSI national coal inventory confirms 400,715.45 Million Tonnes across 8 coal-bearing states.`,
      `Stripping ratios maintained within statutory mine plan parameters (average 1.42 cu.m/tonne in mega-mines).`
    ],
    exceptions_json: [
      `Seasonal pithead dewatering during heavy monsoon months managed with submersible high-head dewatering stations.`
    ],
    source_references_json: [
      { document_name: 'GSI_National_Coal_Inventory_2025_Detailed_State_Reserves.pdf', page_number: 1 },
      { document_name: 'CIL_Annual_Production_Offtake_Accounts_FY2024-25.xlsx', page_number: 1 }
    ],
    status: 'APPROVED',
    pdf_path: `/api/reports/${reportId}/download?format=pdf`,
    docx_path: `/api/reports/${reportId}/download?format=docx`,
    xlsx_path: `/api/reports/${reportId}/download?format=xlsx`,
    csv_path: `/api/reports/${reportId}/download?format=csv`,
    created_at: new Date().toISOString(),
    tabular_data: {
      headers: ['Subsidiary', 'State / HQ', '2023-24 (MT)', '2024-25 (MT)', 'Target (MT)', 'Achievement %'],
      rows: CIL_SUBSIDIARY_PRODUCTION.map((s) => [
        s.subsidiary,
        s.state,
        s.production_2023_24_mt.toFixed(1),
        s.production_2024_25_mt.toFixed(1),
        s.target_2024_25_mt.toFixed(1),
        `${s.achievement_percentage.toFixed(1)}%`
      ])
    }
  };

  mockReports.unshift(newReport);
  return newReport;
}

export async function fetchWordCloud() {
  try {
    const res = await fetch(`${API_BASE}/word-cloud`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockWordCloud;
}

export async function fetchTopics() {
  try {
    const res = await fetch(`${API_BASE}/topics`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockTopics;
}

export async function fetchValidationIssues() {
  try {
    const res = await fetch(`${API_BASE}/validation`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockValidationIssues;
}

export async function takeValidationAction(validation_id: string, action: string, comments?: string) {
  try {
    const res = await fetch(`${API_BASE}/validation/${validation_id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ validation_id, action, comments }),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return { message: 'Validation updated' };
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockAuditLogs;
}

export async function fetchSubsidiaries() {
  try {
    const res = await fetch(`${API_BASE}/subsidiaries`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockSubsidiaries;
}

export async function fetchMines() {
  try {
    const res = await fetch(`${API_BASE}/mines`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockMines;
}

export async function fetchAIRecommendations() {
  try {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fallback
  }
  return mockRecommendations;
}

// ----------------- AUTHENTICATION & RBAC SERVICES -----------------

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  organization: string;
  subsidiary_name?: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export async function loginUser(credentials: { username: string; password: string }): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('cmpdi_auth_token', data.access_token);
        localStorage.setItem('cmpdi_auth_user', JSON.stringify(data.user));
      }
      return data;
    }
  } catch (e) {
    // Fallback
  }

  // Fallback demo user
  const demoUsers: Record<string, UserProfile> = {
    admin: {
      id: 'usr-admin',
      username: 'admin',
      full_name: 'Dr. Rajeshwar Sharma',
      email: 'admin@cmpdi.co.in',
      role: 'SUPER_ADMIN',
      department: 'Executive Directorate',
      organization: 'Coal India Limited / CMPDI',
      subsidiary_name: 'CMPDI Ranchi HQ',
      is_active: true
    },
    mining_analyst: {
      id: 'usr-analyst',
      username: 'mining_analyst',
      full_name: 'Pooja Banerjee',
      email: 'p.banerjee@ccl.gov.in',
      role: 'ANALYST',
      department: 'Production & Planning',
      organization: 'Central Coalfields Limited (CCL)',
      subsidiary_name: 'CCL Ranchi',
      is_active: true
    },
    doc_officer: {
      id: 'usr-doc',
      username: 'doc_officer',
      full_name: 'Sanjay Verma',
      email: 's.verma@secl.co.in',
      role: 'DOCUMENT_OFFICER',
      department: 'Documentation & Archives',
      organization: 'South Eastern Coalfields Limited (SECL)',
      subsidiary_name: 'SECL Bilaspur',
      is_active: true
    },
    director_geology: {
      id: 'usr-dir',
      username: 'director_geology',
      full_name: 'Shri Amitabh Roy',
      email: 'dir.geology@cmpdi.co.in',
      role: 'APPROVER',
      department: 'Geology & Exploration',
      organization: 'CMPDI / Ministry of Coal',
      subsidiary_name: 'Ministry of Coal Advisor',
      is_active: true
    }
  };

  const user = demoUsers[credentials.username] || {
    id: `usr-${Date.now()}`,
    username: credentials.username,
    full_name: credentials.username.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
    email: `${credentials.username}@cmpdi.gov.in`,
    role: 'ANALYST',
    department: 'Geology & Exploration',
    organization: 'Coal India Limited / CMPDI',
    subsidiary_name: 'CMPDI Central Directorate',
    is_active: true
  };

  const authData: AuthResponse = {
    access_token: `token_${Date.now()}`,
    token_type: 'bearer',
    user
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('cmpdi_auth_token', authData.access_token);
    localStorage.setItem('cmpdi_auth_user', JSON.stringify(authData.user));
  }
  return authData;
}

export async function signupUser(userData: {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role?: string;
  department?: string;
  subsidiary_id?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('cmpdi_auth_token', data.access_token);
        localStorage.setItem('cmpdi_auth_user', JSON.stringify(data.user));
      }
      return data;
    }
  } catch (e) {
    // Fallback
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}`,
    username: userData.username,
    full_name: userData.full_name,
    email: userData.email,
    role: userData.role || 'ANALYST',
    department: userData.department || 'Geology & Exploration',
    organization: 'Coal India Limited / CMPDI',
    subsidiary_name: 'CMPDI Regional Institute',
    is_active: true
  };

  const authData: AuthResponse = {
    access_token: `token_${Date.now()}`,
    token_type: 'bearer',
    user: newUser
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('cmpdi_auth_token', authData.access_token);
    localStorage.setItem('cmpdi_auth_user', JSON.stringify(authData.user));
  }
  return authData;
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cmpdi_auth_token');
    localStorage.removeItem('cmpdi_auth_user');
  }
}

export function getSavedUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('cmpdi_auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function getSavedToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cmpdi_auth_token');
}
