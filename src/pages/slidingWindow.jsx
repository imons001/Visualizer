import { useState } from "react";
import "../styles/slidingWindow.css";
import { initialArray, STEPS, getExplanation } from "../data/slidingWindow";
import { dynamicArray, DYNAMIC_STEPS } from "../data/slidingWindow";

export default function SlidingWindowPage({ onBack }) {
  const [mode, setMode] = useState("fixed");
  const [step, setStep] = useState(0);

  const activeArray = mode === "fixed" ? initialArray : dynamicArray;
  const activeSteps = mode === "fixed" ? STEPS : DYNAMIC_STEPS;
  const current = activeSteps[step];

  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(activeSteps.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const progressPct = ((step + 1) / activeSteps.length) * 100;

  const getCellClass = (i) => {
    const inWindow = i >= current.left && i <= current.right;

    if (inWindow && current.action === "found") return "cell cell-found";
    if (inWindow) return "cell cell-in-window";

    return "cell cell-default";
  };

  return (
    <div className="page-nav">
      <div className="card">
        {mode === "fixed" && (
          <div className="fixed-card">
            <p className="fixed-visualizer">Fixed Sliding Window</p>

            <div className="deco">
              <span />
              <span />
              <span />
            </div>

            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

<div className="array-wrap">
  {activeArray.map((val, i) => {
    const inWindow = i >= current.left && i <= current.right;

    const cellClass =
      current.action === "found" && inWindow
        ? "cell cell-found"
        : inWindow
        ? "cell cell-in-window"
        : "cell cell-default";

    return (
      <div className="cell-wrap" key={i}>
        <div className={cellClass}>{val}</div>
      </div>
    );
  })}
</div>

            <div className="explanation-card">
              {getExplanation(current.action)}
            </div>

            <div className="controls">
              <button onClick={onBack} className="btn btn-back">
                ← Back to Menu
              </button>
              <button onClick={reset} className="btn btn-reset">
                ↺ Reset
              </button>
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="btn btn-prev"
              >
                ← Previous Step
              </button>
              <button
                onClick={goNext}
                disabled={step === activeSteps.length - 1}
                className="btn btn-next"
              >
                Next Step →
              </button>
              <button
                onClick={() => {
                  setMode("dynamic");
                  setStep(0);
                }}
                className="btn btn-switch"
              >
                Switch to Dynamic →
              </button>
            </div>
          </div>
        )}

        {mode === "dynamic" && (
          <div className="dynamic-card">
            <p className="dynamic-visualizer">Dynamic Sliding Window</p>

            <div className="deco">
              <span />
              <span />
              <span />
            </div>

            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>

<div className="array-wrap">
  {activeArray.map((val, i) => {
    const inWindow = i >= current.left && i <= current.right;

    const cellClass =
      current.action === "found" && inWindow
        ? "cell cell-found"
        : inWindow
        ? "cell cell-in-window"
        : "cell cell-default";

    return (
      <div className="cell-wrap" key={i}>
        <div className={cellClass}>{val}</div>
      </div>
    );
  })}
</div>

            <div className="dynamic-explanation-card">
              {getExplanation(current.action)}
            </div>

            <div className="controls">
              <button onClick={onBack} className="btn btn-back">
                ← Back to Menu
              </button>
              <button onClick={reset} className="btn btn-reset">
                ↺ Reset
              </button>
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="btn btn-prev"
              >
                ← Previous Step
              </button>
              <button
                onClick={goNext}
                disabled={step === activeSteps.length - 1}
                className="btn btn-next"
              >
                Next Step →
              </button>
              <button
                onClick={() => {
                  setMode("fixed");
                  setStep(0);
                }}
                className="btn btn-switch"
              >
                ← Switch to Fixed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}