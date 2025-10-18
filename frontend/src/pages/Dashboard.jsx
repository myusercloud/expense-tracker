// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import FilterBar from "../components/FilterBar";
import KPIs from "../components/KPIs";
import ExpensesTable from "../components/ExpenseTable";
import ExpensesChart from "../components/ExpensesChart";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: null,
    categoryId: null,
  });

  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ years: [], months: [], categories: [] });
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // stored at login

  // --- Fetch filter dropdown options ---
  const fetchFilters = async () => {
    try {
      const res = await API.get("/analytics/filters");
      setFilterOptions(res.data);
    } catch (err) {
      console.error("Error fetching filters:", err);
    }
  };

  // --- Fetch summary metrics ---
  const fetchSummary = async () => {
    try {
      const res = await API.get("/analytics/summary", { params: { userId } });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // --- Fetch monthly trend chart data ---
  const fetchChart = async () => {
    try {
      const res = await API.get("/analytics/expenses-by-month", {
        params: { userId, year: filters.year },
      });
      // [{ month: 'Jan', total: 123 }]
      setChartData(res.data.map((item) => ({ month: item.month, total: Number(item.total) })));
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  // --- Fetch category totals (Pie Chart or list) ---
  const fetchByCategory = async () => {
    try {
      const res = await API.get("/analytics/expenses-by-category", {
        params: {
          userId,
          year: filters.year,
          month: filters.month ? filters.month : undefined,
        },
      });
      setCategoryData(res.data);
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  };

  // --- Fetch all analytics data on mount ---
  useEffect(() => {
    fetchFilters();
    fetchSummary();
    fetchChart();
    fetchByCategory();
    // eslint-disable-next-line
  }, []);

  // --- Re-fetch when filters change ---
  useEffect(() => {
    fetchChart();
    fetchByCategory();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div className="container my-4">
      <h2 className="mb-3">Dashboard</h2>

      <FilterBar filters={filters} setFilters={setFilters} options={filterOptions} />

      <div className="row mt-3">
        <div className="col-12">
          <KPIs summary={summary} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card p-3">
            <h5>Spending Over Time</h5>
            <ExpensesChart data={chartData} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3">
            <h5>Top Categories</h5>
            <ul className="list-group list-group-flush">
              {summary?.topCategories?.length > 0 ? (
                summary.topCategories.map((tc, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {tc.name}
                    <span className="badge bg-primary rounded-pill">
                      {tc.total?.toFixed(2)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="list-group-item">No data available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card p-3">
            <h5>Spending by Category</h5>
            <ul className="list-group list-group-flush">
              {categoryData.map((c, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {c.category}
                  <span className="badge bg-success rounded-pill">
                    {c.total.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3">
            <h5>Recent Expenses</h5>
            <ExpensesTable data={summary?.recentExpenses || []} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
