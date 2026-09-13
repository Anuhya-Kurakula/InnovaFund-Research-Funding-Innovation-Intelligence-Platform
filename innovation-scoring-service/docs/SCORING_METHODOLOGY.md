# Innovation Scoring Engine — Methodology & Mathematical Specifications (Member 4)

---

## 1. Executive Summary

The **Innovation Scoring Engine** (Member 4 deliverable) calculates an objective, standardized composite metric ($0.0 \dots 100.0$) evaluating the commercial, technical, scientific, and funding viability of research proposals and deep-tech inventions.

The engine processes **five core pillars**, computes **five specialized derived indices**, maps technology maturity to NASA standard **Technology Readiness Levels (TRL 1–9)**, and classifies innovations into qualitative score bands.

---

## 2. Core Weighted Composite Formula

The primary composite innovation score is computed as a weighted linear combination of five normalized pillars:

$$\text{Innovation Score} = \sum_{i=1}^{5} w_i \cdot P_i$$

Where each pillar score $P_i \in [0.0, 100.0]$ and the weight vector satisfies $\sum_{i=1}^{5} w_i = 1.0$:

| Pillar Key | Name | Weight ($w_i$) | Strategic Rationale |
| :--- | :--- | :--- | :--- |
| `research_novelty` | **Research Novelty** | **0.30** (30%) | Foundational scientific breakthrough level, uniqueness of approach, and distance from prior art. |
| `patent_strength` | **Patent Strength** | **0.20** (20%) | Defensibility, patent claim breadth, citation velocity, and international family protection. |
| `technology_maturity` | **Technology Maturity** | **0.15** (15%) | Lifecycle progression from lab prototype to commercialization readiness. |
| `market_potential` | **Market Potential** | **0.20** (20%) | Total Addressable Market (TAM), commercial adoption velocity, and industrial demand. |
| `funding_relevance` | **Funding Relevance** | **0.15** (15%) | Strategic fit with national grants, venture capital focus areas, and institutional priorities. |

*Startup invariant*: All weights are defined strictly in `app/core/weights.py` and validated on module load.

---

## 3. Five Derived Scoring Functions

To give researchers, innovation transfer officers, and funding committees multi-dimensional perspective, the engine computes five specialized derived scores:

### 1. Innovation Potential (0–100)
Evaluates raw disruptive capacity by blending scientific novelty with IP defensibility and market demand:
$$\text{Innovation Potential} = 0.45 \cdot \text{Novelty} + 0.30 \cdot \text{Patent Strength} + 0.25 \cdot \text{Market Potential}$$

### 2. Research Impact (0–100)
Measures academic significance and grant-worthiness:
$$\text{Research Impact} = 0.55 \cdot \text{Novelty} + 0.25 \cdot \text{Patent Strength} + 0.20 \cdot \text{Funding Relevance}$$

### 3. Technology Readiness Score & TRL 1–9
Evaluates engineering maturity and maps directly to the NASA/DoD 9-level TRL scale:
$$\text{Readiness Score} = 0.60 \cdot \text{Tech Maturity} + 0.25 \cdot \text{Patent Strength} + 0.15 \cdot \text{Market Potential}$$
$$\text{TRL} = \text{clamp}\left(\left\lceil \frac{\text{Readiness Score}}{100} \times 9 \right\rceil, 1, 9\right)$$

*TRL Mapping Reference Table*:
- **TRL 1–3**: Basic Principles & Concept Formulation (Score: 0.1 – 33.3)
- **TRL 4–6**: Lab Validation & Prototype Demonstration (Score: 33.4 – 66.6)
- **TRL 7–9**: System Qualification & Commercial Deployment (Score: 66.7 – 100.0)

### 4. Commercial Viability (0–100)
Measures the likelihood of sustainable industrial execution:
$$\text{Commercial Viability} = 0.45 \cdot \text{Market Potential} + 0.30 \cdot \text{Tech Maturity} + 0.25 \cdot \text{Patent Strength}$$

### 5. Funding Attractiveness (0–100)
Calculates investor and institutional grant appeal:
$$\text{Funding Attractiveness} = 0.40 \cdot \text{Funding Relevance} + 0.30 \cdot \text{Novelty} + 0.30 \cdot \text{Market Potential}$$

---

## 4. Qualitative Score Bands

| Score Range | Qualitative Band | Hex Color Code | Typical Interpretation |
| :--- | :--- | :--- | :--- |
| **80.00 – 100.00** | **Very High** | `#10b981` (Emerald) | Top-tier breakthrough with immediate high-value commercial and grant potential. |
| **65.00 – 79.99** | **High** | `#0ea5e9` (Sky Blue) | Strong research foundation with viable patent backing and solid market demand. |
| **50.00 – 64.99** | **Moderate** | `#f59e0b` (Amber) | Solid concept with moderate technical or commercial bottlenecks to resolve. |
| **35.00 – 49.99** | **Low** | `#f97316` (Orange) | Early exploratory research requiring maturation in defensibility or market validation. |
| **0.00 – 34.99** | **Very Low** | `#ef4444` (Rose/Red) | High-risk baseline or conceptual proposal requiring fundamental refactoring. |

---

## 5. Bibliometric Normalization Models

When raw bibliometric or patent metrics are provided instead of normalized scores, the `HeuristicSignalProvider` executes non-linear normalizations:

- **Logarithmic Normalization** (for long-tailed counts like citations):
  $$\text{Score}_{\text{cit}} = \text{clamp}\left(\frac{\ln(1 + \text{citation\_count})}{\ln(1 + \text{MAX\_CITATIONS})} \times 100, 0, 100\right)$$
- **Min-Max Feature Scaling** (for claim counts and family sizes):
  $$\text{Score}_{\text{claim}} = \text{clamp}\left(\frac{\text{claim\_count} - 1}{\text{MAX\_CLAIMS} - 1} \times 100, 0, 100\right)$$
