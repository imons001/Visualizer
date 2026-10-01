import { useState } from "react";
import "../styles/linkedList.css";
import {
  nodes, listValues,
  STEPS, getExplanation,
  SINGLY_STEPS, getSinglyExplanation,
  DOUBLY_STEPS, getDoublyExplanation,
} from "../data/linkedList.js";

const MODES = {
  singly:   { title: "Singly Linked List",      steps: SINGLY_STEPS },
  doubly:   { title: "Doubly Linked List",      steps: DOUBLY_STEPS },
  reversal: { title: "Reversing a Linked List", steps: STEPS },
};

export default function LinkedListPage({ onBack }) {
  const [mode, setMode] = useState("singly");
  const [step, setStep] = useState(0);

  const activeSteps = MODES[mode].steps;
  const current = activeSteps[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(activeSteps.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const switchTo = (m) => { setMode(m); setStep(0); };
  const progressPct = ((step + 1) / activeSteps.length) * 100;

  // ── 1. Singly ──
  const renderSingly = () => (
    <>
      <div className="list-wrap">
        {listValues.map((val, i) => {
          const isCurr = val === current.curr;
          const nodeClass = isCurr ? "node node-current"
            : current.visited.includes(val) ? "node node-visited"
            : "node node-default";
          return (
            <div key={val} className="node-wrap">
              <div className="node-col">
                <div className={nodeClass}>{val}</div>
                <div className="node-label">{isCurr ? "curr" : i === 0 ? "head" : ""}</div>
              </div>
              <span className={`arrow ${isCurr ? "arrow-right" : "arrow-right-default"}`}>→</span>
            </div>
          );
        })}
        <div className="null-col">
          <span className="node-label-null">null</span>
          <div className="node-label">{current.curr === null ? "curr" : ""}</div>
        </div>
      </div>
      <div className="explanation-card">{getSinglyExplanation(current)}</div>
    </>
  );

  // ── 2. Doubly ──
  const renderDoubly = () => (
    <>
      <div className="list-wrap">
        <div className="node-wrap">
          <span className="node-label-null">null</span>
          <span className={`arrow ${current.direction === "backward" ? "arrow-left" : "arrow-right-default"}`}>←</span>
        </div>
        {listValues.map((val, i) => {
          const nodeClass =
            val === current.curr ? "node node-current" :
            val === current.prev ? "node node-prev" :
            val === current.next ? "node node-next" : "node node-default";
          const label =
            val === current.curr ? "curr" :
            val === current.prev ? "prev" :
            val === current.next ? "next" : "";
          return (
            <div key={val} className="node-wrap">
              <div className="node-col">
                <div className={nodeClass}>{val}</div>
                <div className="node-label">{label}</div>
              </div>
              {i < listValues.length - 1 ? (
                <span className={`arrow-double dir-${current.direction}`}>
                  <span className="dbl-next">→</span>
                  <span className="dbl-prev">←</span>
                </span>
              ) : (
                <span className={`arrow ${current.direction === "forward" ? "arrow-right" : "arrow-right-default"}`}>→</span>
              )}
            </div>
          );
        })}
        <span className="node-label-null">null</span>
      </div>
      <div className="explanation-card">{getDoublyExplanation(current)}</div>
    </>
  );

  // ── 3. Reversal (your original markup) ──
  const renderReversal = () => {
    const getNodeClass = (val) => {
      if (current.reversed.includes(val)) return "node node-reversed";
      if (val === current.curr) return "node node-current";
      if (val === current.prev) return "node node-prev";
      if (val === current.next) return "node node-next";
      return "node node-default";
    };
    const getConnector = (val) => {
      if (current.action === "point" && val === current.curr) return <span className="arrow arrow-severed">✕</span>;
      if (current.reversed.includes(val)) return <span className="arrow arrow-left">←</span>;
      return <span className="arrow arrow-right-default">→</span>;
    };
    const prevIsNull = current.prev == null;

    return (
      <>
        <div className="list-wrap">
          <div className="node-wrap">
            <div className="null-col">
              <span className="node-label-null">null</span>
              <div className="node-label">{prevIsNull ? "prev" : ""}</div>
            </div>
            {(current.action === "point" || !prevIsNull) && <span className="arrow arrow-left">←</span>}
          </div>
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

        <div className="explanation-card">{getExplanation(current.action)}</div>

        {current.reversed.length > 0 && (
          <div className="output-wrap">
            <p className="output-label">Output:</p>
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
      </>
    );
  };

  return (
    <div className="page-nav">
      <div className="card">
        <div className="ll-card">
          <p className="visualizer">{MODES[mode].title}</p>
          <div className="deco"><span /><span /><span /></div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          {mode === "singly" && renderSingly()}
          {mode === "doubly" && renderDoubly()}
          {mode === "reversal" && renderReversal()}

          <div className="controls">
            <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
            <button onClick={reset} className="btn btn-reset">↺ Reset</button>
            <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
            <button onClick={goNext} disabled={step === activeSteps.length - 1} className="btn btn-next">Next Step →</button>

            {mode === "singly" && (
              <button onClick={() => switchTo("doubly")} className="btn btn-switch">Switch to Doubly →</button>
            )}
            {mode === "doubly" && (
              <>
                <button onClick={() => switchTo("singly")} className="btn btn-switch">← Singly</button>
                <button onClick={() => switchTo("reversal")} className="btn btn-switch">Switch to Reversal →</button>
              </>
            )}
            {mode === "reversal" && (
              <button onClick={() => switchTo("doubly")} className="btn btn-switch">← Switch to Doubly</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}