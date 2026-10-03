import { useState } from "react";
import "../styles/slidingWindow.css";
import {
  initialArray, STEPS, FIXED_CODE,
  dynamicArray, DYNAMIC_STEPS, DYNAMIC_CODE,
  getExplanation,
} from "../data/slidingWindow";

const KEYWORDS = /\b(def|for|in|range|len|if|while|return|None)\b/;

// light syntax coloring: split on keywords, wrap them in a span
const highlight = (line) =>
  line.split(KEYWORDS).map((part, i) =>
    i % 2 ? <span key={i} className="sw-kw">{part}</span> : part
  );

function CodePanel({ file, code, lines }) {
  return (
    <div className="sw-code">
      <div className="sw-code-head">{file}</div>
      <pre className="sw-code-body">
        {code.map((line, i) => (
          <div
            key={i}
            className={`sw-code-line ${lines.includes(i + 1) ? "sw-code-line-active" : ""}`}
          >
            <span className="sw-line-no">{i + 1}</span>
            <span className="sw-line-text">{highlight(line)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

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

  const renderArray = () => (
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
  );

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

            {renderArray()}

            <div className="explanation-card">
              {getExplanation(current)}
            </div>

            <CodePanel file="fixed window python" code={FIXED_CODE} lines={current.lines} />

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
                Switch to Dynamic
              </button>
            </div>

            <p className="sw-step-count">Step {step + 1} of {activeSteps.length}</p>
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

            {renderArray()}

            <div className="dynamic-explanation-card">
              {getExplanation(current)}
            </div>

            <CodePanel file="dynamic window python" code={DYNAMIC_CODE} lines={current.lines} />

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
                Previous Step
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
                Switch to Fixed
              </button>
            </div>

            <p className="sw-step-count">Step {step + 1} of {activeSteps.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}