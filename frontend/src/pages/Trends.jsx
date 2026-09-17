import { useEffect, useState } from "react";
import "../styles/trends.css";
import {
  PERIODS,
  fetchTopics,
  fetchHotspotsAndDomains,
} from "../services/trendsApi";

/* =========================================================
   ICONS
========================================================= */

function Icon({ name, size = 18 }) {
  const icons = {
    trend: (
      <>
        <path d="M4 17l5-5 4 3 7-8" />
        <path d="M16 7h4v4" />
      </>
    ),

    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.8-4L3 9" />
        <path d="M3 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.8 4L21 15" />
        <path d="M21 20v-5h-5" />
      </>
    ),

    flame: (
      <path d="M12 22c4.4 0 7-2.9 7-6.8 0-3.1-1.8-5.4-4.2-7.6.1 2.2-1 3.6-2.1 4.4.2-4.4-1.7-7.5-5.1-9.8.2 3.7-3.6 6.2-3.6 10.4C4 18.5 7.2 22 12 22Z" />
    ),

    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </>
    ),

    activity: (
      <>
        <path d="M3 12h4l2-7 5 14 2-7h5" />
      </>
    ),

    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),

    arrowDown: (
      <>
        <path d="M12 5v14" />
        <path d="m18 13-6 6-6-6" />
      </>
    ),

    minus: <path d="M6 12h12" />,

    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

/* =========================================================
   DELTA
========================================================= */

function Delta({ value }) {
  const up = value > 0.02;
  const down = value < -0.02;

  return (
    <span
      className={
        up
          ? "trend-delta trend-delta-up"
          : down
          ? "trend-delta trend-delta-down"
          : "trend-delta trend-delta-neutral"
      }
    >
      {up ? (
        <Icon name="arrowUp" size={12} />
      ) : down ? (
        <Icon name="arrowDown" size={12} />
      ) : (
        <Icon name="minus" size={12} />
      )}

      {value > 0 ? "+" : ""}
      {Math.round(value * 100)}%
    </span>
  );
}

/* =========================================================
   SPARKLINE
========================================================= */

function Sparkline({ data = [] }) {
  if (!data.length) {
    return (
      <div className="sparkline-empty">
        No data
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <svg
        className="sparkline"
        width="110"
        height="38"
        viewBox="0 0 110 38"
      >
        <circle
          cx="55"
          cy="19"
          r="3"
          fill="currentColor"
        />
      </svg>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 32 - ((value - min) / range) * 25;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,38 ${points} 100,38`;

  return (
    <svg
      className="sparkline"
      width="110"
      height="38"
      viewBox="0 0 100 38"
      preserveAspectRatio="none"
    >
      <polygon
        points={areaPoints}
        fill="rgba(37, 99, 235, 0.08)"
      />

      <polyline
        points={points}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* =========================================================
   TREND BARS
========================================================= */

function TrendBars({ series = [] }) {
  if (!series.length) {
    return (
      <div className="state">
        No publication trend data available.
      </div>
    );
  }

  const max = Math.max(...series) || 1;

  return (
    <div className="trend-bars">
      {series.map((value, index) => {
        const height = Math.max(
          5,
          (value / max) * 100
        );

        return (
          <div
            className="trend-bar-col"
            key={`${PERIODS[index] || index}-${index}`}
          >
            <div className="trend-bar-value">
              {value}
            </div>

            <div
              className="trend-bar"
              style={{
                height: `${height}%`,
              }}
            />

            <span>
              {PERIODS[index] || ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Trends() {
  const [status, setStatus] = useState("loading");

  const [topics, setTopics] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [domains, setDomains] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState("");

  const load = async () => {
    setStatus("loading");

    try {
      const [topicData, hotspotDomainData] =
        await Promise.all([
          fetchTopics(),
          fetchHotspotsAndDomains(),
        ]);

      const safeTopics = Array.isArray(topicData)
        ? topicData
        : [];

      const safeHotspots =
        Array.isArray(hotspotDomainData?.hotspots)
          ? hotspotDomainData.hotspots
          : [];

      const safeDomains =
        Array.isArray(hotspotDomainData?.domains)
          ? hotspotDomainData.domains
          : [];

      setTopics(safeTopics);
      setHotspots(safeHotspots);
      setDomains(safeDomains);

      setSelectedTopic(
        safeTopics[0]?.id || ""
      );

      setStatus(
        safeTopics.length ||
        safeHotspots.length ||
        safeDomains.length
          ? "data"
          : "empty"
      );
    } catch (error) {
      console.error(
        "Research intelligence error:",
        error
      );

      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeTopic =
    topics.find(
      (topic) => topic.id === selectedTopic
    ) || topics[0];

  /* =====================================================
     STATES
  ===================================================== */

  if (status === "loading") {
    return (
      <section className="trends-page">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              Research analytics
            </span>

            <h1>Research Intelligence</h1>

            <p>
              Monitor publication signals, emerging
              topics and research hotspots.
            </p>
          </div>
        </div>

        <div className="card state">
          Loading research intelligence…
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="trends-page">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              Research analytics
            </span>

            <h1>Research Intelligence</h1>

            <p>
              Monitor publication signals, emerging
              topics and research hotspots.
            </p>
          </div>
        </div>

        <div className="card state">
          <p className="error">
            Couldn't reach the research intelligence
            service.
          </p>

          <button
            className="button"
            onClick={load}
          >
            <Icon name="refresh" size={15} />
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (status === "empty") {
    return (
      <section className="trends-page">
        <div className="page-head">
          <div>
            <span className="eyebrow">
              Research analytics
            </span>

            <h1>Research Intelligence</h1>

            <p>
              Monitor publication signals, emerging
              topics and research hotspots.
            </p>
          </div>

          <button
            className="button secondary"
            onClick={load}
          >
            <Icon name="refresh" size={15} />
            Refresh
          </button>
        </div>

        <div className="card state">
          <p>
            No research intelligence data is
            available yet.
          </p>

          <p className="muted">
            Add research data or refresh the service
            to populate this dashboard.
          </p>
        </div>
      </section>
    );
  }

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const avgMentions = domains.length
    ? Math.round(
        domains.reduce(
          (total, domain) =>
            total + Number(domain.mentions || 0),
          0
        ) / domains.length
      )
    : 0;

  const sortedHotspots = hotspots
    .slice()
    .sort(
      (a, b) =>
        Number(b.velocity_score || 0) -
        Number(a.velocity_score || 0)
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="trends-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-head">
        <div>
          <span className="eyebrow">
            Research analytics
          </span>

          <h1>
            Research Intelligence
          </h1>

          <p>
            Monitor publication signals, emerging
            topics and research hotspots.
          </p>
        </div>

        <button
          className="button secondary"
          onClick={load}
        >
          <Icon name="refresh" size={15} />
          Refresh
        </button>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="trend-summary">

        <div className="card trend-stat">
          <div className="trend-stat-icon blue">
            <Icon
              name="database"
              size={18}
            />
          </div>

          <span className="muted">
            Tracked domains
          </span>

          <strong>
            {domains.length}
          </strong>

          <small>
            Research areas monitored
          </small>
        </div>

        <div className="card trend-stat">
          <div className="trend-stat-icon purple">
            <Icon
              name="activity"
              size={18}
            />
          </div>

          <span className="muted">
            Avg. mentions
          </span>

          <strong>
            {avgMentions.toLocaleString()}
          </strong>

          <small>
            Across tracked domains
          </small>
        </div>

        <div className="card trend-stat">
          <div className="trend-stat-icon orange">
            <Icon
              name="flame"
              size={18}
            />
          </div>

          <span className="muted">
            Hotspots
          </span>

          <strong>
            {hotspots.length}
          </strong>

          <small>
            Emerging research clusters
          </small>
        </div>

      </div>

      {/* =================================================
          DOMAIN MONITORING
      ================================================= */}

      <div className="card compact">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              Activity
            </span>

            <h2>
              Domain Monitoring
            </h2>

            <p>
              Recent activity across your tracked
              research domains.
            </p>
          </div>

        </div>

        <div className="domain-list">

          {domains.map((domain) => (
            <div
              className="trend-row"
              key={domain.domain}
            >

              <div className="trend-main">

                <div className="trend-title-row">
                  <span className="domain-dot" />

                  <strong>
                    {domain.domain}
                  </strong>
                </div>

                <p>
                  {Number(
                    domain.mentions || 0
                  ).toLocaleString()}{" "}
                  mentions

                  <span className="trend-separator">
                    ·
                  </span>

                  <Delta
                    value={Number(
                      domain.delta || 0
                    )}
                  />
                </p>
              </div>

              <Sparkline
                data={
                  Array.isArray(domain.spark)
                    ? domain.spark
                    : []
                }
              />

            </div>
          ))}

        </div>

      </div>

      {/* =================================================
          TOPIC TRENDS
      ================================================= */}

      {activeTopic && (
        <div className="card compact">

          <div className="section-heading topic-header">

            <div>
              <span className="eyebrow">
                Publication activity
              </span>

              <h2>
                Topic Trends
              </h2>

              <p>
                Publication velocity over the
                selected period.
              </p>
            </div>

            <select
              value={selectedTopic}
              onChange={(event) =>
                setSelectedTopic(
                  event.target.value
                )
              }
            >
              {topics.map((topic) => (
                <option
                  key={topic.id}
                  value={topic.id}
                >
                  {topic.name}
                </option>
              ))}
            </select>

          </div>

          <div className="topic-highlight">

            <div>
              <span className="muted">
                Current mentions
              </span>

              <strong>
                {Number(
                  activeTopic.series?.[
                    activeTopic.series.length - 1
                  ] || 0
                ).toLocaleString()}
              </strong>

              <span>
                mentions this week
              </span>
            </div>

            <div className="topic-velocity">

              <span className="muted">
                Velocity
              </span>

              <Delta
                value={Number(
                  activeTopic.velocity || 0
                )}
              />

            </div>

          </div>

          <TrendBars
            series={
              Array.isArray(activeTopic.series)
                ? activeTopic.series
                : []
            }
          />

        </div>
      )}

      {/* =================================================
          RESEARCH HOTSPOTS
      ================================================= */}

      <div className="card compact">

        <div className="section-heading">

          <div>
            <span className="eyebrow">
              Emerging research
            </span>

            <h2>
              Research Hotspots
            </h2>

            <p>
              Fast-moving topics worth watching.
            </p>
          </div>

          <div className="hotspot-count">
            {hotspots.length} topics
          </div>

        </div>

        <div className="hotspot-list">

          {sortedHotspots.map(
            (hotspot, index) => {

              const score =
                Number(
                  hotspot.velocity_score || 0
                );

              return (
                <div
                  className="hotspot-row"
                  key={
                    hotspot.id ||
                    hotspot.name ||
                    index
                  }
                >

                  <div className="hotspot-rank">
                    #{index + 1}
                  </div>

                  <div className="hotspot-content">

                    <div className="hotspot-title">

                      <strong>
                        {hotspot.name}
                      </strong>

                      {score > 0.7 && (
                        <span className="chip hot">
                          <Icon
                            name="flame"
                            size={10}
                          />
                          Hot
                        </span>
                      )}

                    </div>

                    <p>
                      {hotspot.domain}
                      <span className="trend-separator">
                        ·
                      </span>
                      {hotspot.cluster_size}{" "}
                      papers clustered
                    </p>

                    <div className="chips">

                      {Array.isArray(
                        hotspot.keywords
                      ) &&
                        hotspot.keywords
                          .slice(0, 6)
                          .map((keyword) => (
                            <span
                              className="chip"
                              key={keyword}
                            >
                              {keyword}
                            </span>
                          ))}

                    </div>

                  </div>

                  <div className="hotspot-score-wrap">

                    <span className="muted">
                      Velocity
                    </span>

                    <strong className="hotspot-score">
                      {Math.round(
                        score * 100
                      )}
                    </strong>

                  </div>

                </div>
              );
            }
          )}

          {sortedHotspots.length === 0 && (
            <div className="state">
              No research hotspots available.
            </div>
          )}

        </div>

      </div>

    </section>
  );
}