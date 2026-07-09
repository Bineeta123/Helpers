import "./SummaryCard.css";

type SummaryCardProps = {
  title: string;
  value: number;
};

export default function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}