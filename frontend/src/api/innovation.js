import client from './client';

// ---------------------------------------------------------------------------
// Innovation Manager Dashboard API Adapter
//
// //   GET /api/scoring/{project_id}
//
// //   GET /api/commercialization/recommendations/{project_id}
//
// The backend contracts return different shapes from the UI's internal
// representation, so this file normalizes the API responses.
// ---------------------------------------------------------------------------

// Real data by default. Set VITE_USE_MOCK_INNOVATION=true to fall back to the
// bundled demo portfolio (offline demos only).
const USE_MOCK =
  (import.meta.env?.VITE_USE_MOCK_INNOVATION ?? 'false') === 'true';

const delay = (ms = 450) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Shared scoring model
// ---------------------------------------------------------------------------

const SCORE_WEIGHTS = {
  research_novelty: 0.30,
  patent_strength: 0.20,
  technology_maturity: 0.15,
  market_potential: 0.20,
  funding_relevance: 0.15,
};

const PIPELINE_STAGES = [
  'ideation',
  'evaluation',
  'productization',
  'licensing',
  'startup',
];

// ---------------------------------------------------------------------------
// Project catalog
//
// The current GET /scoring/{project_id} endpoint requires an
// integer project_id. The existing mock portfolio uses proj_001,
// proj_002, etc.
//
// This catalog bridges the current dashboard data to the backend's integer
// project IDs.
// ---------------------------------------------------------------------------

const PROJECT_CATALOG = [
  {
    project_id: 1,
    ui_project_id: 'proj_001',
    title: 'Adaptive Battery Thermal Management System',
    domain: 'Energy / DeepTech',
    stage: 'evaluation',
  },
  {
    project_id: 2,
    ui_project_id: 'proj_002',
    title: 'Federated Learning Framework for Clinical Trials',
    domain: 'HealthTech / AI',
    stage: 'productization',
  },
  {
    project_id: 3,
    ui_project_id: 'proj_003',
    title: 'Low-Cost Quantum Sensor Array',
    domain: 'Quantum / Hardware',
    stage: 'ideation',
  },
  {
    project_id: 4,
    ui_project_id: 'proj_004',
    title: 'CRISPR-Based Crop Resilience Platform',
    domain: 'AgriBio',
    stage: 'licensing',
  },
  {
    project_id: 5,
    ui_project_id: 'proj_005',
    title: 'Edge-AI Predictive Maintenance Chip',
    domain: 'Semiconductors',
    stage: 'evaluation',
  },
  {
    project_id: 6,
    ui_project_id: 'proj_006',
    title: 'Synthetic Data Generator for Rare Diseases',
    domain: 'HealthTech / AI',
    stage: 'startup',
  },
];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_PORTFOLIO = [
  {
    project_id: 'proj_001',
    title: 'Adaptive Battery Thermal Management System',
    domain: 'Energy / DeepTech',
    stage: 'evaluation',
    overall_score: 87,
    components: {
      research_novelty: 92,
      patent_strength: 78,
      technology_maturity: 65,
      market_potential: 95,
      funding_relevance: 88,
    },
    updated_at: '2026-08-24',
  },
  {
    project_id: 'proj_002',
    title: 'Federated Learning Framework for Clinical Trials',
    domain: 'HealthTech / AI',
    stage: 'productization',
    overall_score: 81,
    components: {
      research_novelty: 85,
      patent_strength: 70,
      technology_maturity: 80,
      market_potential: 82,
      funding_relevance: 79,
    },
    updated_at: '2026-08-27',
  },
  {
    project_id: 'proj_003',
    title: 'Low-Cost Quantum Sensor Array',
    domain: 'Quantum / Hardware',
    stage: 'ideation',
    overall_score: 64,
    components: {
      research_novelty: 88,
      patent_strength: 40,
      technology_maturity: 30,
      market_potential: 68,
      funding_relevance: 72,
    },
    updated_at: '2026-08-20',
  },
  {
    project_id: 'proj_004',
    title: 'CRISPR-Based Crop Resilience Platform',
    domain: 'AgriBio',
    stage: 'licensing',
    overall_score: 90,
    components: {
      research_novelty: 90,
      patent_strength: 95,
      technology_maturity: 85,
      market_potential: 88,
      funding_relevance: 90,
    },
    updated_at: '2026-08-29',
  },
  {
    project_id: 'proj_005',
    title: 'Edge-AI Predictive Maintenance Chip',
    domain: 'Semiconductors',
    stage: 'evaluation',
    overall_score: 73,
    components: {
      research_novelty: 70,
      patent_strength: 65,
      technology_maturity: 75,
      market_potential: 80,
      funding_relevance: 74,
    },
    updated_at: '2026-08-18',
  },
  {
    project_id: 'proj_006',
    title: 'Synthetic Data Generator for Rare Diseases',
    domain: 'HealthTech / AI',
    stage: 'startup',
    overall_score: 84,
    components: {
      research_novelty: 82,
      patent_strength: 60,
      technology_maturity: 78,
      market_potential: 92,
      funding_relevance: 86,
    },
    updated_at: '2026-08-30',
  },
];

const MOCK_RECOMMENDATIONS = {
  proj_001: [
    {
      type: 'productization',
      title: 'In-house Product Line',
      confidence: 82,
      summary:
        'Strong market potential and research novelty support a direct product launch within an existing energy storage line.',
      signals: ['High market potential', 'Moderate patent coverage'],
    },
    {
      type: 'partnership',
      title: 'OEM Battery Manufacturer Partnership',
      confidence: 74,
      summary:
        'Technology maturity is still mid-stage, so co-development with an established manufacturer reduces time-to-market risk.',
      signals: ['Fills maturity gap', '3 manufacturers matched'],
    },
  ],

  proj_002: [
    {
      type: 'licensing',
      title: 'License to Clinical Data Platforms',
      confidence: 77,
      summary:
        'High funding relevance and moderate patent strength make licensing to existing clinical trial software vendors attractive.',
      signals: ['2 licensing leads identified'],
    },
    {
      type: 'productization',
      title: 'Standalone Compliance Module',
      confidence: 69,
      summary:
        'Could ship as an add-on module for HIPAA-compliant federated training.',
      signals: ['Regulatory fit'],
    },
  ],

  proj_003: [
    {
      type: 'partnership',
      title: 'University-Industry Co-Lab',
      confidence: 58,
      summary:
        'Low technology maturity makes a standalone venture premature; a joint lab keeps IP moving toward commercial readiness.',
      signals: ['Maturity below threshold'],
    },
  ],

  proj_004: [
    {
      type: 'startup',
      title: 'Spin-out AgriBio Venture',
      confidence: 91,
      summary:
        'Excellent scores across every factor support forming a new venture.',
      signals: ['Top-decile innovation score', 'Strong IP moat'],
    },
    {
      type: 'licensing',
      title: 'Non-exclusive License to AgTech Majors',
      confidence: 71,
      summary:
        'Parallel non-exclusive licensing can generate near-term revenue while the spin-out ramps up.',
      signals: ['4 licensees matched'],
    },
  ],

  proj_005: [
    {
      type: 'partnership',
      title: 'Foundry Co-Development Agreement',
      confidence: 66,
      summary:
        'Balanced scores suggest a partnership to share fabrication costs before committing to a full product line.',
      signals: ['Cost-sharing opportunity'],
    },
  ],

  proj_006: [
    {
      type: 'startup',
      title: 'Rare Disease Data-as-a-Service Startup',
      confidence: 79,
      summary:
        'High market potential and funding relevance support an independent venture targeting orphan drug research.',
      signals: ['Underserved market', 'Grant-eligible'],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function computeOverallScore(components) {
  return Math.round(
    Object.entries(SCORE_WEIGHTS).reduce(
      (sum, [key, weight]) =>
        sum + (Number(components?.[key]) || 0) * weight,
      0
    )
  );
}

function getCatalogProject(projectId) {
  const numericId = Number(projectId);

  return PROJECT_CATALOG.find(
    (project) =>
      project.project_id === numericId ||
      project.ui_project_id === projectId
  );
}

// ---------------------------------------------------------------------------
// Normalize scoring response
// ---------------------------------------------------------------------------

function normalizeScoreResponse(data, catalogProject) {
  const breakdown = data?.breakdown || {};

  const components = {
    research_novelty: Number(
      breakdown.research_novelty_score ??
        breakdown.research_novelty ??
        0
    ),

    patent_strength: Number(
      breakdown.patent_strength_score ??
        breakdown.patent_strength ??
        0
    ),

    technology_maturity: Number(
      breakdown.technology_maturity_score ??
        breakdown.technology_maturity ??
        0
    ),

    market_potential: Number(
      breakdown.market_potential_score ??
        breakdown.market_potential ??
        0
    ),

    funding_relevance: Number(
      breakdown.funding_relevance_score ??
        breakdown.funding_relevance ??
        0
    ),
  };

  return {
    project_id:
      catalogProject?.ui_project_id ??
      `proj_${String(data?.project_id ?? '').padStart(3, '0')}`,

    backend_project_id: data?.project_id,

    title:
      data?.project_title ??
      catalogProject?.title ??
      `Project #${data?.project_id}`,

    domain: catalogProject?.domain ?? 'DeepTech',

    stage: catalogProject?.stage ?? 'evaluation',

    overall_score: Number(data?.overall_score ?? computeOverallScore(components)),

    components,

    tier: data?.tier ?? '',

    summary: data?.summary ?? '',

    updated_at:
      data?.calculated_at ??
      new Date().toISOString(),

    weights: SCORE_WEIGHTS,
  };
}

// ---------------------------------------------------------------------------
// Innovation portfolio
// ---------------------------------------------------------------------------

export async function getInnovationPortfolio() {
  if (USE_MOCK) {
    await delay();

    return {
      weights: SCORE_WEIGHTS,
      projects: MOCK_PORTFOLIO,
      portfolio_average: Math.round(
        MOCK_PORTFOLIO.reduce(
          (sum, project) => sum + project.overall_score,
          0
        ) / MOCK_PORTFOLIO.length
      ),
    };
  }

  // portfolio API: every project is scored live by the weighted
  // five-pillar engine (GET /api/portfolio).
  const response = await client.get('/portfolio');
  const data = response.data || {};

  const projects = (data.projects || []).map((project) => ({
    project_id: project.project_id,
    title: project.title,
    domain: project.domain,
    stage: project.stage,
    overall_score: Number(project.overall_score || 0),
    band: project.band,
    trl: project.trl,
    components: project.components || {},
    raw: project,
  }));

  return {
    weights: data.weights || SCORE_WEIGHTS,
    projects,
    portfolio_average: Number(data.portfolio_average || 0),
    high_potential_count: Number(data.high_potential_count || 0),
    commercialization_ready_count: Number(data.commercialization_ready_count || 0),
  };
}

// ---------------------------------------------------------------------------
// Innovation pipeline
// ---------------------------------------------------------------------------

export async function getInnovationPipeline() {
  if (USE_MOCK) {
    await delay();

    const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = MOCK_PORTFOLIO.filter(
        (project) => project.stage === stage
      );

      return acc;
    }, {});

    return {
      stages: PIPELINE_STAGES,
      grouped,
    };
  }

  // pipeline API: the scored portfolio grouped by commercialization
  // stage (GET /api/portfolio/pipeline).
  const [pipelineResponse, portfolio] = await Promise.all([
    client.get('/portfolio/pipeline'),
    getInnovationPortfolio(),
  ]);

  const data = pipelineResponse.data || {};
  const stages = data.stages || PIPELINE_STAGES;
  const byId = new Map(portfolio.projects.map((p) => [p.project_id, p]));

  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = (data.grouped?.[stage] || []).map(
      (project) => byId.get(project.project_id) || project
    );
    return acc;
  }, {});

  return { stages, grouped, counts: data.counts || {} };
}

// ---------------------------------------------------------------------------
// Innovation score detail
// ---------------------------------------------------------------------------

export async function getInnovationScoreDetail(projectId) {
  if (USE_MOCK) {
    await delay(300);

    const project = MOCK_PORTFOLIO.find(
      (item) => item.project_id === projectId
    );

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      ...project,
      weights: SCORE_WEIGHTS,
      computed_overall: computeOverallScore(project.components),
    };
  }

  // score detail: full pillar breakdown, derived scores and narrative.
  const response = await client.get(`/portfolio/project/${projectId}`);
  const data = response.data || {};

  return {
    project_id: data.project_id,
    title: data.title,
    domain: data.domain,
    stage: data.stage,
    band: data.band,
    trl: data.trl,
    overall_score: Number(data.overall_score || 0),
    components: data.components || {},
    derived_scores: data.derived_scores || {},
    explanation: data.explanation || {},
    weights: SCORE_WEIGHTS,
    computed_overall: Number(data.overall_score || 0),
    raw: data,
  };
}

// ---------------------------------------------------------------------------
// Normalize commercialization response
// ---------------------------------------------------------------------------

function normalizeCommercializationResponse(data, projectId) {
  const recommendations = [];

  // Productization
  (data?.productization_recommendations || []).forEach(
    (item, index) => {
      recommendations.push({
        type: 'productization',
        title: item,
        confidence: Number(
          data?.overall_readiness_score ?? 0
        ),
        summary:
          'AI-generated productization opportunity based on the commercialization readiness assessment.',
        signals: [
          'Productization opportunity',
          `Recommendation ${index + 1}`,
        ],
      });
    }
  );

  // Licensing
  (data?.licensing_opportunities || []).forEach(
    (item) => {
      recommendations.push({
        type: 'licensing',
        title: item.title,
        confidence: Number(
          data?.overall_readiness_score ?? 0
        ),
        summary:
          `Potential licensee: ${item.potential_licensee || 'Not specified'}.`,
        signals: [
          item.potential_licensee,
          item.estimated_royalty_range,
          item.readiness_level,
        ].filter(Boolean),
      });
    }
  );

  // Startup creation
  (data?.startup_creation_recommendations || []).forEach(
    (item) => {
      recommendations.push({
        type: 'startup',
        title: item.title,
        confidence: Number(
          data?.overall_readiness_score ?? 0
        ),
        summary:
          `Incubation stage: ${item.incubation_stage || 'Not specified'}.`,
        signals: [
          item.incubation_stage,
          item.target_funding_round,
          ...(item.key_requirements || []),
        ].filter(Boolean),
      });
    }
  );

  // Industry partnerships
  (data?.industry_partnership_recommendations || []).forEach(
    (item) => {
      recommendations.push({
        type: 'partnership',
        title: item.partner_name,
        confidence: Number(
          data?.overall_readiness_score ?? 0
        ),
        summary:
          item.value_proposition ||
          'Industry partnership opportunity identified.',
        signals: [
          item.sector,
          item.collaboration_type,
        ].filter(Boolean),
      });
    }
  );

  return {
    project_id: projectId,
    backend_project_id: data?.project_id,
    project_title: data?.project_title,
    overall_readiness_score: Number(
      data?.overall_readiness_score ?? 0
    ),
    recommendations,
    raw: data,
  };
}

// ---------------------------------------------------------------------------
// Commercialization recommendations for one project
// ---------------------------------------------------------------------------

export async function getCommercializationRecommendations(projectId) {
  if (USE_MOCK) {
    await delay(350);

    return {
      project_id: projectId,
      recommendations:
        MOCK_RECOMMENDATIONS[projectId] || [],
    };
  }

  // s endpoint keys on a numeric project id; catalogue ids look like
  // "PRJ-007", so take the trailing number.
  const numericId = Number(String(projectId).replace(/\D/g, '')) || 1;

  const response = await client.get(
    `/commercialization/recommendations/${numericId}`
  );

  return normalizeCommercializationResponse(response.data, projectId);
}

// ---------------------------------------------------------------------------
// Dashboard-wide commercialization feed
//
// The current backend does not expose:
// GET /commercialization/recommendations/all
//
// Therefore, request recommendations for each known project.
// ---------------------------------------------------------------------------

export async function getAllCommercializationRecommendations() {
  if (USE_MOCK) {
    await delay(400);

    const flattened = Object.entries(
      MOCK_RECOMMENDATIONS
    ).flatMap(([projectId, recommendations]) =>
      recommendations.map((recommendation) => ({
        ...recommendation,
        project_id: projectId,
        project_title:
          MOCK_PORTFOLIO.find(
            (project) => project.project_id === projectId
          )?.title,
      }))
    );

    return {
      recommendations: flattened.sort(
        (a, b) => b.confidence - a.confidence
      ),
    };
  }

  const portfolio = await getInnovationPortfolio();
  const topProjects = portfolio.projects.slice(0, 6);

  const responses = await Promise.all(
    topProjects.map(async (project) => {
      const result = await getCommercializationRecommendations(
        project.project_id
      );

      return result.recommendations.map((recommendation) => ({
        ...recommendation,
        project_id: project.project_id,
        project_title: result.project_title || project.title,
      }));
    })
  );

  const recommendations = responses
    .flat()
    .sort(
      (a, b) =>
        Number(b.confidence || 0) -
        Number(a.confidence || 0)
    );

  return {
    recommendations,
  };
}

export {
  SCORE_WEIGHTS,
  PIPELINE_STAGES,
  PROJECT_CATALOG,
  USE_MOCK,
};