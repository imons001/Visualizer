import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Btree.css";
import { BTree, layoutTree, buildInitialSteps } from "../data/Btree.js";

function collectIds(node, out = []) {
  if (!node) return out;
  out.push(node.id);
  node.children.forEach((c) => collectIds(c, out));
  return out;
}

export default function BTreePage({ onBack }) {
  const treeRef = useRef(null);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [keyInput, setKeyInput] = useState("");

  useEffect(() => {
    const { tree, steps: initialSteps } = buildInitialSteps();
    treeRef.current = tree;
    setSteps(initialSteps);
    setStepIndex(0);
  }, []);

  const current = steps[stepIndex];

  const { positioned, edges, width, height } = useMemo(
    () => (current ? layoutTree(current.snapshot) : { positioned: [], edges: [], width: 200, height: 140 }),
    [current]
  );

  const prevIds = useMemo(() => {
    if (stepIndex === 0 || !steps[stepIndex - 1]) return new Set();
    return new Set(collectIds(steps[stepIndex - 1].snapshot));
  }, [stepIndex, steps]);

  if (!current) return null;

  const progressPct = steps.length ? ((stepIndex + 1) / steps.length) * 100 : 0;
  const operations = current.insertions + current.deletions;

  const goNext = () => setStepIndex((s) => Math.min(steps.length - 1, s + 1));
  const goPrev = () => setStepIndex((s) => Math.max(0, s - 1));

  const runSilentReset = () => {
    const { tree, steps: fresh } = buildInitialSteps();
    treeRef.current = tree;
    setSteps(fresh);
    setStepIndex(0);
  };

  const handleClear = () => {
    treeRef.current = new BTree(2);
    const empty = [];
    treeRef.current.pushStep(empty, "start", "Tree cleared. Insert a key to begin.", null);
    setSteps(empty);
    setStepIndex(0);
  };

  const parseKey = () => {
    const n = Number(keyInput.trim());
    return Number.isFinite(n) && keyInput.trim() !== "" ? Math.round(n) : null;
  };

  const handleInsert = () => {
    const key = parseKey();
    if (key === null) return;
    const existing = treeRef.current.collectKeys();
    if (existing.includes(key)) {
      setKeyInput("");
      return;
    }
    const newSteps = [];
    treeRef.current.insert(key, newSteps);
    const merged = [...steps, ...newSteps];
    setSteps(merged);
    setStepIndex(merged.length - 1);
    setKeyInput("");
  };

  const handleDelete = () => {
    const key = parseKey();
    if (key === null) return;
    const existing = treeRef.current.collectKeys();
    if (!existing.includes(key)) {
      setKeyInput("");
      return;
    }
    const newSteps = [];
    treeRef.current.remove(key, newSteps);
    const merged = [...steps, ...newSteps];
    setSteps(merged);
    setStepIndex(merged.length - 1);
    setKeyInput("");
  };

  const handleRandom = () => {
    const existing = treeRef.current.collectKeys();
    let key;
    do {
      key = Math.floor(Math.random() * 199) + 1;
    } while (existing.includes(key));
    const newSteps = [];
    treeRef.current.insert(key, newSteps);
    const merged = [...steps, ...newSteps];
    setSteps(merged);
    setStepIndex(merged.length - 1);
  };

  const explainClass =
    current.type === "split" ? "bt-explain-split" :
    current.type === "delete" ? "bt-explain-delete" :
    current.type === "done" ? "bt-explain-done" : "";

  return (
    <div className="bt-page">
      <div className="bt-shell">
        <div className="bt-header">
          <h1 className="bt-title">B-Tree Flow</h1>
          <p className="bt-subtitle">Watch keys travel down, split, and keep the tree balanced</p>
          <div className="bt-deco"><span /><span /><span /></div>
        </div>

        <div className="bt-progress-wrap">
          <div className="bt-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="bt-stats">
          <div className="bt-stat bt-stat-ops">
            <p className="bt-stat-label">Operations</p>
            <p className="bt-stat-value">{operations}</p>
          </div>
          <div className="bt-stat bt-stat-ins">
            <p className="bt-stat-label">Insertions</p>
            <p className="bt-stat-value">{current.insertions}</p>
          </div>
          <div className="bt-stat bt-stat-del">
            <p className="bt-stat-label">Deletions</p>
            <p className="bt-stat-value">{current.deletions}</p>
          </div>
        </div>

        <div className="bt-tree-panel">
          <svg
            className="bt-tree-svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
          >
            {edges.map((e) => {
              const childNode = positioned.find((p) => p.id === e.childId);
              const active = current.key !== null && childNode?.keys.includes(current.key) && current.type !== "start";
              return (
                <path
                  key={e.id}
                  className={active ? "bt-edge bt-edge-active" : "bt-edge"}
                  d={`M ${e.x1} ${e.y1 + 17} L ${e.x2} ${e.y2 - 17}`}
                />
              );
            })}

            {positioned.map((node) => {
              const isNew = stepIndex > 0 && !prevIds.has(node.id);
              const isSplit = isNew && current.type === "split";
              const isActive = !isSplit && current.key !== null && node.keys.includes(current.key);
              const cellW = node.keys.length ? node.w / node.keys.length : node.w;
              const left = node.x - node.w / 2;

              const nodeClass = [
                "bt-node",
                node.leaf ? "bt-node-leaf" : "bt-node-internal",
                isActive ? "bt-node-active" : "",
                isSplit ? "bt-node-split" : "",
              ].join(" ").trim();

              return (
                <g key={node.id} className={nodeClass}>
                  <rect
                    className="bt-node-rect"
                    x={left}
                    y={node.y - 17}
                    width={node.w}
                    height={34}
                    rx={10}
                    strokeDasharray={node.keys.length === 0 ? "4 3" : undefined}
                  />
                  {node.keys.length === 0 ? (
                    <text className="bt-key-text bt-key-empty" x={node.x} y={node.y}>
                      empty
                    </text>
                  ) : (
                    node.keys.map((k, i) => (
                      <g key={i}>
                        {i > 0 && (
                          <line
                            className="bt-key-div"
                            x1={left + cellW * i}
                            x2={left + cellW * i}
                            y1={node.y - 17}
                            y2={node.y + 17}
                          />
                        )}
                        <text
                          className={`bt-key-text ${k === current.key ? "bt-key-current" : ""}`}
                          x={left + cellW * (i + 0.5)}
                          y={node.y}
                        >
                          {k}
                        </text>
                      </g>
                    ))
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className={`bt-explain ${explainClass}`}>{current.message}</div>

        <div className="bt-key-panel">
          <p className="bt-key-panel-label">Add / Remove Key</p>
          <div className="bt-key-row">
            <input
              className="bt-key-input"
              type="number"
              placeholder="Enter a key…"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            />
            <button className="bt-btn bt-btn-insert" onClick={handleInsert}>Insert</button>
            <button className="bt-btn bt-btn-delete" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="bt-controls">
          <button className="bt-btn bt-btn-back" onClick={onBack}>← Back to Menu</button>
          <button className="bt-btn bt-btn-ghost" onClick={runSilentReset}>↺ Reset</button>
          <button className="bt-btn bt-btn-ghost" onClick={handleClear}>Clear Tree</button>
          <button className="bt-btn bt-btn-primary" onClick={handleRandom}>Random</button>
          <button className="bt-btn bt-btn-ghost" onClick={goPrev} disabled={stepIndex === 0}>← Previous</button>
          <button className="bt-btn bt-btn-ghost" onClick={goNext} disabled={stepIndex === steps.length - 1}>Next →</button>
        </div>

        <p className="bt-step-count">Step {stepIndex + 1} of {steps.length}</p>
      </div>
    </div>
  );
}