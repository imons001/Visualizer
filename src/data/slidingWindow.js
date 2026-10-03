// ── Fixed window: find k consecutive numbers that add up to the target ──
export const initialArray = [1, 3, 5, 6, 9, 11, 12, 15, 4, 8];
export const target = 31;
export const windowSize = 3;

export const FIXED_CODE = [
  "def fixed_window(nums, k, target):",
  "    window_sum = 0",
  "    left = 0",
  "    for right in range(len(nums)):",
  "        window_sum += nums[right]",
  "        if right - left + 1 == k:",
  "            if window_sum == target:",
  "                return [left, right]",
  "            window_sum -= nums[left]",
  "            left += 1",
  "    return None",
];

export const STEPS = (() => {
  const steps = [];
  const nums = initialArray, k = windowSize;
  let sum = 0, left = 0;
  const push = (action, lines, right) =>
    steps.push({ left, right, sum, action, lines, mode: "fixed" });

  push("start", [2, 3], -1);
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    if (right - left + 1 < k) { push("grow", [4, 5], right); continue; }

    push("check", [4, 5, 6, 7], right);
    if (sum === target) { push("found", [8], right); return steps; }

    sum -= nums[left];
    left++;
    push("slide", [9, 10], right);
  }
  push("not_found", [11], nums.length - 1);
  return steps;
})();

// ── Dynamic window: find any run of numbers that adds up to the target ──
export const dynamicArray = [1, 3, 5, 6, 9, 11, 12, 15, 4, 8];
export const dynamicTarget = 31;

export const DYNAMIC_CODE = [
  "def dynamic_window(nums, target):",
  "    window_sum = 0",
  "    left = 0",
  "    for right in range(len(nums)):",
  "        window_sum += nums[right]",
  "        while window_sum > target:",
  "            window_sum -= nums[left]",
  "            left += 1",
  "        if window_sum == target:",
  "            return [left, right]",
  "    return None",
];

export const DYNAMIC_STEPS = (() => {
  const steps = [];
  const nums = dynamicArray;
  let sum = 0, left = 0;
  const push = (action, lines, right) =>
    steps.push({ left, right, sum, action, lines, mode: "dynamic" });

  push("start", [2, 3], -1);
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    push(sum > dynamicTarget ? "over" : sum === dynamicTarget ? "check" : "grow", [4, 5], right);

    while (sum > dynamicTarget) {
      sum -= nums[left];
      left++;
      push("shrink", [6, 7, 8], right);
    }
    if (sum === dynamicTarget) { push("found", [9, 10], right); return steps; }
  }
  push("not_found", [11], nums.length - 1);
  return steps;
})();

export function getExplanation(c) {
  const t = c.mode === "fixed" ? target : dynamicTarget;
  const s = `Window sum is ${c.sum}`;
  switch (c.action) {
    case "start":
      return c.mode === "fixed"
        ? `Look for ${windowSize} numbers in a row that add up to ${t}. Start with an empty window.`
        : `Look for any run of numbers that adds up to ${t}. Start with an empty window.`;
    case "grow":
      return c.mode === "fixed"
        ? `Add the new number on the right. ${s}, but the window isn't ${windowSize} wide yet.`
        : `Add the new number on the right. ${s}, still under ${t}, so keep growing.`;
    case "check":
      return c.mode === "fixed"
        ? `The window is ${windowSize} wide. ${s}. Does it equal ${t}?`
        : `Add the new number on the right. ${s}. Does it equal ${t}?`;
    case "slide":
      return `${c.sum + initialArray[c.left - 1]} ≠ ${t}, so drop the leftmost number. ${s} and the window is ready to slide right.`;
    case "over":
      return `Add the new number on the right. ${s}, which is over ${t}, so shrink from the left.`;
    case "shrink":
      return c.sum > t
        ? `Drop the leftmost number. ${s}, still over ${t}, so keep shrinking.`
        : `Drop the leftmost number. ${s}, no longer over ${t}.`;
    case "found":
      return `${s}, which matches the target. Return [${c.left}, ${c.right}].`;
    case "not_found":
      return `No window adds up to ${t}. Return None.`;
    default:
      return "";
  }
}