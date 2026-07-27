import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserById, updateUserStatus } from "@/services/users";
import type { User, UserStatus } from "@/types/user";
import styles from "./UserDetails.module.scss";
import backIcon from "@/assets/icons/back-icon.svg";
const TABS = ["General Details", "Documents", "Bank Details", "Loans", "Savings", "App and System"];

function formatCurrency(value: number): string {
  return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function initialOf(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

function slugOf(tab: string): string {
  return tab.toLowerCase().replace(/\s+/g, "-");
}

type LoadStatus = "loading" | "success" | "error" | "not-found";

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const nextIndex = (index + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(TABS.length - 1);
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      setStatus("not-found");
      return;
    }

    const stored = localStorage.getItem(`lendsqr_user_${id}`);
    if (stored) {
      setUser(JSON.parse(stored) as User);
      setStatus("success");
      return;
    }

    setStatus("loading");
    getUserById(id)
      .then((found) => {
        if (cancelled) return;
        if (found) {
          setUser(found);
          setStatus("success");
          localStorage.setItem(`lendsqr_user_${id}`, JSON.stringify(found));
        } else {
          setStatus("not-found");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleStatusChange(nextStatus: UserStatus) {
    if (!user) return;
    const updated = await updateUserStatus(user.id, nextStatus);
    if (updated) {
      const next = { ...user, status: nextStatus };
      setUser(next);
      localStorage.setItem(`lendsqr_user_${user.id}`, JSON.stringify(next));
    }
  }

  if (status === "loading") {
    return <p>Loading…</p>;
  }

  if (status === "error") {
    return (
      <div className={styles.notFound} role="alert">
        <p>Something went wrong while loading this user.</p>
        <Link to="/users">Back to Users</Link>
      </div>
    );
  }

  if (status === "not-found" || !user) {
    return (
      <div className={styles.notFound}>
        <p>User not found.</p>
        <Link to="/users">Back to Users</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/users" className={styles.backLink}>
        <img src={backIcon} alt=""  />
        Back to Users
      </Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>User Details</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.blacklistButton}
            onClick={() => handleStatusChange("blacklisted")}
          >
            Blacklist User
          </button>
          <button type="button" className={styles.activateButton} onClick={() => handleStatusChange("active")}>
            Activate User
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.summary}>
          <div className={styles.identity}>
            <span className={styles.avatar} aria-hidden="true">
              {initialOf(user.profile.firstName)}
            </span>
            <div>
              <p className={styles.name}>{user.profile.firstName} {user.profile.lastName}</p>
              <p className={styles.username}>{user.id}</p>
            </div>
          </div>

          <div className={styles.tier}>
            <p className={styles.tierLabel}>User's Tier</p>
            <div className={styles.stars}>
              {Array.from({ length: 3 }, (_, index) => index + 1).map((star) => (
                <span key={star} className={star <= user.tier ? styles.starFilled : styles.starEmpty}>
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className={styles.balance}>
            <p className={styles.balanceValue}>{formatCurrency(user.accountBalance)}</p>
            <p className={styles.balanceAccount}>
              {user.accountNumber}/{user.bankName}
            </p>
          </div>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="User detail sections">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${slugOf(tab)}`}
              aria-controls={`tabpanel-${slugOf(tab)}`}
              aria-selected={tab === activeTab}
              tabIndex={tab === activeTab ? 0 : -1}
              className={tab === activeTab ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "General Details" ? (
        <div
          className={styles.detailsCard}
          role="tabpanel"
          id={`tabpanel-${slugOf(activeTab)}`}
          aria-labelledby={`tab-${slugOf(activeTab)}`}
          tabIndex={0}
        >
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Full Name</p>
                <p className={styles.fieldValue}>{user.profile.firstName} {user.profile.lastName}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Phone Number</p>
                <p className={styles.fieldValue}>{user.phoneNumber}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Email Address</p>
                <p className={styles.fieldValue}>{user.email}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>BVN</p>
                <p className={styles.fieldValue}>{user.profile.bvn}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Gender</p>
                <p className={styles.fieldValue}>{user.profile.gender}</p>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Marital Status</p>
                <p className={styles.fieldValue}>{user.profile.maritalStatus}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Children</p>
                <p className={styles.fieldValue}>{user.profile.children}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Type of Residence</p>
                <p className={styles.fieldValue}>{user.profile.typeOfResidence}</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education and Employment</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Level of Education</p>
                <p className={styles.fieldValue}>{user.education.level}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Employment Status</p>
                <p className={styles.fieldValue}>{user.education.employmentStatus}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Sector of Employment</p>
                <p className={styles.fieldValue}>{user.education.sector}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Duration of Employment</p>
                <p className={styles.fieldValue}>{user.education.durationOfEmployment}</p>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Office Email</p>
                <p className={styles.fieldValue}>{user.education.officeEmail}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Monthly Income</p>
                <p className={styles.fieldValue}>
                  {formatCurrency(user.education.monthlyIncome[0])}- {formatCurrency(user.education.monthlyIncome[1])}
                </p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Loan Repayment</p>
                <p className={styles.fieldValue}>{user.education.loanRepayment.toLocaleString()}</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Socials</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Twitter</p>
                <p className={styles.fieldValue}>{user.socials.twitter}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Facebook</p>
                <p className={styles.fieldValue}>{user.socials.facebook}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>Instagram</p>
                <p className={styles.fieldValue}>{user.socials.instagram}</p>
              </div>
            </div>
          </section>

          <section className={styles.sectionLast}>
            <h2 className={styles.sectionTitle}>Guarantor</h2>
            <div className={styles.guarantorContainer}>
            {user.guarantors.map((guarantor, index) => (
              <div className={styles.guarantorFieldGrid} key={`${guarantor.fullName}-${index}`}>
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Full Name</p>
                  <p className={styles.fieldValue}>{guarantor.fullName}</p>
                </div>
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Phone Number</p>
                  <p className={styles.fieldValue}>{guarantor.phoneNumber}</p>
                </div>
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Email Address</p>
                  <p className={styles.fieldValue}>{guarantor.email}</p>
                </div>
                <div className={styles.field}>
                  <p className={styles.fieldLabel}>Relationship</p>
                  <p className={styles.fieldValue}>{guarantor.relationship}</p>
                </div>
              </div>
            ))}
            </div>
           
          </section>
        </div>
      ) : (
        <div
          className={styles.detailsCard}
          role="tabpanel"
          id={`tabpanel-${slugOf(activeTab)}`}
          aria-labelledby={`tab-${slugOf(activeTab)}`}
          tabIndex={0}
        >
          <p className={styles.placeholder}>No {activeTab.toLowerCase()} information available yet.</p>
        </div>
      )}
    </div>
  );
}
