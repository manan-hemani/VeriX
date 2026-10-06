// import React from "react";

const statusClassMap = {
  SUPPORTED: "status-supported",
  CONTRADICTED: "status-contradicted",
  PARTIALLY_SUPPORTED: "status-partial",
  UNCERTAIN: "status-uncertain",
};

const statusBarClassMap = {
  SUPPORTED: "status-bar-supported",
  CONTRADICTED: "status-bar-contradicted",
  PARTIALLY_SUPPORTED: "status-bar-partial",
  UNCERTAIN: "status-bar-uncertain",
};

const statusDotClassMap = {
  SUPPORTED: "status-dot-supported",
  CONTRADICTED: "status-dot-contradicted",
  PARTIALLY_SUPPORTED: "status-dot-partial",
  UNCERTAIN: "status-dot-uncertain",
};

const statusLabelMap = {
  SUPPORTED: "SUPPORTED",
  CONTRADICTED: "CONTRADICTED",
  PARTIALLY_SUPPORTED: "PARTIALLY SUPPORTED",
  UNCERTAIN: "UNCERTAIN",
};

function InvestigationCard({ investigation, onOpen }) {
  const {
    id,
    status,
    claim,
    confidence,
    confidenceLabel,
    evidenceSummary,
    sources,
    subclaims,
    searches,
    searchType,
    tags,
    date,
    cycle,
  } = investigation;

  const statusClass = statusClassMap[status] || "status-uncertain";

  const statusBarClass = statusBarClassMap[status] || "status-bar-uncertain";

  const statusDotClass = statusDotClassMap[status] || "status-dot-uncertain";

  const statusLabel = statusLabelMap[status] || "UNCERTAIN";

  const handleOpen = () => {
    if (onOpen) {
      onOpen(investigation);
    }
  };

  return (
    <article className="investigation-card group">
      {/* TOP HEADER */}
      <div className="investigation-card-header">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`investigation-status-dot ${statusDotClass}`} />

          <span className="investigation-id">#ARC-{id}</span>
        </div>

        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
      </div>

      {/* CARD BODY */}
      <div className="investigation-card-body">
        {/* Claim */}
        <h3 className="investigation-claim">"{claim}"</h3>

        {/* CONFIDENCE */}
        <div className="investigation-confidence">
          <div className="investigation-confidence-header">
            <span className="investigation-confidence-label">
              Topological Confidence
            </span>

            <span className="investigation-confidence-value">
              <span
                className={
                  status === "SUPPORTED"
                    ? "text-success"
                    : status === "CONTRADICTED"
                      ? "text-danger"
                      : status === "PARTIALLY_SUPPORTED"
                        ? "text-lemon"
                        : "text-uncertain"
                }
              >
                {confidence}%
              </span>

              <span className="text-text-muted">{" • "}</span>

              <span className="text-text-secondary">{confidenceLabel}</span>
            </span>
          </div>

          <div className="investigation-confidence-track">
            <div
              className={`investigation-confidence-bar ${statusBarClass}`}
              style={{
                width: `${Math.min(Math.max(confidence, 0), 100)}%`,
              }}
            />
          </div>
        </div>

        {/* EVIDENCE SUMMARY */}
        <div className="investigation-evidence">
          <p>"{evidenceSummary}"</p>
        </div>

        {/* METADATA */}
        <div className="investigation-meta">
          <span>{sources} sources</span>

          <span className="investigation-meta-separator">•</span>

          <span>{subclaims} subclaims</span>

          <span className="investigation-meta-separator">•</span>

          <span>{searches} searches</span>
        </div>

        {/* Search type */}
        <div className="investigation-search-type">SerpApi {searchType}</div>

        {/* TAGS */}
        <div className="investigation-tags">
          {tags?.map((tag) => (
            <span key={tag} className="investigation-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Push footer to bottom */}
        <div className="flex-1" />

        {/* -FOOTER */}
        <div className="investigation-card-footer">
          <span className="investigation-date">
            {date}
            <span className="mx-1">•</span>
            Cyc {cycle}
          </span>

          <button
            type="button"
            onClick={handleOpen}
            className="investigation-open-button"
          >
            OPEN INVESTIGATION
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default InvestigationCard;
