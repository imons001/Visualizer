// Hash map (dictionary) with chaining.
// Simple hash: add up the character codes, then % bucketCount.
export const entries = [
  { key: "cat", value: 3 },
  { key: "dog", value: 1 },
  { key: "owl", value: 7 },
  { key: "fox", value: 2 },
  { key: "bee", value: 5 },
];
export const bucketCount = 5;

export const hashKey = (key) => {
  let sum = 0;
  for (const ch of key) sum += ch.charCodeAt(0);
  return sum;
};

// each key takes 3 steps: hash → mod → place
export const STEPS = (() => {
  const steps = [];
  const buckets = Array.from({ length: bucketCount }, () => []);
  const snap = () => buckets.map((b) => [...b]);

  for (const entry of entries) {
    const hash = hashKey(entry.key);
    const index = hash % bucketCount;
    steps.push({ entry, hash, index, buckets: snap(), action: "hash" });
    steps.push({ entry, hash, index, buckets: snap(), action: "mod" });

    const action = buckets[index].length > 0 ? "collision" : "insert";
    buckets[index].push(entry);
    steps.push({ entry, hash, index, buckets: snap(), action });
  }
  return steps;
})();

export function getExplanation(current) {
  const { entry, hash, index, action } = current;
  const codes = [...entry.key].map((ch) => ch.charCodeAt(0)).join(" + ");
  if (action === "hash")      return `Add up the letter codes in "${entry.key}": ${codes} = ${hash}.`;
  if (action === "mod")       return `${hash} % ${bucketCount} = ${index}, so "${entry.key}" belongs in bucket ${index}.`;
  if (action === "insert")    return `Bucket ${index} was empty, so "${entry.key}: ${entry.value}" is placed there.`;
  if (action === "collision") return `Bucket ${index} already has a key. Collision! "${entry.key}: ${entry.value}" is add to the end of the chain.`;
  return "";
}