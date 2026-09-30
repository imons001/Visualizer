export const initialArray = [1, 3, 5, 7, 9, 11, 12, 15];
export const target = 14;

export const STEPS = (() => {
  const steps = [];
  let left = 0;
  let right = initialArray.length - 1;

  while (left < right) {
    const sum = initialArray[left] + initialArray[right];
    steps.push({
      left, right, sum,
      action: sum === target ? "found" : sum < target ? "move_left" : "move_right",
    });
    if (sum === target) break;
    else if (sum < target) left++;
    else right--;
  }
  return steps;
})();

export function getExplanation(action) {
  if (action === "found")    return "When both pointers point to numbers that sum to the target, we've found our answer and can stop searching.";
  if (action === "move_left") return "The sum is less than the target — moving the left pointer right increases the sum.";
  if (action === "move_left") return "The sum is less than the target — moving the left pointer right increases the sum.";
  return "The sum is greater than the target — moving the right pointer left decreases the sum.";
}

