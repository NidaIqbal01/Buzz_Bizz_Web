
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  detail?: string;
  icon: ReactNode;
  tone?: "olive" | "gold" | "rose" | "peach";
};

export default function StatCard({
  label, value, detail, icon, tone = "olive",
}: Props) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}
