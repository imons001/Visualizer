import { useState } from "react";
import "../styles/Graph.css";
import { nodes, edges, pythonCode, STEPS, getExplanation } from "../data/Graph.js";

const R = 22; // node radius
const KEYWORDS = /\b(from|import|def|while|for|in|if|not|return)\b/;

// light syntax coloring: split on keywords, wrap them in a span
const highlight = (line) =>
  line.split(KEYWORDS).map((part, i) =>
    i % 2 ? <span key={i} className="gr-kw">{part}</span> : part
  );

const sameEdge = (e, a, b) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a);

export default function GraphPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const getNodeClass = (id) => {
    if (id === current.current) return "gr-node gr-node-current";
    if (id === current.neighbor) return "gr-node gr-node-neighbor";
    if (current.order.includes(id)) return "gr-node gr-node-done";
    if (current.queue.includes(id)) return "gr-node gr-node-queued";
    return "gr-node gr-node-default";
  };

  const getEdgeClass = ([a, b]) => {
    if (current.neighbor && sameEdge([a, b], current.current, current.neighbor))
      return current.action === "enqueue" ? "gr-edge gr-edge-active" : "gr-edge gr-edge-checked";
    if (current.treeEdges.some((e) => sameEdge(e, a, b))) return "gr-edge gr-edge-tree";
    return "gr-edge";
  };

  // shorten each line so it starts/ends at the circle's edge
  const renderEdge = ([a, b]) => {
    const p = pos[a], q = pos[b];
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    const ux = (q.x - p.x) / len, uy = (q.y - p.y) / len;
    return (
      <line
        key={a + b}
        className={getEdgeClass([a, b])}
        x1={p.x + ux * R} y1={p.y + uy * R}
        x2={q.x - ux * R} y2={q.y - uy * R}
      />
    );
  };

  const renderNode = ({ id, x, y }) => {
    const label = id === current.current ? "node" : id === current.neighbor ? "neighbor" : null;
    return (
      <g key={id} className={getNodeClass(id)}>
        <circle cx={x} cy={y} r={R} />
        <text className="gr-node-text" x={x} y={y}>{id}</text>
        {label && <text className="gr-node-label" x={x} y={y + 36}>{label}</text>}
      </g>
    );
  };

  const renderChips = (list, kind) =>
    list.length ? (
      list.map((v, i) => (
        <div key={v} className="gr-chip-wrap">
          <div className={`gr-chip gr-chip-${kind}`}>{v}</div>
          {kind === "order" && i < list.length - 1 && <span className="gr-chip-arrow">→</span>}
        </div>
      ))
    ) : (
      <span className="gr-empty">empty</span>
    );

  return (
    <div className="gr-page-nav">
      <div className="gr-card">
        <div className="graph-card">
          <p className="gr-visualizer">Breadth First Search on a Graph</p>
          <div className="deco"><span /><span /><span /></div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="gr-graph-wrap">
            <svg width="560" height="300">
              {edges.map(renderEdge)}
              {nodes.map(renderNode)}
            </svg>
          </div>

          <p className={`gr-explain gr-explain-${current.action}`}>{getExplanation(current)}</p>

          <div className="gr-state">
            <div className="gr-state-box">
              <p className="gr-state-label">Queue <span>front / back</span></p>
              <div className="gr-state-row">{renderChips(current.queue, "queue")}</div>
            </div>
            <div className="gr-state-box">
              <p className="gr-state-label">Visit order</p>
              <div className="gr-state-row">{renderChips(current.order, "order")}</div>
            </div>
          </div>

          <div className="gr-code">
            <div className="gr-code-head">code</div>
            <pre className="gr-code-body">
              {pythonCode.map((line, i) => {
                const active = current.lines.includes(i + 1);
                return (
                  <div key={i} className={`gr-code-line ${active ? "gr-code-line-active" : ""}`}>
                    <span className="gr-line-no">{i + 1}</span>
                    <span className="gr-line-text">{line ? highlight(line) : " "}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        <div className="controls">
          <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
          <button onClick={reset} className="btn btn-reset">↺ Reset</button>
          <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
          <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
        </div>
        <p className="gr-step-count">Step {step + 1} of {STEPS.length}</p>
      </div>
    </div>
  );
}