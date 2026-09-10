import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/goals">Goals</Link>

      {user?.role === "ROLE_ADMIN" && (
        <Link to="/admin/stats">System Stats</Link>
      )}
    </nav>
  );
}

export default Navbar;