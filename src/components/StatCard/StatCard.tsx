import type { ReactNode } from "react";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  icon: ReactNode;
  iconBackground: string;
  label: string;
  value: number;
}

export default function StatCard({ icon, iconBackground, label, value }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: iconBackground }}>
        {icon}
      </div>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value.toLocaleString()}</p>
    </div>
  );
}
