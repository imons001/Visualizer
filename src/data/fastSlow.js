//fast and slow pointer technique cycle detection
//create a linked list with a cycle for testing 1-8 
//with pointers that point to each other to create a cycle
export const nodes = [
    { id: 0, value: 0, next: null },
    { id: 1, value: 1, next: null },
    { id: 2, value: 2, next: null },
    { id: 3, value: 3, next: null },
    { id: 4, value: 4, next: null },   
    { id: 5, value: 5, next: null },
 
  ];
  export const STEPS = (() => {
    const steps = [];

    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }

    //closes the cycle by pointing the last node to the second node
    nodes[4].next = nodes[1];

  let slow = nodes[0];
  let fast = nodes[0];
//helper to get node to n distance 
//create right hurr bish 
const getNodeAtDistance = (f, s) => {
    if (f < s) [f, s] = [s, f]; // swap if f is less than s
    return f - s;
}

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    const distance = getNodeAtDistance(fast.value, slow.value);
    steps.push({slow: slow.value, fast: fast.value, distance: distance, action: "move"});
    if (slow === fast) {
      steps.push({slow: slow.value, fast: fast.value, distance: distance, action: "cycle detected"});
      break;
    }
  }
  return steps;
})();
 export function getExplanation(current) {
    if (current.action === "move") return `Move slow pointer to ${current.slow} and fast pointer to ${current.fast}. Distance between them is ${current.distance}.`;
    if (current.action === "cycle detected") return `Cycle detected! Slow pointer and fast pointer met at ${current.slow}.`;
  }