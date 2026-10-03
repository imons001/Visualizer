import { useState } from "react";
import "../styles/fastSlow.css";
import { pythonCode, STEPS, getExplanation } from "../data/fastSlow.js";

const KEYWORDS = /\b(def|while|and|if|return|True|False)\b/;

// light syntax coloring: split on keywords, wrap them in a span
const highlight = (line) =>
  line.split(KEYWORDS).map((part, i) =>
    i % 2 ? <span key={i} className="fs-kw">{part}</span> : part
  );

const NODES = [
  { val: 0, cx: 80,  cy: 190 },
  { val: 1, cx: 200, cy: 190 },
  { val: 2, cx: 320, cy: 190 },
  { val: 3, cx: 420, cy: 75  },
  { val: 4, cx: 520, cy: 190 },
  { val: 5, cx: 420, cy: 305 },
];

export default function FastSlowPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const renderNode = ({ val, cx, cy }) => {
    const isSlow = val === current.slow;
    const isFast = val === current.fast;
    const state =
      isSlow && isFast ? (current.action === "found" || current.gap === 0 ? "meet" : "both") :
      isSlow ? "slow" : isFast ? "fast" : "default";
    const labelText = state === "meet" ? "slow = fast" : state === "both" ? "slow, fast" : isSlow ? "slow" : isFast ? "fast" : null;

    return (
      <g key={val} className={`fs-node fs-node-${state}`}>
        <circle cx={cx} cy={cy} r={22} />
        <text className="fs-node-text" x={cx} y={cy}>{val}</text>
        {labelText && <text className="fs-node-label" x={cx} y={cy + 34}>{labelText}</text>}
      </g>
    );
  };

  return (
    <div className="fs-page-nav">
      <div className="fs-card">
        <div className="fast-slow-card">
          <p className="fs-visualizer">Fast and Slow Pointer Cycle Detection</p>
          <div className="deco"><span /><span /><span /></div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="fs-cycle-wrap">
            <svg width="620" height="380">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </marker>
              </defs>

              {/* Tail: 0 → 1 → 2 */}
              <line x1="102" y1="190" x2="178" y2="190" className="fs-edge" markerEnd="url(#arrow)"/>
              <line x1="222" y1="190" x2="298" y2="190" className="fs-edge" markerEnd="url(#arrow)"/>

              {/* Cycle: 2 → 3 → 4 → 5 → 2 */}
              <path d="M 332 174 Q 358 95 407 77" className="fs-edge" markerEnd="url(#arrow)"/>
              <path d="M 433 77 Q 482 95 510 174" className="fs-edge" markerEnd="url(#arrow)"/>
              <path d="M 510 206 Q 482 285 433 303" className="fs-edge" markerEnd="url(#arrow)"/>
              <path d="M 407 303 Q 358 285 330 206" className="fs-edge" markerEnd="url(#arrow)"/>

              {NODES.map(renderNode)}
            </svg>
          </div>

          <div className="explanation-card">
            <p className="explanation">{getExplanation(current)}</p>
          </div>

          <div className="fs-code">
            <div className="fs-code-head">has cycle in python</div>
            <pre className="fs-code-body">
              {pythonCode.map((line, i) => (
                <div
                  key={i}
                  className={`fs-code-line ${current.lines.includes(i + 1) ? "fs-code-line-active" : ""}`}
                >
                  <span className="fs-line-no">{i + 1}</span>
                  <span className="fs-line-text">{highlight(line)}</span>
                </div>
              ))}
            </pre>
          </div>

          <div className="controls">
            <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
            <button onClick={reset} className="btn btn-reset">↺ Reset</button>
            <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
            <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
          </div>

          <p className="fs-step-count">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>
    </div>
  );
}