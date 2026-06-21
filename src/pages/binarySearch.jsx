import { useState } from "react";
import { initialArray, target, STEPS } from "../data/binarySearch";
import "../styles/binary.css";

export default function BinarySearchPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const explanation =
    current.action === "found"
      ? "Found the target at the middle index!"
      : current.action === "move_left"
      ? "The middle value is less than the target, so we can move the left pointer up to mid + 1."
      : "The middle value is greater than the target, so we can move the right pointer down to mid - 1.";

  const statusMsg =
    current.action === "found"
      ? `Found! ${initialArray[current.mid]} = ${target}`
      : current.action === "move_left"
      ? `Middle value ${initialArray[current.mid]} < ${target} — move left pointer up →`
      : `Middle value ${initialArray[current.mid]} > ${target} — move right pointer down ←`;

  return (
    <div className="app">
      <div className="header">
        <h1 className="binary-title">Binary Search Visualizer</h1>
        <div className="deco">
          <span /><span /><span />
        </div>
        <p className="subtitle">
          Find the index of <strong>{target}</strong>
        </p>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="array-wrap">
        {initialArray.map((val, i) => {
          const isMid = i === current.mid;
          const isLeft = i === current.left;
          const isRight = i === current.right;
          const inRange = i >= current.left && i <= current.right;

          const cellClass =
            isMid && current.action === "found" ? "cell cell-found" :
            isMid ? "cell cell-left" :
            inRange ? "cell cell-default" :
            "cell cell-out";

          return (
            <div className="cell-wrap" key={i}>
              <div className={cellClass}>{val}</div>
              <div className={`pointer-label ${isMid ? "label-left" : isRight ? "label-right" : "label-none"}`}>
                {isMid ? "🔺 M" : isRight ? "🔻 R" : isLeft ? "🔺 L" : "·"}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`explanation-card card-${current.action}`}>
        {explanation}
      </div>

      <div className="status-wrap">
        <div className={`status-pill pill-${current.action}`}>
          {statusMsg}
        </div>
      </div>

      <div className="controls">
        <button onClick={reset} className="btn btn-reset">↺ Reset</button>
        <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous</button>
        <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next →</button>
      </div>

      <div className="step-info">
        <div className="step-count">Step {step + 1} of {STEPS.length}</div>
      </div>

      {onBack && (
        <div className="btn-back-wrap">
          <button onClick={onBack} className="btn btn-back">← Back</button>
        </div>
      )}
    </div>
  );
}
