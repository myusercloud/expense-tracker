// src/components/KPIs.jsx
import React from "react";

export default function KPIs({ summary }) {
  if (!summary) return <div>Loading...</div>;

  return (
    <div className="row text-center">
      <div className="col-md-4">
        <div className="card p-3">
          <h5>Total Spent</h5>
          <h3 className="text-primary">
            ${summary.totalSpent?.toFixed(2) || 0}
          </h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3">
          <h5>Average Expense</h5>
          <h3 className="text-success">
            ${summary.avgSpent?.toFixed(2) || 0}
          </h3>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3">
          <h5>Top Category</h5>
          <h3 className="text-warning">
            {summary.topCategories?.[0]?.name || "N/A"}
          </h3>
        </div>
      </div>
    </div>
  );
}
