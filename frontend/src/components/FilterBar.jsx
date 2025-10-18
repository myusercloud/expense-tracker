// src/components/FilterBar.jsx
import React from "react";

export default function FilterBar({ filters, setFilters, options }) {
  return (
    <div className="card p-3 mb-3">
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Year</label>
          <select
            className="form-select"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            {options.years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Month</label>
          <select
            className="form-select"
            value={filters.month || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                month: e.target.value || null,
              })
            }
          >
            <option value="">All</option>
            {options.months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={filters.categoryId || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                categoryId: e.target.value || null,
              })
            }
          >
            <option value="">All</option>
            {options.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
