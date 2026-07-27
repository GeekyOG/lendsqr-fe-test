import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.svg";
import briefcaseIcon from "@/assets/icons/briefcase.svg";
import chevronRightIcon from "@/assets/icons/chevron-right.svg";
import homeIcon from "@/assets/icons/home.svg";
import userFriendsIcon from "@/assets/icons/users-icon.svg";
import usersIcon from "@/assets/icons/users.svg";
import sackIcon from "@/assets/icons/loan.svg";
import savingsIcon from "@/assets/icons/piggy-bank.svg";
import handshakeIcon from "@/assets/icons/handshake-regular.svg";
import handHoldingIcon from "@/assets/icons/loan-request.svg";
import userCheckIcon from "@/assets/icons/user-check.svg";
import userTimesIcon from "@/assets/icons/user-times.svg";
import bankIcon from "@/assets/icons/bank.svg";
import coinsSolidIcon from "@/assets/icons/coins-solid.svg";
import transactionsIcon from "@/assets/icons/transactions-icon.svg";
import galaxyIcon from "@/assets/icons/galaxy.svg";
import userCogIcon from "@/assets/icons/user-cog.svg";
import scrollIcon from "@/assets/icons/scroll.svg";
import chartBarIcon from "@/assets/icons/chart-bar.svg";
import slidersHIcon from "@/assets/icons/sliders-h.svg";
import badgePercentIcon from "@/assets/icons/badge-percent.svg";
import clipboardIcon from "@/assets/icons/clipboard-list.svg"
import tireIcon from "@/assets/icons/tire.svg"
import signOutIcon from "@/assets/icons/sign-out.svg";
import styles from "./Sidebar.module.scss";

interface NavEntry {
  label: string;
  icon?: string;
  to?: string;
}

const CUSTOMERS: NavEntry[] = [
  { label: "Users", icon: userFriendsIcon, to: "/users" },
  { label: "Guarantors", icon: usersIcon },
  { label: "Loans", icon: sackIcon },
  { label: "Decision Models", icon: handshakeIcon },
  { label: "Savings", icon : savingsIcon },
  { label: "Loan Requests", icon: handHoldingIcon },
  { label: "Whitelist", icon: userCheckIcon },
  { label: "Karma", icon: userTimesIcon },
];

const BUSINESSES: NavEntry[] = [
  { label: "Organization", icon: briefcaseIcon },
  { label: "Loan Products", icon: handHoldingIcon },
  { label: "Savings Products", icon: bankIcon },
  { label: "Fees and Charges", icon: coinsSolidIcon },
  { label: "Transactions", icon: transactionsIcon },
  { label: "Services", icon: galaxyIcon },
  { label: "Service Account", icon: userCogIcon },
  { label: "Settlements", icon: scrollIcon },
  { label: "Reports", icon: chartBarIcon },
];

const SETTINGS: NavEntry[] = [
  { label: "Preferences", icon: slidersHIcon },
  { label: "Fees and Pricing", icon: badgePercentIcon },
  { label: "Audit Logs", icon: clipboardIcon  },
  { label: "Systems Messages", icon: tireIcon },
];

function NavIcon({ icon }: { icon?: string }) {
  if (!icon) {
    return <span className={styles.iconPlaceholder} aria-hidden="true" />;
  }
  return <img src={icon} alt="" className={styles.navIcon} />;
}

function NavRow({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  const content: ReactNode = (
    <>
      <NavIcon icon={entry.icon} />
      <span>{entry.label}</span>
    </>
  );

  if (!entry.to) {
    return (
      <span className={styles.navLink} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <NavLink
      to={entry.to}
      onClick={onNavigate}
      className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
    >
      {content}
    </NavLink>
  );
}

function NavSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavEntry[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className={styles.sectionTitle}>{title}</p>
      <ul className={styles.navList}>
        {items.map((entry) => (
          <li key={entry.label}>
            <NavRow entry={entry} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("lendsqr_session");
    navigate("/", { replace: true });
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.logo}>
        <img src={logo} alt="Lendsqr" />
      </div>

      <button type="button" className={styles.switchOrg} disabled>
        <img src={briefcaseIcon} alt="" className={styles.navIcon} />
        <span>Switch Organization</span>
        <img src={chevronRightIcon} alt="" className={styles.switchOrgChevron} />
      </button>

      <nav className={styles.nav} aria-label="Main">
        <ul className={styles.navList}>
          <li>
            <NavRow
              entry={{ label: "Dashboard", icon: homeIcon, to: "/dashboard" }}
              onNavigate={onNavigate}
            />
          </li>
        </ul>

        <NavSection title="CUSTOMERS" items={CUSTOMERS} onNavigate={onNavigate} />
        <NavSection title="BUSINESSES" items={BUSINESSES} onNavigate={onNavigate} />
        <NavSection title="SETTINGS" items={SETTINGS} onNavigate={onNavigate} />
      </nav>

      <div className={styles.footer}>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          <img src={signOutIcon} alt="" className={styles.navIcon} />
          <span>Logout</span>
        </button>
        <p className={styles.version}>v1.2.0</p>
      </div>
    </aside>
  );
}
