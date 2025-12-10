import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./FinesPage.css";

export default function FinesPage({ fetchUrl = "http://localhost:5001/api/fines" }) {
  const [fines, setFines] = useState([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [selected, setSelected] = useState(null);

  const backendBase = fetchUrl.replace(/\/api\/.*$/, "http://localhost:5001");

  useEffect(() => {
    let mounted = true;
    async function loadFines() {
      try {
        const res = await axios.get(fetchUrl);
        if (mounted) setFines(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch fines", err);
        if (mounted) setFines([]);
      }
    }
    loadFines();
    return () => (mounted = false);
  }, [fetchUrl]);

  function extractLoanId(f) {
    if (f?.loan_id != null) return f.loan_id;
    if (typeof f?.id === "string" && f.id.startsWith("LN-")) {
      const n = f.id.replace(/^LN-/, "");
      const parsed = parseInt(n, 10);
      return Number.isNaN(parsed) ? f.id : parsed;
    }
    return f?.id;
  }

  async function markAsPaid(fine) {
    const loan_id = extractLoanId(fine);
    try {
      await axios.post(`${backendBase}/api/update_fine`, { loan_id, clear_amount: true });
      const res = await axios.get(fetchUrl);
      setFines(Array.isArray(res.data) ? res.data : []);
      setSelected(null);
    } catch (err) {
      console.error("markAsPaid failed, applying optimistic update:", err);
      setFines(prev =>
        prev.map(f => (extractLoanId(f) === loan_id ? { ...f, status: "paid", amount: 0 } : f))
      );
      setSelected(null);
    }
  }

  async function updateFine(fine) {
    const loan_id = extractLoanId(fine);
    try {
      await axios.post(`${backendBase}/api/update_fine`, { loan_id });
      const res = await axios.get(fetchUrl);
      setFines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to update fine", err);
    }
  }

  async function resetFine(fine) {
    return markAsPaid(fine);
  }

  const filtered = useMemo(() => {
    let arr = Array.isArray(fines) ? fines.slice() : [];

    if (filterStatus !== "all") arr = arr.filter(f => f.status === filterStatus);

    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(f =>
        (f.patronName || "").toLowerCase().includes(q) ||
        (f.patronId || "").toLowerCase().includes(q) ||
        (f.title || "").toLowerCase().includes(q) ||
        (String(f.id || "")).toLowerCase().includes(q)
      );
    }

    arr.sort((a, b) => {
      const A = a.loan_id ?? a.id ?? "";
      const B = b.loan_id ?? b.id ?? "";
      return A < B ? -1 : A > B ? 1 : 0;
    });

    return arr;
  }, [fines, query, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fines-container">
      <div className="fines-header">
        <h1>Library Fines</h1>
        <div className="actions">
          <span>Total: {filtered.length}</span>
        </div>
      </div>

      <div className="search-filters">
        <input
          placeholder="Search by name, patron ID, title or fine ID"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
        >
          <option value="all">All</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="fines-table">
          <thead>
            <tr>
              <th>Fine ID</th>
              <th>Patron</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 16, color: "#6b7280" }}>
                  No fines found
                </td>
              </tr>
            ) : (
              pageData.map(f => (
                <tr key={f.loan_id ?? f.id}>
                  <td>{f.id}</td>
                  <td>
                    {f.patronName}
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{f.patronId}</div>
                  </td>
                  <td>
                    {f.title}
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{f.barcode}</div>
                  </td>
                  <td>${(f.amount || 0).toFixed(2)}</td>
                  <td>{f.issuedDate}</td>
                  <td>{f.dueDate}</td>
                  <td>
                    <span className={f.status === "paid" ? "status-paid" : "status-unpaid"}>
                      {f.status}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="update-row" onClick={() => updateFine(f)}>Update</button>
                    {f.status === "unpaid" && (
                      <button className="mark-paid" onClick={() => markAsPaid(f)}>Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div>Page {page} of {totalPages}</div>
        <div>
          <button onClick={() => setPage(1)} disabled={page === 1}>First</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
        </div>
      </div>

      {selected && (
        <>
          <div className="modal-backdrop" onClick={() => setSelected(null)} />
          <div className="modal">
            <h2>Fine Details</h2>
            <div className="modal-row"><strong>Fine ID:</strong> {selected.id}</div>
            <div className="modal-row"><strong>Patron:</strong> {selected.patronName} ({selected.patronId})</div>
            <div className="modal-row"><strong>Item:</strong> {selected.title} — {selected.barcode}</div>
            <div className="modal-row"><strong>Amount:</strong> ${(selected.amount || 0).toFixed(2)}</div>
            <div className="modal-row"><strong>Issued:</strong> {selected.issuedDate}</div>
            <div className="modal-row"><strong>Due:</strong> {selected.dueDate}</div>
            <div className="modal-row"><strong>Status:</strong> {selected.status}</div>
            <div className="modal-actions">
              <button className="close" onClick={() => setSelected(null)}>Close</button>
              {selected.status === "unpaid" && (
                <button className="mark-paid" onClick={() => markAsPaid(selected)}>Confirm Mark Paid</button>
              )}
              <button className="reset-fine" onClick={() => resetFine(selected)}>Reset Fine</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
