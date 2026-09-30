import { useState } from "react";
import "../styles/fastSlow.css";
import { STEPS, getExplanation } from "../data/fastSlow.js";

export default function FastSlowPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const NODES = [
    { val: 0, cx: 80,  cy: 190 },
    { val: 1, cx: 200, cy: 190 },
    { val: 2, cx: 320, cy: 190 },
    { val: 3, cx: 420, cy: 75  },
    { val: 4, cx: 520, cy: 190 },
    { val: 5, cx: 420, cy: 305 },
  ];

const renderNode = ({ val, cx, cy }) => {
  const isSlow = val === current.slow;
  const isFast = val === current.fast;
  const fill        = isSlow ? "#f0eef8" : isFast ? "#fdf5f8" : "#f5f3f7";
  const stroke      = isSlow ? "#9fa4cf" : isFast ? "#b5547a" : "#d8d4de";
  const strokeWidth = (isSlow || isFast) ? 2 : 1.5;
  const labelColor  = isSlow ? "#9fa4cf" : "#b5547a";
  const labelText   = isSlow ? "slow" : isFast ? "fast" : null;
  const filter      = isSlow ? "drop-shadow(0 0 6px #9fa4cf)" : isFast ? "drop-shadow(0 0 6px #b5547a)" : "none";

  return (
    <g key={val} filter={filter}>
      <circle cx={cx} cy={cy} r={22} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#999" fontSize="14" fontWeight="600">{val}</text>
      {labelText && (
        <text x={cx} y={cy + 34} textAnchor="middle" fill={labelColor} fontSize="11" fontWeight="600">{labelText}</text>
      )}
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

              {/* Tail */}
              <line x1="102" y1="190" x2="178" y2="190" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <line x1="222" y1="190" x2="298" y2="190" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>

              {/* Cycle */}
              <path d="M 332 174 Q 358 95 407 77" fill="none" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <path d="M 433 77 Q 482 95 510 174" fill="none" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <path d="M 510 206 Q 482 285 433 303" fill="none" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>
              <path d="M 407 303 Q 358 285 330 206" fill="none" stroke="#c9c6d0" strokeWidth="1.5" markerEnd="url(#arrow)"/>

              {NODES.map(renderNode)}
            </svg>
          </div>

          <div className="explanation-card">
            <p className="explanation">{getExplanation(current)}</p>
          </div>
          <div className="controls">
            <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
            <button onClick={reset} className="btn btn-reset">↺ Reset</button>
            <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
            <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
          </div>
        </div>
      </div>
    </div>
  );
}