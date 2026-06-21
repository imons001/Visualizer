import { useState } from "react";
import { initialArray, target, STEPS, getExplanation } from "../data/twoPointerSteps";
import "../styles/twoPointer.css";

export default function TwoPointerPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="app">
      <div className="header">
        <h1 className="twopointer-title">Two Pointer Visualizer</h1>
        <div className="deco">
          <span /><span /><span />
        </div>
        <p className="subtitle">
          Find two numbers that sum to <strong>{target}</strong>
        </p>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="array-wrap">
        {initialArray.map((val, i) => {
          const isLeft = i === current.left;
          const isRight = i === current.right;
          const cellClass =
            isLeft && current.action === "found" ? "cell cell-found" :
            isRight && current.action === "found" ? "cell cell-found" :
            isLeft ? "cell cell-left" :
            isRight ? "cell cell-right" :
            "cell cell-default";

          return (
            <div className="cell-wrap" key={i}>
              <div className={cellClass}>{val}</div>
              <div className={`pointer-label ${isLeft ? "label-left" : isRight ? "label-right" : "label-none"}`}>
                {isLeft ? "🔺 L" : isRight ? "R 🔺" : "·"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="explanation-card">
        {getExplanation(current.action)}
      </div>

      <div className="controls">
        <button onClick={reset} className="btn btn-reset">↺ Reset</button>
        <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
        <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
      </div>

      <div className="step-info">
        <div className="step-count">Step {step + 1} of {STEPS.length}</div>
        <div className="step-details">
          <div className="step-detail-item">Left index: <strong>{current.left}</strong> (value {initialArray[current.left]})</div>
          <span className="dot-sep">·</span>
          <div className="step-detail-item">Right index: <strong>{current.right}</strong> (value {initialArray[current.right]})</div>
          <span className="dot-sep">·</span>
          <div className="step-detail-item">Sum: <strong>{current.sum}</strong></div>
        </div>
      </div>

      {onBack && (
        <div className="btn-back-wrap">
          <button onClick={onBack} className="btn btn-back">← Back</button>
        </div>
      )}
    </div>
  );
}