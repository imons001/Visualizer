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
  if (action === "look")  return "Save your escape route — bookmark next = current.next before the link is broken.";
  if (action === "point") return "Flip the pointer — current.next = prev. The forward connection is severed.";
  if (action === "slide") return "Slide forward — prev = current, current = next. Repeat until done.";
  return "";
}