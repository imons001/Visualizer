export default function LessonCard({ lesson, onClick }) {
  const { name, desc, icon, iconStyle, status } = lesson;
  const isReady = status === "ready";

  return (
    <button
      className="lesson-card"
      onClick={isReady ? onClick : undefined}
      style={!isReady ? { opacity: 0.6, cursor: "default" } : {}}
    >
      <div className="card-left">
        <div className={`card-icon ${iconStyle !== "pink" ? iconStyle : ""}`}>
          {icon}
        </div>
        <div>
          <div className="card-name">{name}</div>
          <div className="card-desc">{desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isReady ? (
          <>
            <span className="badge">Ready</span>
            <span className="card-arrow">→</span>
          </>
        ) : (
          <span className="badge soon">Soon</span>
        )}
      </div>
    </button>
  );
}