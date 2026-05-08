import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#1a1a1b' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        {/* Mobile top bar + drawer */}
        <MobileSidebar />
        <main className="flex-1 overflow-hidden flex flex-col min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}