import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import TopNav from "@/components/layout/TopNav/TopNav";
import styles from "./AppLayout.module.scss";

export default function AppLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={styles.content}>
        <TopNav onMenuClick={() => setSidebarOpen((open) => !open)} userName="Adedeji" />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
