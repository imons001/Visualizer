// Breadth-First Search on a small undirected graph, recorded step by step.
// Each step also carries which Python lines are "running" so the code
// panel can highlight them in sync with the SVG.

export const startNode = "A";

// fixed pixel positions — everything lives in one SVG (no viewBox scaling)
export const nodes = [
  { id: "A", x: 80,  y: 150 },
  { id: "B", x: 210, y: 60  },
  { id: "C", x: 210, y: 240 },
  { id: "D", x: 350, y: 60  },
  { id: "E", x: 350, y: 240 },
  { id: "F", x: 480, y: 150 },
];

export const edges = [
  ["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"],
  ["C", "E"], ["D", "F"], ["E", "F"],
];

// adjacency list — same thing the Python code reads from
export const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D", "E"],
  D: ["B", "C", "F"],
  E: ["C", "F"],
  F: ["D", "E"],
};

export const pythonCode = [
  "from collections import deque",
  "",
  "def bfs(graph, start):",
  "    visited = {start}",
  "    queue = deque([start])",
  "    order = []",
  "    while queue:",
  "        node = queue.popleft()",
  "        order.append(node)",
  "        for neighbor in graph[node]:",
  "            if neighbor not in visited:",
  "                visited.add(neighbor)",
  "                queue.append(neighbor)",
  "    return order",
];

export const STEPS = (() => {
  const steps = [];
  const visited = new Set([startNode]);
  const queue = [startNode];
  const order = [];
  const treeEdges = []; // edges used to discover a new node

  const record = (extra) =>
    steps.push({
      current: null,
      neighbor: null,
      visited: [...visited],
      queue: [...queue],
      order: [...order],
      treeEdges: treeEdges.map((e) => [...e]),
      ...extra,
    });

  // start — mark the start node and queue it
  record({ action: "init", lines: [4, 5, 6] });

  while (queue.length) {
    // dequeue — take from the front, add to the visit order
    const node = queue.shift();
    order.push(node);
    record({ action: "dequeue", current: node, lines: [7, 8, 9] });

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        // enqueue — new node found
        visited.add(neighbor);
        queue.push(neighbor);
        treeEdges.push([node, neighbor]);
        record({ action: "enqueue", current: node, neighbor, lines: [10, 11, 12, 13] });
      } else {
        // skip — already seen
        record({ action: "skip", current: node, neighbor, lines: [10, 11] });
      }
    }
  }

  record({ action: "done", lines: [14] });
  return steps;
})();

export function getExplanation(step) {
  const { action, current, neighbor } = step;
  if (action === "init")    return `Start at ${startNode}: mark it visited and put it in the queue.`;
  if (action === "dequeue") return `Popper ${current} from the front of the queue and add it to the visit order.`;
  if (action === "enqueue") return `${neighbor} is a new neighbor of ${current} —>> mark it visited and add it to the back of the queue.`;
  if (action === "skip")    return `${neighbor} was already visited, so skip it.`;
  if (action === "done")    return "The queue is empty —> every reachable node has been visited.";
  return "";
}