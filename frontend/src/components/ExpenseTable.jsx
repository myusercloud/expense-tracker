// src/components/ExpensesTable.jsx
import React from "react";

export default function ExpensesTable({ data = [], meta = {}, loading, onPageChange }) {
  // Defensive defaults
  const currentPage = meta.page ?? 1;
  const totalPages = meta.pages ?? 1;
  const totalRecords = meta.total ?? data.length;

  if (loading) {
    return (
      <div className="card p-3 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card p-3 text-center">
        <p className="text-muted mb-0">No expenses found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Expenses</h5>
        <small className="text-muted">
          Page {currentPage} of {totalPages} — Showing {data.length} of {totalRecords}
        </small>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>${e.amount?.toFixed(2) ?? "0.00"}</td>
                <td>{e.category?.name || "—"}</td>
                <td>{new Date(e.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination mb-0">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(i + 1)}
                    disabled={currentPage === i + 1}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
