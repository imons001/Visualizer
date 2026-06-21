import {useState} from "react";
import "../styles/linkedList.css";
import { nodes, STEPS, getExplanation } from "../data/linkedList";

export default function LinkedListPage({ onBack }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("Reversal");

  const current = STEPS[step];
  
  const reset = () => setStep(0);
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const progressPct = ((step + 1) / STEPS.length) * 100;
  const getNodeClass = (val) => {
    // if the node is in the reversed portion of the list, color it blue
    if (current.reversed.includes(val)) return "node node-reversed";
    // color based on current, prev, next
    if (val === current.curr) return "node node-current";
    // if the node is the prev node, color it pink
    if (val === current.prev) return "node node-prev";
    // if the node is the next node, color it yellow
    if (val === current.next) return "node node-next";
    return "node node-default";
  };

  //arrow class gotta make arrows 
  const getArrowClass = (val) => {
    // if the node is in the reversed portion of the list, show left arrow
    if (current.reversed.includes(val)) return "arrow arrow-left";
    // if the node is the current node, show right arrow colored
    if (val ===current.curr && current.action === "look") return "arrow arrow-highlight";
    if (val ==current.curr) return "arrow arrow-right";
    //if any other arrow, show right arrow default
    return "arrow arrow-right-default";
  };
    
  return (
    <div className="page-nav">
      <div className="card">
        {mode === "Reversal" && (
          <div className="reversal-card">
            <p className="visualizer">Reversing a Linked List</p>
            <div className="deco">
              <span /><span /><span />
            </div>

            <div className="progress-bar-wrap">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
     <div className="list-wrap">
        {nodes.map((node, i) => (
          <div key={node.id} className="node-wrap">
            <div className={getNodeClass(node.value)}>{node.value}</div>
            {i < nodes.length - 1 && (
              <div className={getArrowClass(node.value)}>
                {current.reversed.includes(node.value) ? "←" : "→"}
              </div>
            )}
          </div>
        ))}
      </div>
            <p className="explanation">{getExplanation(current.action)}</p>
            {/* Output preview */}
{current.reversed.length > 0 && (
  <div className="output-wrap">
    <p className="output-label">Output:</p>
    <div className="output-row">
      {[...current.reversed].reverse().map((val, i) => (
        <div key={val} className="node-wrap">
          <div className="node node-output">{val}</div>
          {i < current.reversed.length - 1 && (
            <div className="arrow arrow-output">→</div>
          )}
        </div>
      ))}
    </div>
  </div>
)}
          </div>
        )}
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
                disabled={step === STEPS.length - 1}
                className="btn btn-next"
              >
                Next Step →
              </button>
            
            </div>
      </div>    
    </div>
  );
}
