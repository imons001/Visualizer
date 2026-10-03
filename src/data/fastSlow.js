// Fast & slow pointers (Floyd's cycle detection)
// List: 0 → 1 → 2 → 3 → 4 → 5 ─┐
//               ↑_______________┘   (5 points back to 2)
export const nodes = [
  { id: 0, value: 0, next: null },
  { id: 1, value: 1, next: null },
  { id: 2, value: 2, next: null },
  { id: 3, value: 3, next: null },
  { id: 4, value: 4, next: null },
  { id: 5, value: 5, next: null },
];

for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
nodes[5].next = nodes[2]; // close the cycle — matches the arrow 5 → 2 in the SVG

export const pythonCode = [
  "def has_cycle(head):",
  "    slow = head",
  "    fast = head",
  "    while fast and fast.next:",
  "        slow = slow.next",
  "        fast = fast.next.next",
  "        if slow == fast:",
  "            return True",
  "    return False",
];

// hops fast needs to walk forward to reach slow (null if slow isn't ahead of it in the loop yet)
const gapBetween = (fast, slow) => {
  let n = fast, hops = 0;
  while (hops <= nodes.length) {
    if (n === slow) return hops;
    n = n.next;
    hops++;
  }
  return null;
};

export const STEPS = (() => {
  const steps = [];
  let slow = nodes[0];
  let fast = nodes[0];
  const push = (action, lines, extra = {}) =>
    steps.push({ slow: slow.value, fast: fast.value, action, lines, ...extra });

  push("start", [2, 3]);

  while (fast && fast.next) {
    push("check", [4]);
    slow = slow.next;
    push("move_slow", [5]);
    fast = fast.next.next;
    push("move_fast", [6]);
    if (slow === fast) {
      push("compare", [7], { gap: 0 });
      push("found", [8]);
      return steps;
    }
    push("compare", [7], { gap: gapBetween(fast, slow) });
  }
  push("no_cycle", [9]);
  return steps;
})();

export function getExplanation(c) {
  switch (c.action) {
    case "start":     return "Both pointers start at the head, node 0.";
    case "check":     return "fast and fast.next both exist, so the loop keeps going.";
    case "move_slow": return `slow moves one step to node ${c.slow}.`;
    case "move_fast": return `fast moves two steps to node ${c.fast}.`;
    case "compare":
      if (c.gap === 0) return `slow and fast are both on node ${c.slow}.`;
      if (c.gap === null) return `slow (${c.slow}) ≠ fast (${c.fast}). slow hasn't reached the loop yet.`;
      return `slow (${c.slow}) ≠ fast (${c.fast}). Inside the loop, fast is ${c.gap} step${c.gap > 1 ? "s" : ""} behind slow, and the gap shrinks by 1 every pass.`;
    case "found":     return `They met at node ${c.slow}. fast can only catch slow if the list loops, so there's a cycle: return True.`;
    case "no_cycle":  return "fast reached the end of the list, so there's no cycle: return False.";
    default:          return "";
  }
}