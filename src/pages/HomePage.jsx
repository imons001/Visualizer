import { lessons } from "../data/lessons";
import LessonCard from "../components/LessonCard";
import "../styles/home.css";

export default function HomePage({ onNavigate }) {
  return (
    <div className="home">
      <h1 className="home-title">Neon Nodes<em></em><br />step by step</h1>
      <div className="card-grid">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() => onNavigate(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}