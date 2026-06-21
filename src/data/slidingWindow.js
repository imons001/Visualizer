export const initialArray = [1, 3, 5, 6, 9, 11, 12, 15, 4, 8];
export const target = 31;

export const STEPS = (() => {
  const steps = [];
  const windowSize = 3; // how many elements in the window 
  let tempSum = 0;
  let left = 0;
  // must be greater than the subarray length
    for (let right = 0; right < initialArray.length; right++) {
        tempSum += initialArray[right]; // add the new right element to the sum
        if (right - left + 1 === windowSize) {
            steps.push({
            left, right, tempSum,
            action: tempSum === target ? "found" : "scanning"
        });
        //slide the window
        if (tempSum === target) break;
        
        tempSum -= initialArray[left]; // remove the left element from the sum
        left++;
        }
    }
  return steps;
})();

export function getExplanation(action) {
  if (action === "found")    return "When the sum of the current window equals the target, we've found our answer and can stop searching.";
  if (action === "scanning") return "The Window has not yet reached the target sum, SLIDE!.";
  return "";
}
export const dynamicArray = [1, 3, 5, 6, 9, 11, 12, 15, 4, 8];
export const dynamicTarget = 31;

export const DYNAMIC_STEPS = (() => {
  const steps = [];
  const windowSize = 3;
  let tempSum = 0;
  let left = 0;
    for (let right = 0; right < dynamicArray.length; right++) {
        tempSum += dynamicArray[right];// add the new right element to the sum
        while(tempSum>=dynamicTarget){
        steps.push({
            left, right, tempSum,
            action: tempSum === dynamicTarget ? "found" : "scanning"
        });
        if (tempSum === dynamicTarget) break;
        
        tempSum -= dynamicArray[left]; // remove the left element from the sum
        left++;
        }
    }
  return steps;
})();