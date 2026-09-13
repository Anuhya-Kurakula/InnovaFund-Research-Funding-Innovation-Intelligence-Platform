import { api } from "./api";

export const PERIODS = ["W1", "W2", "W3", "W4", "W5", "W6"];

const MOCK_TOPICS = [
  { id: "t1", name: "Diffusion Models for Protein Folding", domain: "AI & Machine Learning", series: [12, 18, 22, 31, 44, 61], velocity: 0.39 },
  { id: "t2", name: "Solid-State Battery Electrolytes", domain: "Renewable Energy", series: [8, 11, 10, 14, 19, 23], velocity: 0.21 },
  { id: "t3", name: "CRISPR Base Editing Delivery", domain: "Biotech & Genomics", series: [20, 19, 21, 18, 17, 15], velocity: -0.12 },
  { id: "t4", name: "Room-Temperature Qubit Coherence", domain: "Quantum Computing", series: [5, 6, 9, 9, 13, 20], velocity: 0.54 },
];

const MOCK_HOTSPOTS = [
  { id: "h1", name: "Diffusion Models for Protein Folding", domain: "AI & Machine Learning", cluster_size: 187, velocity_score: 0.86, keywords: ["denoising", "AlphaFold", "generative priors"] },
  { id: "h2", name: "Room-Temperature Qubit Coherence", domain: "Quantum Computing", cluster_size: 94, velocity_score: 0.71, keywords: ["decoherence time", "topological qubits"] },
  { id: "h3", name: "Perovskite Tandem Cell Stability", domain: "Renewable Energy", cluster_size: 121, velocity_score: 0.58, keywords: ["degradation", "tandem stack", "encapsulation"] },
  { id: "h4", name: "Gut-Brain Axis in Neurodegeneration", domain: "Neuroscience", cluster_size: 76, velocity_score: 0.44, keywords: ["microbiome", "vagal signaling"] },
];

const MOCK_DOMAINS = [
  { domain: "AI & Machine Learning", mentions: 412, delta: 0.28, spark: [30, 41, 38, 52, 61, 74] },
  { domain: "Renewable Energy", mentions: 205, delta: 0.11, spark: [22, 24, 21, 26, 29, 31] },
  { domain: "Biotech & Genomics", mentions: 289, delta: -0.06, spark: [40, 38, 41, 36, 34, 33] },
  { domain: "Quantum Computing", mentions: 118, delta: 0.41, spark: [8, 9, 12, 15, 19, 26] },
  { domain: "Neuroscience", mentions: 156, delta: 0.05, spark: [24, 23, 25, 24, 26, 27] },
];

export async function fetchTopics() {
  try {
    const data = await api("/trends/topics");
    return data.topics || data;
  } catch (error) {
    console.warn("Falling back to MOCK_TOPICS:", error);
    return MOCK_TOPICS;
  }
}

export async function fetchHotspotsAndDomains() {
  try {
    const data = await api("/trends/hotspots");
    return { hotspots: data.hotspots || [], domains: data.domains || MOCK_DOMAINS };
  } catch (error) {
    console.warn("Falling back to MOCK_HOTSPOTS:", error);
    return { hotspots: MOCK_HOTSPOTS, domains: MOCK_DOMAINS };
  }
}

export async function fetchEmerging() {
  try {
    const data = await api("/trends/emerging");
    return {
      count: data.count || 0,
      threshold: data.threshold ?? 0.15,
      topics: data.emerging_topics || [],
    };
  } catch (error) {
    console.warn("Emerging topics unavailable:", error);
    return { count: 0, threshold: 0.15, topics: [] };
  }
}

export async function fetchCitations() {
  try {
    return await api("/trends/citations");
  } catch (error) {
    console.warn("Falling back for citation analytics:", error);
    return {
      total_publications_analyzed: 0,
      total_citations: 0,
      average_citations_per_paper: 0,
      top_cited_publications: [],
    };
  }
}
