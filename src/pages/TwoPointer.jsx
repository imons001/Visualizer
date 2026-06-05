import { useState } from "react";
import { initialArray, target, STEPS } from "../data/twoPointerSteps";
import "../styles/twoPointer.css";

export default function TwoPointerPage({ onBack }) {
  // Track which step we are currently showing
  const [step, setStep] = useState(0);

  // Get the data for the current step
  const current = STEPS[step];

  // Go back to the first step
  const reset = () => setStep(0);

  // Go forward one step, but do not go past the end
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  // Go back one step, but do not go below 0
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  // Show or hide the deeper explanation
  const [showExplanation, setShowExplanation] = useState(false);

  // Choose the short explanation based on the current action
  // ? : condition if true : condition if false
  const explanation =
    current.action === "found"
      ? "Both pointers found the target sum —> the search is complete"
      : current.action === "move_left"
      ? "The sum is too small. Since the array is sorted, nudging the left pointer right gives us a bigger number."
      : "The sum is too big. Since the array is sorted, nudging the right pointer left gives us a smaller number.";

  // Choose the status message based on the current action
  const statusMsg =
    current.action === "found"
      ? `Found! ${initialArray[current.left]} + ${initialArray[current.right]} = ${target}`
      : current.action === "move_left"
      ? `Sum ${current.sum} < ${target} — move left pointer right →`
      : `Sum ${current.sum} > ${target} — move right pointer left ←`;

  // Calculate how full the progress bar should be
  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">Two Pointer Visualizer</h1>

        <div className="deco">
          <span />
          <span />
          <span />
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
          // Check if this box is the left pointer
          const isLeft = i === current.left;

          // Check if this box is the right pointer
          const isRight = i === current.right;

          // Pick the color/style for each number box
          const cellClass =
            (isLeft || isRight) && current.action === "found"
              ? "cell cell-found"
              : isLeft
              ? "cell cell-left"
              : isRight
              ? "cell cell-right"
              : "cell cell-default";

          return (
            <div className="cell-wrap" key={i}>
              <div className={cellClass}>{val}</div>

              <div
                className={`pointer-label ${
                  isLeft ? "label-left" : isRight ? "label-right" : "label-none"
                }`}
              >
                {isLeft ? "🔺 L" : isRight ? "R🔺 " : "·"}
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
        <button onClick={reset} className="btn btn-reset">
          ↺ Reset
        </button>

        <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">
          ← Previous Step
        </button>

        <button
          onClick={goNext}
          disabled={step === STEPS.length - 1}
          className="btn btn-next"
        >
          Next Step →
        </button>
      </div>

      <div className="step-info">
        <div className="step-count">
          Step {step + 1} of {STEPS.length}
        </div>

        <div className="step-details">
          <div className="step-detail-item">
            Left index: <strong>{current.left}</strong>&nbsp;(value{" "}
            {initialArray[current.left]})
          </div>

          <span className="dot-sep">·</span>

          <div className="step-detail-item">
            Right index: <strong>{current.right}</strong>&nbsp;(value{" "}
            {initialArray[current.right]})
          </div>

          <span className="dot-sep">·</span>

          <div className="step-detail-item">
            Sum: <strong>{current.sum}</strong>
          </div>
        </div>

        <div className="deep-explanation">
          <button onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>

          {showExplanation && (
            <div className="info-row">
              <span className="info-tag">Why?</span>

              <p>
                {current.action === "found"
                  ? "When both pointers point to numbers that sum to the target, we've found our answer and can stop searching."
                  : current.action === "move_left"
                  ? "The sum of the values at the pointers is less than the target, so we move the left pointer to the right to increase the sum."
                  : "The sum of the values at the pointers is greater than the target, so we move the right pointer to the left to decrease the sum."}
              </p>
            </div>
          )}
        </div>

        {onBack && (
          <div className="btn-back-wrap">
            <button onClick={onBack} className="btn btn-back">
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}