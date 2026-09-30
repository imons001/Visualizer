import { useState } from "react";
import { bucketCount, STEPS, getExplanation } from "../data/dictionary.js";
import "../styles/dictionary.css";

export default function DictionaryPage({ onBack }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const progressPct = ((step + 1) / STEPS.length) * 100;

  const { entry, action } = current;
  const showMod = action !== "hash";                          // second arrow appears after the hash step
  const placed = action === "insert" || action === "collision"; // entry has moved into its bucket

  const getEntryClass = (b, e) =>
    placed && b === current.index && e.key === entry.key
      ? `hm-entry hm-entry-${action}`
      : "hm-entry hm-entry-default";

  return (
    <div className="app">
      <div className="header">
        <h1 className="hashmap-title">Hash Map Visualizer</h1>
        <div className="deco">
          <span /><span /><span />
        </div>
        <p className="subtitle">Hash each key, then drop it into its bucket</p>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* top: the current key and its hash math */}
      <div className="hash-pipeline">
        <div className={placed ? "hm-entry hm-entry-placed" : "hm-entry hm-entry-current"}>
          {entry.key}: {entry.value}
        </div>
        <span className="hm-arrow hm-arrow-active">→</span>
        <div className="hm-chip">hash = {current.hash}</div>
        {showMod && (
          <>
            <span className="hm-arrow hm-arrow-active">→</span>
            <div className="hm-chip">{current.hash} % {bucketCount} = {current.index}</div>
          </>
        )}
      </div>

      {/* left: bucket indexes 0 → length - 1, each pointing to its chain */}
      <div className="bucket-wrap">
        {current.buckets.map((chain, b) => (
          <div className="bucket-row" key={b}>
            <div className={showMod && b === current.index ? "cell cell-bucket-active" : "cell cell-default"}>{b}</div>
            <span className="hm-arrow">→</span>
            {chain.map((e, i) => (
              <div className="chain-item" key={e.key}>
                {i > 0 && <span className="hm-arrow">→</span>}
                <div className={getEntryClass(b, e)}>{e.key}: {e.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="explanation-card">
        {getExplanation(current)}
      </div>

      <div className="controls">
        <button onClick={onBack} className="btn btn-back">← Back to Menu</button>
        <button onClick={reset} className="btn btn-reset">↺ Reset</button>
        <button onClick={goPrev} disabled={step === 0} className="btn btn-prev">← Previous Step</button>
        <button onClick={goNext} disabled={step === STEPS.length - 1} className="btn btn-next">Next Step →</button>
      </div>

      <div className="step-info">
        <div className="step-count">Step {step + 1} of {STEPS.length}</div>
      </div>
    </div>
  );
}