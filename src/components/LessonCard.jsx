export default function LessonCard({ lesson, onClick }) {
  const { name, desc, icon, iconStyle } = lesson;

  return (
    <button className="lesson-card" onClick={onClick}>
      <div className="card-left">
        <div className={`card-icon ${iconStyle !== "pink" ? iconStyle : ""}`}>
          {icon}
        </div>
        <div>
          <div className="card-name">{name}</div>
          <div className="card-desc">{desc}</div>
        </div>
      </div>
      <span className="card-arrow">→</span>
    </button>
  );
}