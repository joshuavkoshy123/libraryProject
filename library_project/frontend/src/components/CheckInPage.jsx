import React, { useEffect, useState } from "react";

export default function CheckInPage() {
  const [checkedOut, setCheckedOut] = useState([]);
  const [loading, setLoading] = useState(true);

  // hardcoded for now, replace with login later
  const cardId = localStorage.getItem("card_id") || "ID000001";

  // Format date to YYYY-MM-DD
  const formatDate = (str) => {
    if (!str) return "";
    return new Date(str).toISOString().split("T")[0];
  };

  // Load checked-out books
  async function fetchCheckedOut() {
    setLoading(true);

    const res = await fetch("http://localhost:5001/api/find_checked_out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ search: cardId }),
    });

    const data = await res.json();
    setCheckedOut(data);
    setLoading(false);
  }

  // Run once when the page loads
  useEffect(() => {
    fetchCheckedOut();
  }, []);

  // Handle check-in
  async function handleCheckIn(id) {
    await fetch("http://localhost:5001/api/check_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loan_ids: [id] }),
    });

    alert("Book checked in!");
    fetchCheckedOut();
  }

  if (loading) return <h2>Loading…</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Check-In Books</h1>

      {checkedOut.length === 0 ? (
        <h3>No books checked out.</h3>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>ISBN</th>
              <th>Card ID</th>
              <th>Borrower</th>
              <th>Title</th>
              <th>Date Out</th>
              <th>Due Date</th>
              <th>Check In</th>
            </tr>
          </thead>

          <tbody>
            {checkedOut.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]} {row[4]}</td>
                <td>{row[5]}</td>
                <td>{formatDate(row[6])}</td>
                <td>{formatDate(row[7])}</td>

                <td>
                  <button onClick={() => handleCheckIn(row[0])}>
                    Check In
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
