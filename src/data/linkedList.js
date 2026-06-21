export const nodes = [
  { id: 1, value: 10, next: null },
  { id: 2, value: 20, next: null },
  { id: 3, value: 30, next: null },
  { id: 4, value: 40, next: null },
  { id: 5, value: 50, next: null },
]; 
//link nodes together 
for (let i = 0; i < nodes.length - 1; i++) {
  nodes[i].next = nodes[i + 1];
}
// snapshot
export const STEPS = (() => {
  const steps = [];
  const reversed = []; // to track the reversed portion of the list for visualization
  let prev = null;
  let current = nodes[0];
  let next = null;


  while (current) {
    next = current.next;

    // look at current state
    steps.push({ prev: prev?.value, 
        curr: current.value, 
        next: next?.value, 
        action: "look",
      reversed: [...reversed] });

    // point backwards
    current.next = prev;
    steps.push({ prev: prev?.value, 
      curr: current.value,
       next: next?.value, 
       action: "point",
       reversed: [...reversed] });

    // slide pointers
    prev = current;
    current = next;
    //once we slide, current node is now part of the reversed list
    reversed.push(prev.value);
    steps.push({ prev: prev?.value, 
        curr: current?.value, 
        next: current?.next?.value, 
        action: "slide",
        reversed: [...reversed] });
  }
  return steps;
})();

export function getExplanation(action) {
  if (action === "look")  return "Look at next node";
  if (action === "point") return "We reverse the link";
  if (action === "slide") return "We move our pointers forward ";
  return "";
}
