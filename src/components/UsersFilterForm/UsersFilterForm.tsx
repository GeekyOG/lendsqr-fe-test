import { forwardRef, type FormEvent } from "react";
import type { UserStatus } from "@/types/user";
import type { FilterFormState } from "./filterFormState";
import styles from "./UsersFilterForm.module.scss";

const STATUS_OPTIONS: UserStatus[] = ["active", "inactive", "pending", "blacklisted"];

interface UsersFilterFormProps {
  organizations: string[];
  value: FilterFormState;
  onChange: (value: FilterFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

const UsersFilterForm = forwardRef<HTMLFormElement, UsersFilterFormProps>(function UsersFilterForm(
  { organizations, value, onChange, onSubmit, onReset },
  ref,
) {
  return (
    <form ref={ref} className={styles.filterPanel} onSubmit={onSubmit}>
      <div className={styles.filterField}>
        <label htmlFor="filter-organization">Organization</label>
        <select
          id="filter-organization"
          value={value.organization}
          onChange={(e) => onChange({ ...value, organization: e.target.value })}
        >
          <option value="">Select</option>
          {organizations.map((organization) => (
            <option key={organization} value={organization}>
              {organization}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-username">Username</label>
        <input
          id="filter-username"
          value={value.username}
          onChange={(e) => onChange({ ...value, username: e.target.value })}
          placeholder="User"
        />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-email">Email</label>
        <input
          id="filter-email"
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          placeholder="Email"
        />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-date">Date</label>
        <input
          id="filter-date"
          type="date"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
        />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-phone">Phone Number</label>
        <input
          id="filter-phone"
          value={value.phoneNumber}
          onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
          placeholder="Phone Number"
        />
      </div>
      <div className={styles.filterField}>
        <label htmlFor="filter-status">Status</label>
        <select
          id="filter-status"
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as UserStatus | "" })}
        >
          <option value="">Select</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterActions}>
        <button type="button" className={styles.resetButton} onClick={onReset}>
          Reset
        </button>
        <button type="submit" className={styles.applyButton} aria-label="Apply filters">
          Filter
        </button>
      </div>
    </form>
  );
});

export default UsersFilterForm;
