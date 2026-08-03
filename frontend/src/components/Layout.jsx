import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="portal-layout">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="portal-content">

        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}