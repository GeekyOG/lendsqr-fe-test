import type { UserStatus } from "@/types/user";
import styles from "./StatusPill.module.scss";

const LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  blacklisted: "Blacklisted",
};

interface StatusPillProps {
  status: UserStatus;
}

export default function StatusPill({ status }: StatusPillProps) {
  return <span className={`${styles.pill} ${styles[status]}`}>{LABELS[status]}</span>;
}
