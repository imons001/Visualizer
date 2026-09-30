import { useState } from "react";
import "../styles/linkedList.css";
import { nodes, STEPS, getExplanation } from "../data/linkedList.js";

export default function LinkedListPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const getNodeClass = (val) => {
    if (current.reversed.includes(val)) return "node node-reversed";
    if (val === current.curr) return "node node-current";
    if (val === current.prev) return "node node-prev";
    if (val === current.next) return "node node-next";
    return "node node-default";
  };

  // returns the connector element to render between node[i] and node[i+1]
  const getConnector = (val) => {
    // "point" step: curr's link to the next node is severed — show ✕
    if (current.action === "point" && val === current.curr) {
      return <span className="arrow arrow-severed">✕</span>;
    }
    // already reversed nodes point left
    if (current.reversed.includes(val)) {
      return <span className="arrow arrow-left">←</span>;
    }
    // everything else still points right
    return <span className="arrow arrow-right-default">→</span>;
  };

  // prev starts as null, so on the first few steps prev === undefined/null
  // we show "prev ↓" floating above the left null sentinel
  const prevIsNull = current.prev == null;

  return (
    <div className="page-nav">
      <div className="card">
        <div className="reversal-card">
          <p className="visualizer">Reversing a Linked List</p>
          <div className="deco"><span /><span /><span /></div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="list-wrap">

{/* left null — prev starts here */}
<div className="node-wrap">
  <div className="null-col">
    {prevIsNull && (
      <div className="prev-above-null">
        <span className="pointer-tag">prev</span>
        <span className="pointer-down-arrow">↓</span>
      </div>
    )}

    <span className="node-label-null">null</span>
  </div>

  {(current.action === "point" || !prevIsNull) && (
    <span className="arrow arrow-left">←</span>
  )}
</div>

            {/* nodes */}
            {nodes.map((node, i) => (
              <div key={node.id} className="node-wrap">
                <div className="node-col">
                  <div className={getNodeClass(node.value)}>{node.value}</div>
                  <div className="node-label">
                    {node.value === current.curr ? "curr" :
                     node.value === current.prev ? "prev" :
                     node.value === current.next ? "next" : ""}
                  </div>
                </div>
                {i < nodes.length - 1 && getConnector(node.value)}
              </div>
            ))}



          </div>

          <div className="explanation-card">
            {getExplanation(current.action)}
          </div>

          {current.reversed.length > 0 && (
            <div className="output-wrap">
              <p className="output-label">OUTPUT:</p>
              <div className="output-row">
                {[...current.reversed].reverse().map((val, i, arr) => (
                  <div key={val} className="node-wrap">
                    <div className="node node-output">{val}</div>
                    {i < arr.length - 1 && <span className="arrow arrow-output">→</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="controls">
          <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
          <button onClick={reset} className="btn btn-reset">↺ Reset</button>
          <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
          <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
        </div>
      </div>
    </div>
  );
}