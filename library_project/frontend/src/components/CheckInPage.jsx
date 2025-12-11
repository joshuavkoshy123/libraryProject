import React, { useEffect, useState } from "react";

export default function CheckInPage() {
  const [checkedOut, setCheckedOut] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]); // holds selected loan_ids

  const cardId = localStorage.getItem("card_id") || "ID000001";

  // Format date: yyyy-mm-dd
  const formatDate = (str) =>
    str ? new Date(str).toISOString().split("T")[0] : "";

  // search endpoint
  async function searchCheckedOut() {
    setLoading(true);

    const res = await fetch("http://localhost:5001/api/find_checked_out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search }),
    });

    const data = await res.json();
    setCheckedOut(data);
    setLoading(false);
  }

  // load all checked out books
  async function loadAllCheckedOut() {
    setLoading(true);

    const res = await fetch("http://localhost:5001/api/display_all_checked_out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setCheckedOut(data);
    setLoading(false);
  }

  // first load show user's books
  useEffect(() => {
    setSearch(cardId);
    searchCheckedOut();
  }, []);

  // toggle checkbox selection
  function toggleSelection(loanId) {
    setSelected((prev) =>
      prev.includes(loanId)
        ? prev.filter((id) => id !== loanId)
        : [...prev, loanId]
    );
  }

  // check in selected loans
  async function checkInSelected() {
    if (selected.length === 0) {
      alert("Select at least 1 loan to check in.");
      return;
    }
    if (selected.length > 3) {
      alert("You can only check in up to 3 books at once.");
      return;
    }

    const res = await fetch("http://localhost:5001/api/check_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loan_ids: selected }),
    });

    const data = await res.json();
    alert(data.message || "Checked in!");

    setSelected([]);
    searchCheckedOut(); // refresh list
  }

  if (loading) return <h2>Loading…</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Check-In Books</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by ISBN, card_id, or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 250 }}
        />
        <button onClick={searchCheckedOut} style={{ marginLeft: 10 }}>
          Search
        </button>

        <button onClick={loadAllCheckedOut} style={{ marginLeft: 10 }}>
          Show All Checked-Out
        </button>
      </div>

      <button
        onClick={checkInSelected}
        style={{ marginBottom: 20, padding: 10 }}
      >
        Check In Selected ({selected.length})
      </button>

      {checkedOut.length === 0 ? (
        <h3>No books checked out.</h3>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Select</th>
              <th>Loan ID</th>
              <th>ISBN</th>
              <th>Card ID</th>
              <th>Borrower</th>
              <th>Title</th>
              <th>Date Out</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {checkedOut.map((row) => (
              <tr key={row[0]}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(row[0])}
                    onChange={() => toggleSelection(row[0])}
                  />
                </td>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]} {row[4]}</td>
                <td>{row[5]}</td>
                <td>{formatDate(row[6])}</td>
                <td>{formatDate(row[7])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
