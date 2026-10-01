export const nodes = [
  { id: 1, value: 10, next: null },
  { id: 2, value: 20, next: null },
  { id: 3, value: 30, next: null },
  { id: 4, value: 40, next: null },
  { id: 5, value: 50, next: null },
];

export const STEPS = (() => {
  const steps = [];
  const reversed = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].next = nodes[i + 1];
  }
  let prev = null;
  let current = nodes[0];
  let next = null;

  while (current) {
    next = current.next;

    // look — save the escape route
    steps.push({
      prev: prev?.value,
      curr: current.value,
      next: next?.value,
      reversed: [...reversed],
      action: "look",
    });

    // point — flip current.next = prev, forward link is now severed
    current.next = prev;
    steps.push({
      prev: prev?.value,
      curr: current.value,
      next: next?.value,
      reversed: [...reversed],
      action: "point",
    });

    // slide — advance pointers, current node is now fully reversed
    prev = current;
    current = next;
    reversed.push(prev.value);
    steps.push({
      prev: prev?.value,
      curr: current?.value,
      next: current?.next?.value,
      reversed: [...reversed],
      action: "slide",
    });
  }
  return steps;
})();

export function getExplanation(action) {
  if (action === "look")  return "Save your escape with next = current.next before the link is broken.";
  if (action === "point") return "Flip the pointer current.next = prev. The forward connection is severed.";
  if (action === "slide") return "Slide forward prev = current, current = next. Repeat until done.";
  return "";
}

// ── Values for singly/doubly ──
// fresh lists so they don't use `nodes` (reversal mutates those)
export const listValues = nodes.map((n) => n.value);

const buildSingly = (values) => {
  const list = values.map((value, i) => ({ id: i + 1, value, next: null }));
  for (let i = 0; i < list.length - 1; i++) list[i].next = list[i + 1];
  return list;
};

const buildDoubly = (values) => {
  const list = values.map((value, i) => ({ id: i + 1, value, prev: null, next: null }));
  for (let i = 0; i < list.length - 1; i++) {
    list[i].next = list[i + 1];
    list[i + 1].prev = list[i];
  }
  return list;
};

// ── Singly: walk head → null using only next ──
export const SINGLY_STEPS = (() => {
  const steps = [];
  const visited = [];
  const head = buildSingly(listValues)[0];
  let current = head;

  while (current) {
    steps.push({
      curr: current.value,
      next: current.next ? current.next.value : null,
      visited: [...visited],
      action: current === head ? "head" : "visit",
    });
    visited.push(current.value);
    current = current.next;
  }
  steps.push({ curr: null, next: null, visited: [...visited], action: "end" });
  return steps;
})();

export function getSinglyExplanation({ action, curr, next }) {
  const nextText = next !== null ? `Its next points to ${next}.` : "Its next is null, so this is the tail.";
  if (action === "head")  return `Start at the head (${curr}). Each node only knows its value and next. ${nextText}`;
  if (action === "visit") return `current = current.next → ${curr}. ${nextText}`;
  if (action === "end")   return "current is null, so the walk is over. A singly list can only go forward — there's no way back.";
  return "";
}

// ── Doubly: forward with next, then back with prev ──
export const DOUBLY_STEPS = (() => {
  const steps = [];
  const list = buildDoubly(listValues);
  const snap = (node, direction, action) => ({
    curr: node.value,
    prev: node.prev ? node.prev.value : null,
    next: node.next ? node.next.value : null,
    direction,
    action,
  });

  let current = list[0];
  let tail = null;
  while (current) {
    steps.push(snap(current, "forward", current.next ? "forward" : "tail"));
    tail = current;
    current = current.next;
  }

  current = tail.prev;
  while (current) {
    steps.push(snap(current, "backward", current.prev ? "backward" : "head"));
    current = current.prev;
  }
  return steps;
})();

export function getDoublyExplanation({ action, curr, prev, next }) {
  if (action === "forward")  return `Moving forward with next. ${curr} knows both neighbors: prev = ${prev ?? "null"}, next = ${next}.`;
  if (action === "tail")     return `Reached the tail (${curr}). next is null, but prev still points to ${prev}, so we can turn around.`;
  if (action === "backward") return `Walking backward with current = current.prev. From ${curr}, prev leads to ${prev}.`;
  if (action === "head")     return `Back at the head (${curr}). prev is null. We traveled both directions, which a singly list can't do.`;
  return "";
}

