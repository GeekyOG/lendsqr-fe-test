import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/StatCard/StatCard";
import StatusPill from "@/components/StatusPill/StatusPill";
import Pagination from "@/components/Pagination/Pagination";
import UsersFilterForm from "@/components/UsersFilterForm/UsersFilterForm";
import { EMPTY_FILTER_FORM, type FilterFormState } from "@/components/UsersFilterForm/filterFormState";
import { fetchUsers, getOrganizations, getUserStats, updateUserStatus, type UsersFilters } from "@/services/users";
import type { User, UserStatus } from "@/types/user";
import userFriendsIcon from "@/assets/icons/user-friends.svg";
import activeUsersIcon from "@/assets/icons/active-users.svg";
import usersLoanIcon from "@/assets/icons/users-loans.svg";
import usersSavingsIcon from "@/assets/icons/users-savings.svg";
import styles from "./Users.module.scss";
import filterIcon from "@/assets/icons/filter-icon.svg"

type LoadStatus = "idle" | "loading" | "success" | "error";

const TABLE_HEADERS = ["Organization", "Username", "Email", "Phone Number", "Date Joined", "Status"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Users() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<Awaited<ReturnType<typeof getUserStats>> | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UsersFilters>({});
  const [filterForm, setFilterForm] = useState<FilterFormState>(EMPTY_FILTER_FORM);
  const [isFilterOpen, setFilterOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterFormRef = useRef<HTMLFormElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserStats().then(setStats);
    getOrganizations().then(setOrganizations);
  }, []);

  useEffect(() => {
    if (!isFilterOpen && !openMenuId) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        isFilterOpen &&
        !filterFormRef.current?.contains(target) &&
        !filterButtonRef.current?.contains(target)
      ) {
        setFilterOpen(false);
      }

      if (
        openMenuId &&
        !menuRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, openMenuId]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchUsers({ page, pageSize, filters })
      .then((result) => {
        if (cancelled) return;
        setUsers(result.data);
        setTotal(result.total);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, filters]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned: UsersFilters = {};
    if (filterForm.organization) cleaned.organization = filterForm.organization;
    if (filterForm.username) cleaned.username = filterForm.username;
    if (filterForm.email) cleaned.email = filterForm.email;
    if (filterForm.phoneNumber) cleaned.phoneNumber = filterForm.phoneNumber;
    if (filterForm.date) cleaned.date = filterForm.date;
    if (filterForm.status) cleaned.status = filterForm.status;

    setFilters(cleaned);
    setPage(1);
    setFilterOpen(false);
  }

  function handleFilterReset() {
    setFilterForm(EMPTY_FILTER_FORM);
    setFilters({});
    setPage(1);
    setFilterOpen(false);
  }

  function handleToggleMenu(event: ReactMouseEvent<HTMLButtonElement>, user: User) {
    const cell = event.currentTarget.closest("td") ?? event.currentTarget;
    const rect = cell.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom, right: window.innerWidth - rect.right + 12 });
    setOpenMenuId((current) => (current === user.id ? null : user.id));
  }

  function handleViewDetails(user: User) {
    localStorage.setItem(`lendsqr_user_${user.id}`, JSON.stringify(user));
    setOpenMenuId(null);
    navigate(`/users/${user.id}`);
  }

  async function handleStatusChange(user: User, nextStatus: UserStatus) {
    const updated = await updateUserStatus(user.id, nextStatus);
    if (updated) {
      setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
    }
    setOpenMenuId(null);
  }

  function handleRetry() {
    setStatus("loading");
    fetchUsers({ page, pageSize, filters })
      .then((result) => {
        setUsers(result.data);
        setTotal(result.total);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }

  function handleShowFilter(header: string){
     if( header.toLowerCase()=="organization"){
          setFilterOpen((open) => !open);
      }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      <div className={styles.stats}>
        <StatCard icon={<img src={userFriendsIcon} alt="" />} iconBackground="rgba(223, 24, 255, 0.1)" label="Users" value={stats?.totalUsers ?? 0} />
        <StatCard
          icon={<img src={activeUsersIcon} alt="" />}
          iconBackground="rgba(87, 24, 255, 0.1)"
          label="Active Users"
          value={stats?.activeUsers ?? 0}
        />
        <StatCard
          icon={<img src={usersSavingsIcon} alt="" />}
          iconBackground="rgba(240, 109, 49, 0.1)"
          label="Users with Loans"
          value={stats?.usersWithLoans ?? 0}
        />
        <StatCard
          icon={<img src={usersLoanIcon} alt="" />}
          iconBackground="rgba(255, 51, 102, 0.1)"
          label="Users with Savings"
          value={stats?.usersWithSavings ?? 0}
        />
      </div>

      <div className={styles.tableCard}>
        {isFilterOpen && (
          <UsersFilterForm
            ref={filterFormRef}
            organizations={organizations}
            value={filterForm}
            onChange={setFilterForm}
            onSubmit={handleFilterSubmit}
            onReset={handleFilterReset}
          />
        )}

        {status === "error" && (
          <div className={styles.stateMessage} role="alert">
            <p>Something went wrong while loading users.</p>
            <button type="button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className={styles.stateMessage} aria-live="polite">
            <p>Loading users…</p>
          </div>
        )}

        {status === "success" && users.length === 0 && (
          <div className={styles.stateMessage}>
            <p>No users match your filters.</p>
            <button type="button" onClick={handleFilterReset}>
              Clear filters
            </button>
          </div>
        )}

        {status === "success" && users.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {TABLE_HEADERS.map((header) => (
                    <th scope="col" key={header}>
                      <span className={styles.thContent}>
                        {header}
                        <button
                          ref={filterButtonRef}
                          type="button"
                          className={styles.filterIcon}
                          aria-label="Show filters"
                          aria-expanded={isFilterOpen}
                          onClick={() => 
                            handleShowFilter(header)
                          }
                        >
                          <img src={filterIcon} alt="" />
                        </button>
                      </span>
                    </th>
                  ))}
                  <th scope="col">
                    <span className={styles.visuallyHidden}>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.organization}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <StatusPill status={user.status} />
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        ref={openMenuId === user.id ? menuButtonRef : undefined}
                        type="button"
                        className={styles.menuButton}
                        aria-label={`Actions for ${user.username}`}
                        aria-expanded={openMenuId === user.id}
                        onClick={(event) => handleToggleMenu(event, user)}
                      >
                        <span />
                        <span />
                        <span />
                      </button>

                      {openMenuId === user.id &&
                        menuPosition &&
                        createPortal(
                          <div
                            ref={menuRef}
                            className={styles.menu}
                            role="menu"
                            style={{ top: menuPosition.top, right: menuPosition.right }}
                          >
                            <button type="button" role="menuitem" onClick={() => handleViewDetails(user)}>
                              View Details
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => handleStatusChange(user, "blacklisted")}
                            >
                              Blacklist User
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => handleStatusChange(user, "active")}
                            >
                              Activate User
                            </button>
                          </div>,
                          document.body,
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {status === "success" && users.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}
