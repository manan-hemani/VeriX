// import React from "react";
import InvestigationCard from "./InvestigationCard";

function InvestigationGrid({ investigations, onOpen }) {
  if (!investigations || investigations.length === 0) {
    return (
      <div className="investigation-empty-state">
        <div className="investigation-empty-icon">◌</div>

        <h3>No investigations yet</h3>

        <p>Investigated claims will appear here.</p>
      </div>
    );
  }

  return (
    <div className="investigation-grid">
      {investigations.map((investigation) => (
        <InvestigationCard
          key={investigation.id}
          investigation={investigation}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export default InvestigationGrid;
