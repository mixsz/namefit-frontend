import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";

function Layout() {
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // reload completo da page
  }
  return (
    <div>
      <Header onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
