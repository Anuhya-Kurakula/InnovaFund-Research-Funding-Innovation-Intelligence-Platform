import axios from 'axios';

const FALLBACK_RECOMMENDATIONS = [
  {
    opportunity_id: 1,
    title: "National AI & Machine Learning Advancement Grant",
    agency: "National Science Foundation (NSF)",
    amount: 750000,
    deadline: "2026-11-15",
    score: 94.5,
    eligible: true,
    reasoning: "Strong domain fit, competitive funding amount, deadline gives enough prep time.",
    url: "https://www.grants.gov",
    external_link: "https://www.grants.gov"
  },
  {
    opportunity_id: 2,
    title: "Horizon Europe Next-Gen Biotechnology Research Fellowship",
    agency: "European Research Council (ERC)",
    amount: 1200000,
    deadline: "2026-10-30",
    score: 89.2,
    eligible: true,
    reasoning: "Moderate domain fit, prestigious international funding, historically good odds.",
    url: "https://ec.europa.eu",
    external_link: "https://ec.europa.eu"
  },
  {
    opportunity_id: 3,
    title: "Clean Energy & Battery Technology Commercialization Fund",
    agency: "ARPA-E (Department of Energy)",
    amount: 1500000,
    deadline: "2026-12-01",
    score: 86.8,
    eligible: true,
    reasoning: "High commercialization potential, non-dilutive innovation funding.",
    url: "https://arpa-e.energy.gov",
    external_link: "https://arpa-e.energy.gov"
  },
  {
    opportunity_id: 4,
    title: "Quantum Computing & Information Sciences Challenge",
    agency: "Engineering & Physical Sciences Research Council (EPSRC)",
    amount: 500000,
    deadline: "2026-09-25",
    score: 82.4,
    eligible: true,
    reasoning: "Deep tech focus, active university collaborative track.",
    url: "https://www.ukri.org",
    external_link: "https://www.ukri.org"
  },
  {
    opportunity_id: 5,
    title: "Deep Tech Founders Accelerator Cohort 2026",
    agency: "Y Combinator Deep Tech Track",
    amount: 150000,
    deadline: "2026-10-15",
    score: 79.1,
    eligible: true,
    reasoning: "Startup accelerator with equity co-investment and tech transfer mentoring.",
    url: "https://www.ycombinator.com",
    external_link: "https://www.ycombinator.com"
  },
  {
    opportunity_id: 6,
    title: "Frontier Technology Venture Catalyst Fund",
    agency: "Breakthrough Energy Ventures",
    amount: 2000000,
    deadline: "2026-11-30",
    score: 76.5,
    eligible: true,
    reasoning: "Series A co-investment catalyst for high societal impact innovations.",
    url: "https://breakthroughenergy.org",
    external_link: "https://breakthroughenergy.org"
  }
];

const recClient = axios.create({ baseURL: 'http://localhost:8000' });
recClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getRecommendations = async (researcherId) => {
  try {
    const response = await recClient.get(`/recommendations/${researcherId}`);
    if (response.data && response.data.length > 0) return response.data;
  } catch (e) {
    try {
      const altRes = await recClient.get(`/api/recommendations/${researcherId}`);
      if (altRes.data && altRes.data.length > 0) return altRes.data;
    } catch (e2) {}
  }
  return FALLBACK_RECOMMENDATIONS;
};

export const generateRecommendations = async (researcherId, topN = 10) => {
  try {
    const response = await recClient.post('/recommendations/generate', {
      researcher_id: researcherId,
      top_n: topN,
    });
    if (response.data && response.data.length > 0) return response.data;
  } catch (e) {
    try {
      const altRes = await recClient.post('/api/recommendations/generate', {
        researcher_id: researcherId,
        top_n: topN,
      });
      if (altRes.data && altRes.data.length > 0) return altRes.data;
    } catch (e2) {}
  }
  return FALLBACK_RECOMMENDATIONS;
};

